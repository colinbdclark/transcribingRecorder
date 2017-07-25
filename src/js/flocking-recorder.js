"use strict";

fluid.defaults("sjrk.flockingRecorder", {
    gradeNames: [
        "fluid.modelComponent", "sjrk.audioRecorderStrategy"
    ],

    maxDuration: 15,
    bufferID: "recording",

    model: {
        startTime: 0,
        endTime: 0
    },

    components: {
        enviro: {
            type: "flock.silentEnviro"
        },

        synth: {
            type: "sjrk.flockingRecorder.synth"
        }
    },

    invokers: {
        start: "{that}.events.onStart.fire()",
        stop: "{that}.events.onStop.fire()"
    },

    events: {
        onStart: null,
        onStop: null
    },

    listeners: {
        "onStart.markTime": {
            funcName: "sjrk.flockingRecorder.markTime",
            args: ["{that}", "startTime"]
        },

        "onStart.startEnviro": {
            priority: "after:markTime",
            func: "{enviro}.start"
        },

        "onStart.playSynth": {
            priority: "after:startEnviro",
            func: "{synth}.play"
        },

        "onStop.markTime": {
            funcName: "sjrk.flockingRecorder.markTime",
            args: ["{that}", "stopTime"]
        },

        "onStop.pauseSynth": {
            priority: "after:markTime",
            func: "{synth}.pause"
        },

        "onStop.stopEnviro": {
            priority: "after:pauseSynth",
            func: "{enviro}.stop"
        },

        "onStop.encodeBuffer": {
            priority: "after:stopEnviro",
            funcName: "sjrk.flockingRecorder.encodeBuffer",
            args: ["{that}"]
        },

        "onStop.resetRecordingBuffer": {
            priority: "after:encodeBuffer",
            funcName: "sjrk.flockingRecorder.resetRecordingBuffer",
            args: ["{that}"]
        }
    }
});

sjrk.flockingRecorder.markTime = function (that, timePath) {
    that.applier.change(timePath, Date.now());
};

sjrk.flockingRecorder.resetRecordingBuffer = function (that) {
    // A travesty of sorts.
    // TODO: Worse yet, this doesn't even work!
    that.enviro.releaseBuffer(that.options.bufferID);
    that.synth.get("bufferWriter").onInputChanged("buffer");
};

// TODO: Move this to Flocking.
sjrk.flockingRecorder.trimBuffer = function (duration, bufDesc) {
    var sampleFrames = Math.ceil(duration * bufDesc.format.sampleRate);

    var trimmedChannels = fluid.transform(bufDesc.data.channels, function (channel) {
        return channel.slice(0, sampleFrames);
    });

    return {
        format: {
            sampleRate: bufDesc.format.sampleRate,
            numChannels: bufDesc.format.numChannels,
            numSampleFrames: sampleFrames,
            duration: duration
        },

        data: {
            channels: trimmedChannels
        }
    };
};

sjrk.flockingRecorder.encodeBuffer = function (that) {
    var bufDesc = that.enviro.buffers[that.options.bufferID],
        actualDuration = (that.model.stopTime - that.model.startTime) / 1000;

    var trimmed = sjrk.flockingRecorder.trimBuffer(actualDuration, bufDesc);

    var encoded = flock.audio.encode.wav(trimmed, "int16");

    that.events.afterAllData.fire([encoded], "audio/wav");
};

fluid.defaults("sjrk.flockingRecorder.synth", {
    gradeNames: "flock.synth",

    components: {
        enviro: "{flockingRecorder}.enviro"
    },

    synthDef: {
        id: "bufferWriter",

        ugen: "flock.ugen.writeBuffer",

        options: {
            duration: "{flockingRecorder}.options.maxDuration",
            numOutputs: 1
        },

        buffer: "{flockingRecorder}.options.bufferID",

        sources: {
            ugen: "flock.ugen.audioIn"
        }
    }
});
