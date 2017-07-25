"use strict";

// TODO: Render a "listening" icon when we are actively recording a transcript.
fluid.defaults("sjrk.transcriptView", {
    gradeNames: "fluid.viewComponent",

    model: {
        transcript: ""
    },

    modelListeners: {
        transcript: {
            funcName: "sjrk.transcriptView.refreshView",
            args: ["{that}.container", "{change}.value"]
        }
    }
});

sjrk.transcriptView.refreshView = function (container, transcript) {
    container.text(transcript);
};
