/*
(Proto-) Signaletic
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

fluid.defaults("signaletic.bufferRecorderNode", {
    gradeNames: "signaletic.scriptProcessorNode",

    members: {
        chunks: []
    },

    listeners: {
        "onProcessAudio.processAudio": {
            funcName: "signaletic.bufferRecorderNode.processAudio"
        }
    }
});

signaletic.bufferRecorderNode.processAudio = function (that, audioProcessingEvent) {
    var inputs = audioProcessingEvent.inputBuffer;
    var channelChunks = [];

    for (var i = 0; i < inputs.numberOfChannels; i++) {
        var chunk = new Float32Array(inputs.length);
        inputs.copyFromChannel(chunk, i);
        channelChunks[i] = chunk;
    }

    that.chunks.push(channelChunks);
};
