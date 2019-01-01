/*
(Proto-) Signaletic
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

fluid.defaults("signaletic.scriptProcessorNode", {
    gradeNames: "signaletic.audioNode",

    bufferSize: 512,

    members: {
        node: {
            expander: {
                funcName: "signaletic.scriptProcessorNode.createNode",
                args: [
                    "{that}",
                    "{webAudioContext}",
                    "{that}.options.bufferSize",
                    "{that}.events.onAudioProcess.fire"
                ]
            }
        }
    },

    events: {
        onProcessAudio: null
    }
});

signaletic.scriptProcessorNode.createNode = function (that, ac, bufferSize) {
    var scriptProcessor = ac.audioContext.createScriptProcessorNode(bufferSize);
    scriptProcessor.onaudioprocess = that.events.onProcessAudio.fire;

    return scriptProcessor;
};
