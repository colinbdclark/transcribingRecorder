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

    // TODO: This is an option because of the inability for the parent,
    // mediaDevice, to make an {arguments} reference within options.members.
    // Presumably this is a framework bug.
    stream: "fluid.mustBeOverridden" // Typically passed on creation
                                     // via a successful callback from getUserMedia().
});
