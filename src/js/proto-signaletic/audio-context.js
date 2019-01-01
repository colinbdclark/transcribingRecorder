/*
(Proto-) Signaletic
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

/**
 * A wrapper around the Web Audio API's AudioContext object.
 */
fluid.defaults("signaletic.audioContext", {
    gradeNames: "fluid.component",

    members: {
        context: "@expand:signaletic.audioContext.create()",
        sampleRate: "{that}.context.sampleRate"
    },

    model: {
        channelCount: 2
    },

    components: {
        destination: {
            type: "signaletic.audioDestinationNode"
        }
    }
});

signaletic.audioContext.create = function () {
    return new (window.AudioContext || window.webkitAudioContext)();
};
