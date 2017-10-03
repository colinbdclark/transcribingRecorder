/*
Social Justice Repair Kit Story Recorder
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

/**
 * An Infusion component that simply holds a Media Stream object.
 */
fluid.defaults("sjrk.mediaStreamHolder", {
    gradeNames: "fluid.component",

    mergePolicy: {
        stream: "nomerge"
    },

    members: {
        stream: "{that}.options.stream"
    },

    // Note: This is an option because of the inability for the parent,
    // mediaDevice, to make an {arguments} reference within options.members.
    // Presumably this is a framework bug.
    stream: "fluid.mustBeOverridden" // Typically passed on creation
                                     // via a successful callback from getUserMedia().
});
