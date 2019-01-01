/*
(Proto-) Signaletic
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

fluid.defaults("signaletic.audioBuffer", {
    gradeNames: "fluid.component",

    numberOfChannels: 1,
    sampleRate: "{webAudioContext}.context.sampleRate",

    members: {
        buffer: "@expand:signaletic.audioBuffer.create({that}.options)"
    },

    invokers: {
        /**
         * Converts this buffer into a channel-interleaved Float32Array.
         */
        toInterleavedArray: {
            funcName: "signaletic.audioBuffer.interleave",
            args: ["{that}.buffer"]
        }
    }
});

signaletic.audioBuffer.create = function (options) {
    var buffer = new AudioBuffer({
        length: options.length,
        numberOfChannels: options.numberOfChannels,
        sampleRate: options.sampleRate
    });

    return buffer;
};

/**
 * Takes a raw AudioBuffer and converts it into a
 * channel-interleaved Float32Array.
 */
signaletic.audioBuffer.interleave = function (buffer) {
    var interleaved = new Float32Array(buffer.length * buffer.numberOfChannels);
    var sampleIdx = 0;

    for (var frameNumber = 0; frameNumber < buffer.length; frameNumber++) {
        for (var channelNumber = 0; channelNumber < buffer.numberOfChannels; channelNumber++) {
            interleaved[sampleIdx] = buffer.getChannelData(channelNumber)[frameNumber];
            sampleIdx++;
        }
    }

    return interleaved;
};
