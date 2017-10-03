"use strict";

fluid.defaults("sjrk.storyRecorder", {
    gradeNames: ["fluid.viewComponent", "fluid.contextAware"],

    contextAwareness: {
        speechRecAware: {
            checks: {
                speechRecAware: {
                    contextValue: "{sjrk.supportsSpeechRec}",
                    gradeNames: "sjrk.storyRecorder.withTranscription"
                }
            },
            defaultGradeNames: "fluid.viewComponent"
        }
    },

    components: {
        audioRecorder: {
            type: "sjrk.audioRecorder",
            options: {
                events: {
                    onRecordingAvailable: "{storyRecorder}.events.onRecordingAvailable"
                }
            }
        }

        // TODO: Implement an AudioView that instantiates a component
        // per recording.
    },

    selectors: {
        record: ".sjrk-storyRecorder-record",
        stop: ".sjrk-storyRecorder-stop",
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
            funcName: "sjrk.storyRecorder.injectAudio",
            args: ["{that}", "{arguments}.0"]
        }
    },

    invokers: {
        record: "{that}.events.onRecord.fire",
        stop: "{that}.events.onStop.fire"
    }
});

sjrk.storyRecorder.injectAudio = function (that, dataURL) {
    var playerMarkup = fluid.stringTemplate(that.options.markup.audio, {
        url: dataURL
    });

    that.container.append(playerMarkup);
    that.container.append("<hr />");
};
