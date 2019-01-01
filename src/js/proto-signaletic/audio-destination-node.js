/*
(Proto-) Signaletic
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

/**
 * A wrapper for an AudioDestinationNode sourced, by default,
 * via the {webAudioContext} IoC reference.
 */
fluid.defaults("signaletic.audioDestinationNode", {
    gradeNames: "signaletic.audioNode",

    model: {
        channelCount: "{webAudioContext}.model.channelCount"
    },

    members: {
        node: "{webAudioContext}.context.destination"
    }
});
