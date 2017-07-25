"use strict";

/**
 * An AudioRecorder provides a simple interface for recording audio
 * and encoding it into a format suitable for playing with an <audio> element.
 */
fluid.defaults("sjrk.audioRecorder", {
    gradeNames: ["sjrk.transcriber"],

    constraints: {
        audio: true,
        video: false
    },

    components: {
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
        onMediaAccess: null,
        onMediaError: null,
        onRecordingStart: null,
        onStop: null,
        onDataAvailable: null,
        onRecordingStop: null,
        afterAllData: null
    },

    listeners: {
        "onCreate.requestMediaAccess": {
            // TODO: Add a shim for navigator.mediaDevices.getUserMedia()
            // so that we are Safari-ready.
            "this": "navigator",
            method: "getUserMedia",
            args: [
                "{that}.options.constraints",
                "{that}.events.onMediaAccess.fire",
                "{that}.events.onMediaError.fire",
            ]
        },

        "afterAllData.encodeAudio": {
            funcName: "sjrk.audioRecorder.encodeAudio",
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

sjrk.audioRecorder.encodeAudio = function (that, data, encoding) {
    var audioBlob = new Blob(data, {
        type: encoding
    });

    var dataURL = window.URL.createObjectURL(audioBlob);
    that.events.onRecordingAvailable.fire(dataURL);
};
