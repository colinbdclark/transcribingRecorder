/*
Social Justice Repair Kit Story Recorder
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/


"use strict";

/**
 * An AudioRecorder provides a simple interface for recording audio
 * and encoding it into a format suitable for playing with an <audio> element.
 */
fluid.defaults("sjrk.audioRecorder", {
    gradeNames: ["sjrk.transcriber"],

    components: {
        mediaDevice: {
            type: "sjrk.audioDevice"
        },

        recordingStrategy: {
            createOnEvent: "onMediaAccess",
            type: "sjrk.mediaStreamRecorder",
            options: {
                stream: "{arguments}.0"
            }
        }
    },

    invokers: {
        start: "{that}.events.onRecordingStart.fire()",
        stop: "{that}.events.onRecordingStop.fire()"
    },

    events: {
        onMediaAccess: "{mediaDevice}.events.onAccess",
        onMediaError: "{mediaDevice}.events.onError",
        onRecordingStart: null,
        onStop: null,
        onDataAvailable: null,
        onRecordingStop: null,
        onAudioReady: null
    },

    listeners: {
        "onCreate.requestMediaAccess": {
            func:"{that}.mediaDevice.requestAccess"
        },

        "onAudioReady.dataURLFromRawData": {
            funcName: "sjrk.audioRecorder.dataURLFromRawData",
            args: ["{that}", "{arguments}.0", "{arguments}.1"]
        },

        "onMediaError.logError": {
            funcName: "fluid.log",
            args: [
                fluid.logLevel.error,
                "{arguments}.0"
            ]
        }
    }
});

sjrk.audioRecorder.dataURLFromRawData = function (that, data, encoding) {
    var audioBlob = new Blob(data, {
        type: encoding
    });

    var dataURL = window.URL.createObjectURL(audioBlob);
    that.events.onRecordingAvailable.fire(dataURL);
};
