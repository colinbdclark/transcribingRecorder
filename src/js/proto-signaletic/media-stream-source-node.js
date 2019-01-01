/*
(Proto-) Signaletic
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

/**
 * A wrapper for a MediaStreamAudioSourceNode.
 */
fluid.defaults("signaletic.mediaStreamAudioSourceNode", {
    gradeNames: "signaletic.audioNode",

    members: {
        mediaStream: "@expander:fluid.notImplemented()",

        node: {
            expander: {
                "this": "{audioContext}",
                method: "createMediaStreamAudioSource",
                args: [
                    "{that}.mediaStream"
                ]
            }
        }
    }
});
