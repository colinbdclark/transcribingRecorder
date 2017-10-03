/*
Social Justice Repair Kit Story Recorder
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

// TODO: Render a "listening" icon when we are actively recording a transcript.
fluid.defaults("sjrk.transcriptView", {
    gradeNames: "fluid.viewComponent",

    model: {
        utterances: []
    },

    modelListeners: {
        utterances: {
            excludeSource: "init",
            funcName: "sjrk.transcriptView.refreshView",
            args: ["{that}", "{change}.value"]
        }
    },

    selectors: {
        utteranceTable: ".sjrk-transcriptView-utterances",
        utterances: ".sjrk-transcriptView-utterance"
    },

    markup: {
        utteranceTable: "<table class='sjrk-transcriptView-utterances'><tr><th>Start</th><th>End</th><th>Text</th></tr><tr class='sjrk-transcriptView-utterance'><td  colspan='3'>No transcript</td></table>",
        utterance: "<tr class='sjrk-transcriptView-utterance'><td>%startTime</td><td>%endTime</td><td>%text</td></tr>"
    },

    listeners: {
        "onCreate.renderTranscriptTable": {
            "this": "{that}.container",
            method: "append",
            args: ["{that}.options.markup.utteranceTable"]
        }
    }
});

sjrk.transcriptView.refreshView = function (that, utterances) {
    var table = that.locate("utteranceTable");
    that.locate("utterances").remove();

    fluid.each(utterances, function (utterance) {
        var rendered = fluid.stringTemplate(that.options.markup.utterance, utterance);
        table.append(rendered);
    });
};
