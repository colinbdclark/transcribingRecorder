"use strict";

fluid.defaults("sjrk.speechTranscriber", {
    gradeNames: ["fluid.modelComponent", "sjrk.transcriber"],

    speechOptions: {
        continuous: true,
        interimResults: true
    },

    members: {
        speechRecognizer: {
            expander: {
                funcName: "sjrk.speechTranscriber.createRecognizer",
                args: ["{that}"]
            }
        }
    },

    model: {
        // TODO: Add support for tracking interim results.
        transcript: "",
        utterances: [],
        startTime: 0,
        interimResultsPending: false,
        interimResultStart: 0
    },

    events: {
        onStart: null,
        onResult: null,
        onReset: null
    },

    invokers: {
        reset: "{that}.events.onReset.fire()",

        start: "{that}.events.onStart.fire()",

        stop: {
            "this": "{that}.speechRecognizer",
            method: "stop"
        }
    },

    listeners: {
        "onStart.startRecognizer": {
            "this": "{that}.speechRecognizer",
            method: "start"
        },

        "onStart.markTime": {
            funcName: "sjrk.time.applyNow",
            args: ["{that}.applier", "startTime"]
        },

        "onReset.stop": "{that}.stop()",

        "onReset.clearTranscript": {
            priority: "after:stop",
            changePath: "transcript",
            value: ""
        },

        "onResult.transcribe": {
            funcName: "sjrk.speechTranscriber.transcribeResults",
            args: ["{that}", "{arguments}.0"]
        }
    },

});

sjrk.speechTranscriber.createRecognizer = function (that) {
    var recognizer = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    fluid.each(that.options.speechOptions, function (val, key) {
        recognizer[key] = val;
    });

    recognizer.onresult = that.events.onResult.fire;

    return recognizer;
};

sjrk.speechTranscriber.transcribeResults = function (that, resultEvt) {
    var hasInterimResult = false,
        results = resultEvt.results;

    for (var i = resultEvt.resultIndex; i < results.length; i++) {
        var result = results[i];
        if (!result.isFinal) {
            hasInterimResult = true;
            break;
        }
    }

    if (hasInterimResult && !that.model.interimResultsPending) {
        sjrk.speechTranscriber.interimResultsStart(that.applier);
    } else if (!hasInterimResult && that.model.interimResultsPending) {
        // TODO: This is very likely an error, since it assumes that there is
        // only one new finalized result occurring at the end of a period of
        // interim results.
        //
        // It seems quite possible that some interim results will actually
        // be finalized while others remain interim,
        // and so we'll likely be overly "clumpy".
        //
        // Instead, we should transcribe each new finalized result
        // and reset the interimResultStart time accordingly.
        sjrk.speechTranscriber.addUtterance(that, results);
        sjrk.speechTranscriber.interimResultsEnd(that.applier);
    }
};

sjrk.speechTranscriber.interimResultsStart = function (applier) {
    sjrk.time.applyNow(applier, "interimResultStart");
    applier.change("interimResultsPending", true);
};

sjrk.speechTranscriber.interimResultsEnd = function (applier) {
    applier.change("interimResultsPending", false);
};

sjrk.speechTranscriber.addUtterance = function (that, results) {
    var utterance = {
        startTime: (that.model.interimResultStart - that.model.startTime) / 1000,
        endTime: (Date.now() - that.model.startTime) / 1000,
        text: results[results.length - 1][0].transcript
    };

    // TODO: Is this the best way to handle arrays
    // using the ChangeApplier currently?
    that.applier.change("utterances" + "." + that.model.utterances.length,
        utterance);
};
