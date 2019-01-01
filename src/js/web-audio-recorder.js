/*
Social Justice Repair Kit Story Recorder
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

fluid.defaults("sjrk.webAudioRecorder", {
    gradeNames: "sjrk.audioRecorderStrategy",

    components: {
        mediaStreamSource: {
            type: "signaletic.mediaStreamAudioSourceNode",
            options: {
                members: {
                    mediaStream: "{mediaDevice}.streamHolder.stream"
                }
            }
        },

        bufferRecorder: {
            type: "sjrk.bufferRecorder"
        },

        destination: {
            type: "signaletic.audioDestinationNode"
        }
    },

    listeners: {
        "onCreate.wireStreamToRecorder": {
            func: "{mediaStreamSource}.connect",
            args: ["{bufferRecorder}.bufferRecorderNode"]
        },

        "onCreate.wireRecorderToDestination": {
            func: "{bufferRecorder}.bufferRecorderNode.connect",
            args: ["{destination}"]
        }
    }
});
