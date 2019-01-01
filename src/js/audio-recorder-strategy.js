/*
Social Justice Repair Kit Story Recorder
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

/**
 * An AudioRecorderStrategy is an "abstract grade" used by sjrk.audioRecorder,
 * which represents a particular strategy for capturing and encoding
 * audio.
 */
fluid.defaults("sjrk.audioRecorderStrategy", {
    gradeNames: "fluid.component",

    events: {
        onRecordingStart: "{audioRecorder}.events.onRecordingStart",
        onRecordingStop: "{audioRecorder}.events.onRecordingStop",
        onAudioReady: "{audioRecorder}.events.onAudioReady"
    },

    listeners: {
        "onRecordingStart.start": "{that}.start()",
        "onRecordingStop.stop": "{that}.stop()"
    }
});
