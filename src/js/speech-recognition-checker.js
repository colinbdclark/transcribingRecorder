"use strict";

fluid.registerNamespace("sjrk.speechRecognition");

sjrk.speechRecognition.isSupported = function () {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

fluid.contextAware.makeChecks({
    "sjrk.supportsSpeechRec": "sjrk.speechRecognition.isSupported"
});
