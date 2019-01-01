/*
Social Justice Repair Kit Story Recorder
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

/**
 * An AudioBuffer that is the target for an AudioChunkAssembler
 * to assemble its chunks into.
 */
fluid.defaults("sjrk.audioChunkAssemblerTargetBuffer", {
    gradeNames: "sjrk.audioBuffer",

    sampleRate: "{audioChunkAssembler}.options.sampleRate",
    numberOfChannels: "{audioChunkAssembler}.options.numberOfChannels",

    listeners: {
        "onCreate.copyChunks": {
            funcName: "sjrk.audioChunkAssembler.copyChunks",
            args: ["{audioChunkAssembler}.chunks", "{that}"]
        }
    }
});

/**
 * A component that can assemble audio "chunks"
 * (i.e. an arbitrary set of multi-channel sample blocks)
 * into an AudioBuffer.
 */
fluid.defaults("sjrk.audioChunkAssembler", {
    gradeNames: "fluid.component",

    numberOfChannels: 1,
    bufferSize: 512,
    sampleRate: 44100,

    members: {
        chunks: []
    },

    model: {
        recordingLength: 0
    },

    components: {
        recording: {
            createOnEvent: "onAssembleRecording",
            type: "sjrk.audioChunkAssemblerTargetBuffer",
            options: {
                length: "{arguments}.0"
            }
        }
    },

    invokers: {
        assembleRecording: {
            funcName: "sjrk.audioChunkAssembler.updateRecordingLength",
            args: [
                "{that}.options.chunks",
                "{that}.options.bufferSize"
            ]
        }
    },

    events: {
        onAssembleRecording: null
    },

    modelListeners: {
        calcRecordingLength: {
            path: "recordingLength",
            func: "{that}.events.onAssembleRecording.fire",
            args: ["{change}.value"]
        }
    }
});

sjrk.audioChunkAssembler.updateRecordingLength = function (that) {
    var recordingLength = numberOfChunks * bufferSize;
    that.change("recordingLength", recordingLength);
};

sjrk.audioChunkAssembler.copyChunks = function (chunks, recording) {
    fluid.each(chunks, function (channelChunks, chunkNumber) {
        fluid.each(channelChunks, function (chunk, channelNumber) {
            recording.copyToChannel(chunk, channelNumber, chunkNumber * chunk.length);
        });
    });

    return recording;
};


fluid.defaults("sjrk.bufferRecorder", {
    gradeNames: "fluid.component",

    components: {
        chunkAssembler: {
            type: "sjrk.audioChunkAssembler",
            options: {
                sampleRate: "{webAudioContext}.sampleRate",
                bufferSize: "{bufferRecorderNode}.options.bufferSize",
                numberOfChannels: "{webAudioContext}.model.numberOfChannels"
            }
        },

        bufferRecorderNode: {
            type: "signaletic.bufferRecorderNode",
            options: {
                members: {
                    chunks: "{chunkAssembler}.chunks"
                }
            }
        }
    },

    invokers: {
        // TODO: Start and stop
    }
});
