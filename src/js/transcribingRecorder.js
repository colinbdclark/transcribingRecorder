"use strict";

fluid.defaults("sjrk.voiceRecorder", {
    gradeNames: ["fluid.viewComponent"],

    components: {
        // TODO: Use Infusion context awareness to only instantiate a
        // speechTranscriber/transcriptView when we're in a
        // SpeechRecognition-capable browser
        speechTranscriber: {
            type: "sjrk.speechTranscriber"
        },

        transcriptView: {
            type: "sjrk.transcriptView",
            container: "{voiceRecorder}.dom.transcript",
            options: {
                model: {
                    utterances: "{speechTranscriber}.model.utterances"
                }
            }
        },

        audioRecorder: {
            type: "sjrk.audioRecorder",
            options: {
                events: {
                    onRecordingAvailable: "{voiceRecorder}.events.onRecordingAvailable"
                }
            }
        }

        // TODO: Implement an AudioView that instantiates a component
        // per recording.
    },

    selectors: {
        record: ".sjrk-voiceRecorder-record",
        stop: ".sjrk-voiceRecorder-stop",
        transcript: ".sjrk-voiceRecorder-transcript"
    },

    markup: {
        audio: "<audio controls src='%url'></audio>"
    },

    events: {
        onRecord: null,
        onStop: null,
        onRecordingAvailable: null
    },

    listeners: {
        "onCreate.bindRecord": {
            "this": "{that}.dom.record",
            method: "click",
            args: ["{that}.events.onRecord.fire"],
            priority: "after:appendTemplate"
        },

        "onCreate.bindStop": {
            "this": "{that}.dom.stop",
            method: "click",
            args: ["{that}.events.onStop.fire"],
            priority: "after:appendTemplate"
        },

        "onRecordingAvailable.injectAudio": {
            funcName: "sjrk.voiceRecorder.injectAudio",
            args: ["{that}", "{arguments}.0"]
        }
    },

    invokers: {
        record: "{that}.events.onRecord.fire",
        stop: "{that}.events.onStop.fire"
    }
});

sjrk.voiceRecorder.injectAudio = function (that, dataURL) {
    var playerMarkup = fluid.stringTemplate(that.options.markup.audio, {
        url: dataURL
    });

    that.container.append(playerMarkup);
    that.container.append("<hr />");
};
