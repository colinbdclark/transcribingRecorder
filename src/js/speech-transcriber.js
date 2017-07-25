"use strict";

fluid.defaults("sjrk.speechTranscriber", {
    gradeNames: ["fluid.modelComponent", "sjrk.transcriber"],

    speechOptions: {
        continuous: true
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
        transcript: ""
    },

    events: {
        onResult: null,
        onReset: null
    },

    invokers: {
        reset: "{that}.events.onReset.fire()",

        start: {
            "this": "{that}.speechRecognizer",
            method: "start"
        },

        stop: {
            "this": "{that}.speechRecognizer",
            method: "stop"
        }
    },

    listeners: {
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
    var results = resultEvt.results;

    for (var i = resultEvt.resultIndex; i < results.length; i++) {
        var result = results[i];
        if (result.isFinal) {
            that.applier.change("transcript",
                that.model.transcript + result[0].transcript);
        }
    }
};
