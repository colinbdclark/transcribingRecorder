/*
(Proto-) Signaletic
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

fluid.defaults("signaletic.masterOutput", {
    gradeNames: "WHAT IS THIS THING?",

    components: {
        gain: {
            type: "signaletic.gainNode"
        },

        destination: {
            type: "signaletic.audioDestinationNode"
        }
    },

    listeners: {
        // TODO: Replace this when we have
        // Signaletic connection specifications.
        "onCreate.connectGainToDestination": {
            func: "{gain}.connect",
            args: ["{destination}"]
        }
    }
});
