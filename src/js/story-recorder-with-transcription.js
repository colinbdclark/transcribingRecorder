/*
Social Justice Repair Kit Story Recorder
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

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
