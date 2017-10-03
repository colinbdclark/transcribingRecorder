/*
Social Justice Repair Kit Story Recorder
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

fluid.defaults("sjrk.mediaStreamRecorder", {
    gradeNames: ["sjrk.audioRecorderStrategy"],

    mediaRecorderOptions: {
        type: "audio/webm;codec=opus"
    },

    members: {
        mediaRecorder: {
            expander: {
                funcName: "sjrk.mediaStreamRecorder.createRecorder",
                args: [
                    "{mediaDevice}.streamHolder.stream",
                    "{that}.options.mediaRecorderOptions"
                ]
            }
        },

        chunks: []
    },

    invokers: {
        start: {
            "this": "{that}.mediaRecorder",
            method: "start"
        },

        pause: {
            "this": "{that}.mediaRecorder",
            method: "pause"
        },

        resume: {
            "this": "{that}.mediaRecorder",
            method: "resume"
        },

        stop: {
            "this": "{that}.mediaRecorder",
            method: "stop"
        },

        requestData: {
            "this": "{that}.mediaRecorder",
            method: "requestData"
        },

        isTypeSupported: {
            "this": "{that}.mediaRecorder",
            method: "isTypeSupported"
        }
    },

    events: {
        onError: null,
        onPause: null,
        onResume: null,
        onStart: null,
        onDataAvailable: null,
        onStop: null
    },

    eventMap: {
        onDataAvailable: "dataavailable",
        onError: "error",
        onPause: "pause",
        onResume: "resume",
        onStart: "start",
        onStop: "stop"
    },

    listeners: {
        "onCreate.bindEvents": {
            funcName: "sjrk.mediaStreamRecorder.bindEvents",
            args: ["{that}"]
        },

        "onDataAvailable.addChunk": {
            funcName: "sjrk.mediaStreamRecorder.addChunk",
            args: ["{that}", "{arguments}.0"]
        },

        "onStop.fireAudioReady": {
            func: "{that}.events.onAudioReady.fire",
            args: ["{that}.chunks"]
        },

        "onStop.clearChunks": {
            priority: "after:fireAudioReady",
            funcName: "sjrk.mediaStreamRecorder.clearChunks",
            args: ["{that}.chunks"]
        }
    }
});

sjrk.mediaStreamRecorder.createRecorder = function (stream) {
    return new MediaRecorder(stream);
};

sjrk.mediaStreamRecorder.bindEvents = function (that) {
    fluid.each(that.options.eventMap, function (mediaRecorderName, firerName) {
        that.mediaRecorder.addEventListener(mediaRecorderName,
            that.events[firerName].fire, false);
    });
};

sjrk.mediaStreamRecorder.addChunk = function (that, blobEvent) {
    that.chunks.push(blobEvent.data);
};

sjrk.mediaStreamRecorder.clearChunks = function (chunks) {
    chunks.length = 0;
};


/**
 * A MediaStreamRecorder that automatically starts recording
 * as soon as it is created.
 */
fluid.defaults("sjrk.audioRecorder.autoStartMediaStreamRecorder", {
    gradeNames: "sjrk.mediaStreamRecorder",

    listeners: {
        "onCreate.startRecording": "{that}.start()"
    }
});
