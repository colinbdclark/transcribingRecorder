"use strict";

fluid.defaults("sjrk.storyRecorder.withTranscription", {
    gradeNames: "fluid.component",

    components: {
        speechTranscriber: {
            type: "sjrk.speechTranscriber"
        },

        transcriptView: {
            type: "sjrk.transcriptView",
            container: "{storyRecorder}.dom.transcript",
            options: {
                model: {
                    utterances: "{speechTranscriber}.model.utterances"
                }
            }
        }
    },

    selectors: {
        transcript: ".sjrk-storyRecorder-transcript"
    }
});
