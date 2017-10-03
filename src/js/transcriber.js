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
