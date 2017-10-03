"use strict";

fluid.defaults("sjrk.mediaDevice", {
    gradeNames: "fluid.component",

    invokers: {
        requestAccess: {
            funcName: "sjrk.mediaDevice.requestAccess",
            args: [
                "{that}.options.constraints",
                "{that}.events.onAccess.fire",
                "{that}.events.onError.fire",
            ]
        }
    },

    components: {
        streamHolder: {
            createOnEvent: "onAccess",
            type: "sjrk.mediaStreamHolder",
            options: {
                stream: "{arguments}.0"
            }
        }
    },

    events: {
        onAccess: null,
        onError: null
    }
});

sjrk.mediaDevice.requestAccess = function (constraints, onAccess, onError) {
    if (navigator.mediaDevices) {
        var p = navigator.mediaDevices.getUserMedia(constraints);
        p.then(onAccess).catch(onError);
    } else if (navigator.getUserMedia) {
        navigator.getUserMedia(constraints, onAccess, onError);
    } else {
        onError(new Error(
            "This browser does not support getUserMedia() or the Media Streams API."));
    }
};
