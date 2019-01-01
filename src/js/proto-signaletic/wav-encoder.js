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

Original source:
https://github.com/colinbdclark/Flocking/blob/fb09a52a80b88a79590b26ab5000e198bfcecf1a/src/audiofile-encoder.js

Modifications are Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

fluid.registerNamespace("signaletic.audioEncoders");

signaletic.audioEncoders.wav = function (audioBuffer, formatSpec) {
    formatSpec = formatSpec || signaletic.audioFormats.pcm.int16;

    var interleaved = audioBuffer.toInterleavedArray(),
        numChans = audioBuffer.numberOfChannels,
        sampleRate = audioBuffer.sampleRate,
        isPCM = formatSpec.setter !== "setFloat32",
        riffHeaderSize = 8,
        formatHeaderSize = 12,
        formatBodySize = 16,
        formatTag = 1,
        dataHeaderSize = 8,
        dataBodySize = interleaved.length * formatSpec.width,
        dataChunkSize = dataHeaderSize + dataBodySize,
        bytesPerFrame = formatSpec.width * numChans,
        bitsPerSample = 8 * formatSpec.width;

    if (numChans > 2 || !isPCM) {
        var factHeaderSize = 8,
            factBodySize = 4,
            factChunkSize = factHeaderSize + factBodySize;

        formatBodySize += factChunkSize;

        if (numChans > 2) {
            formatBodySize += 24;
            formatTag = 0xFFFE; // Extensible.
        } else {
            formatBodySize += 2;
            formatTag = 3; // Two-channel IEEE float.
        }
    }

    var formatChunkSize = formatHeaderSize + formatBodySize,
        riffBodySize = formatChunkSize + dataChunkSize,
        numBytes = riffHeaderSize + riffBodySize,
        out = new ArrayBuffer(numBytes),
        dv = new DataView(out);

    // RIFF chunk header.
    signaletic.audioDataUtils.setString(dv, 0, "RIFF"); // ckID
    dv.setUint32(4, riffBodySize, true); // cksize

    // Format Header
    signaletic.audioDataUtils.setString(dv, 8, "WAVE"); // WAVEID
    signaletic.audioDataUtils.setString(dv, 12, "fmt "); // ckID
    dv.setUint32(16, formatBodySize, true); // cksize, length of the format chunk.

    // Format Body
    dv.setUint16(20, formatTag, true); // wFormatTag
    dv.setUint16(22, numChans, true); // nChannels
    dv.setUint32(24, sampleRate, true); // nSamplesPerSec
    dv.setUint32(28, sampleRate * bytesPerFrame, true); // nAvgBytesPerSec (sample rate * byte width * channels)
    dv.setUint16(32, bytesPerFrame, true); //nBlockAlign (channel count * bytes per sample)
    dv.setUint16(34, bitsPerSample, true); // wBitsPerSample

    var offset = 36;
    if (formatTag === 3) {
        // IEEE Float. Write out a fact chunk.
        dv.setUint16(offset, 0, true); // cbSize: size of the extension
        offset += 2;
        offset = signaletic.audioEncoders.wav.writeFactChunk(dv, offset, bufDesc.format.numSampleFrames);
    } else if (formatTag === 0xFFFE) {
        // Extensible format (i.e. > 2 channels).
        // Write out additional format fields and fact chunk.
        dv.setUint16(offset, 22, true); // cbSize: size of the extension
        offset += 2;

        // Additional format fields.
        offset = signaletic.audioEncoders.wav.writeAdditionalFormatFields(offset, dv, bitsPerSample, isPCM);

        // Fact chunk.
        offset = signaletic.audioEncoders.wav.writeFactChunk(dv, offset, bufDesc.format.numSampleFrames);
    }

    signaletic.audioEncoders.wav.writeDataChunk(formatSpec, offset, dv, interleaved, dataBodySize);

    return dv.buffer;
};

signaletic.audioEncoders.wav.subformats = {
    pcm: new Uint8Array([1, 0, 0, 0, 0, 0, 16, 0, 128, 0, 0, 170, 0, 56, 155, 113]),
    float: new Uint8Array([3, 0, 0, 0, 0, 0, 16, 0, 128, 0, 0, 170, 0, 56, 155, 113])
};

signaletic.audioEncoders.wav.writeAdditionalFormatFields = function (offset, dv, bitsPerSample, isPCM) {
    dv.setUint16(offset, bitsPerSample, true); // wValidBitsPerSample
    offset += 2;

    dv.setUint32(offset, 0x80000000, true); // dwChannelMask, hardcoded to SPEAKER_RESERVED
    offset += 4;

    // Subformat GUID.
    var subformat = signaletic.audioEncoders.wav.subformats[isPCM ? "pcm" : "float"];
    signaletic.audioDataUtils.setBytes(dv, offset, subformat);
    offset += 16;

    return offset;
};

signaletic.audioEncoders.wav.writeFactChunk = function (dv, offset, numSampleFrames) {
    signaletic.audioDataUtils.setString(dv, offset, "fact"); // ckID
    offset += 4;

    dv.setUint32(offset, 4, true); //cksize
    offset += 4;

    dv.setUint32(offset, numSampleFrames, true); // dwSampleLength
    offset += 4;

    return offset;
};

signaletic.audioEncoders.wav.writeDataChunk = function (convertSpec, offset, dv, interleaved, numSampleBytes) {
    // Data chunk Header
    signaletic.audioDataUtils.setString(dv, offset, "data");
    offset += 4;
    dv.setUint32(offset, numSampleBytes, true); // Length of the datahunk.
    offset += 4;

    signaletic.audioDataUtils.setPCMSamples(convertSpec, offset, dv, interleaved);
};
