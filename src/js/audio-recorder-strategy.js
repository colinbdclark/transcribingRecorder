"use strict";

fluid.defaults("sjrk.audioRecorderStrategy", {
    gradeNames: "fluid.component",

    events: {
        onRecordingStart: "{audioRecorder}.events.onRecordingStart",
        onRecordingStop: "{audioRecorder}.events.onRecordingStop",
        afterAllData: "{audioRecorder}.events.afterAllData"
    },

    listeners: {
        "onRecordingStart.start": "{that}.start()",
        "onRecordingStop.stop": "{that}.stop()"
    }
});
