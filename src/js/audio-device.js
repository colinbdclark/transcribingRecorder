"use strict";

fluid.defaults("sjrk.audioDevice", {
    gradeNames: "sjrk.mediaDevice",

    constraints: {
        audio: true,
        video: false
    }
});
