/*
Social Justice Repair Kit Story Recorder
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

/**
 * A base grade that starts and stops
 * transcribing.
 */
fluid.defaults("sjrk.transcriber", {
    gradeNames: "fluid.component",

    invokers: {
        start: "fluid.mustBeOverridden",
        stop: "fluid.mustBeOverridden"
    },

    listeners: {
        "{storyRecorder}.events.onRecord": "{that}.start",
        "{storyRecorder}.events.onStop": "{that}.stop"
    }
})
