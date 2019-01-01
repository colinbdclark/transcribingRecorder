/*
(Proto-) Signaletic
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

/**
 * A base grade that serves as a wrapper for
 * the Web Audio API's AudioNode
 */
fluid.defaults("signaletic.audioNode", {
    gradeNames: "fluid.modelComponent",

    members: {
        node: "fluid.mustBeOverridden",
        numberOfInputs: "{that}.node.numberOfInputs",
        numberOfOutputs: "{that}.node.numberOfOutputs"
    },

    model: {
        channelCount: 2
        // TODO: channelCountMode, channelInterpretation.
    },

    modelListeners: {
        updateChannelCount: {
            path: "channelCount",
            funcName: "signaletic.audioNode.updateNodeChannelCount",
            args: ["{that}.node", "{change}.value"]
        }
    },

    invokers: {
        connect: {
            funcName: "signaletic.audioNode.connect",
            args: [
                "{that}.node",

                // The node or AudioParam to connect to.
                "{arguments}.0",

                // An optional output number on this node to connect to the destination.
                "{arguments}.1",

                // An option input number on the destination to connect to.
                "{arguments}.2"
            ]
        },

        disconnect: {
            funcName: "signaletic.audioNode.disconnect",
            args: [
                "{that}.node",

                // Either:
                //   * an output number to disconnect from all outgoing destinations
                //   * a Node or AudioParam to disconnect from all outgoing destinations
                "{arguments}.0",

                // Optional. An output number on this node from which to disconnect the specified destination.
                "{arguments}.1",

                // Optional. An input number on the specified destination node to disconnect from.
                "{arguments}.2"
            ]
        }
    }
});

// TODO: Replace this with a limitRange transformation.
signaletic.audioNode.updateNodeChannelCount = function (node, channelCount) {
    var maxChannelCount = node.maxChannelCount;

    if (channelCount <= maxChannelCount) {
        node.channelCount = channelCount;
    } else {
        // Note: Here we are working around a Safari bug
        // where the AudioDestinationNode's maxChannelCount is always 0.
        if (!node instanceof AudioDestinationNode || maxChannelCount > 0) {
            node.channelCount = maxChannelCount;
        }
    }
};

signaletic.audioNode.unwrapDestination = function (destination) {
    return destination instanceof AudioNode || destination instanceof AudioParam || typeof destination === "Number" ? destination : destination.node;
};

signaletic.audioNode.connect = function (node, destination, output, input) {
    var destinationNode = signaletic.audioNode.unwrapDestination(destination);
    node.connect(destination, input, output);
};

signaletic.audioNode.disconnect = function (node, destination, output, input) {
    var destinationNode = signaletic.audioNode.unwrapDestination(destination);
    node.disconnect(destination, input, output);
};
