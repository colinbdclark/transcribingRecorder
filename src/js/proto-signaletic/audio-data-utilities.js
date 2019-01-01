/*
(Proto-) Signaletic

This file is derived from Flocking (http://flockingjs.org)
Copyright (c) 2011-2017 Colin Clark

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Original sources:
https://github.com/colinbdclark/Flocking/blob/fb09a52a80b88a79590b26ab5000e198bfcecf1a/src/audiofile-encoder.js

https://github.com/colinbdclark/Flocking/blob/fb09a52a80b88a79590b26ab5000e198bfcecf1a/src/flocking-audiofile-converters.js

Modifications are Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

fluid.registerNamespace("signaletic.audioDataUtils");

/**
 * Converts the value from float to integer format
 * using the specified format specification.
 *
 * @param {Number} value the float to convert
 * @param {Object} formatSpec a specification of the format conversion
 * @return {Number} the value converted to int format, constrained to the bounds defined by formatSpec
 */
signaletic.audioDataUtils.floatToInt = function (value, formatSpec) {
    // Clamp to within bounds.
    var s = Math.min(formatSpec.maxFloatValue, value);
    s = Math.max(-1.0, s);

    // Scale to the output number format.
    s = s * formatSpec.scale;

    // Round to the nearest whole sample.
    // TODO: A dither here would be optimal.
    s = Math.round(s);

    return s;
};

/**
 * Converts an array of values from float to integer format
 * using the specified target format specification.
 *
 * @param {Object} formatSpec a specification of the format conversion
 * @param {Array-like} source the array of floats to convert
 * @param {Array-like} target [optional] an array into which the converted values will be copied
 * @return {Array-like} the converted values
 */
signaletic.audioDataUtils.floatsToInts = function (formatSpec, source, target) {
    if (!source) {
        return;
    }

    if (!target) {
        var arrayType = "Int" + (8 * formatSpec.width) + "Array";

        // Note: this will not work in Node.js.
        target = new window[arrayType](source.length);
    }

    // TODO: Add a source/value length check and fail
    // if they don't match.
    for (var i = 0; i < source.length; i++) {
        var floatVal = source[i],
            intVal = signaletic.audioDataUtils.floatToInt(floatVal, formatSpec);

        target[i] = intVal;
    }

    return target;
};

/**
 * Converts the value from integer to floating format
 * using the specified format specification.
 *
 * @param {Number} value the integer to convert
 * @param {Object} formatSpec a specification of the format conversion
 * @return {Number} the value converted to float format
 */
signaletic.audioDataUtils.intToFloat = function (value, formatSpec) {
    return value / formatSpec.scale;
};

/**
 * Converts an array of values from integer to Float32 format
 * using the specified source format specification to describe the.
 *
 * @param {Object} formatSpec a specification of the format conversion
 * @param {Array-like} source the array of integers to convert
 * @param {Array-like} target [optional] an array into which the converted values will be copied
 * @return {Array-like} the converted values
 */
signaletic.audioDataUtils.intsToFloats = function (formatSpec, source, target) {
    if (!source) {
        return;
    }

    target = target || new Float32Array(source.length);

    // TODO: Add a source/value length check and fail
    // if they don't match.

    for (var i = 0; i < source.length; i++) {
        var intVal = source[i],
            floatVal = signaletic.audioDataUtils.intToFloat(intVal, formatSpec);

        target[i] = floatVal;
    }

    return target;
};

signaletic.audioDataUtils.setFloat32Array = function (dv, offset, samples) {
    for (var i = 0; i < samples.length; i++) {
        dv.setFloat32(offset, samples[i], true);
        offset += 4;
    }

    return dv;
};

signaletic.audioDataUtils.setString = function (dv, offset, str){
    for (var i = 0; i < str.length; i++){
        dv.setUint8(offset + i, str.charCodeAt(i));
    }
};

signaletic.audioDataUtils.setBytes = function (dv, offset, bytes) {
    for (var i = 0; i < bytes.length; i++) {
        dv.setUint8(offset + i, bytes[i]);
    }
};

signaletic.audioDataUtils.setPCMSamples = function (formatSpec, offset, dv, samples) {
    if (formatSpec.setter === "setFloat32" && samples instanceof Float32Array) {
        return signaletic.audioDataUtils.setFloat32Array(dv, offset, samples);
    }

    for (var i = 0; i < samples.length; i++) {
        var s = signaletic.audioDataUtils.floatToInt(samples[i], formatSpec);

        // Write the sample to the DataView.
        dv[formatSpec.setter](offset, s, true);
        offset += formatSpec.width;
    }

    return dv;
};
