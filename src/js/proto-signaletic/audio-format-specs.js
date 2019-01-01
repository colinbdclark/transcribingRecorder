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
https://github.com/colinbdclark/Flocking/blob/fb09a52a80b88a79590b26ab5000e198bfcecf1a/src/flocking-audiofile-converters.js
Modifications are Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

fluid.registerNamespace("signaletic.audioFormats");

signaletic.audioFormats.pcm = {
    int8: {
        scale: 128,
        setter: "setInt8",
        width: 1
    },

    int16: {
        scale: 32768,
        setter: "setInt16",
        width: 2
    },

    int32: {
        scale: 2147483648,
        setter: "setInt32",
        width: 4
    },

    float32: {
        scale: 1,
        setter: "setFloat32",
        width: 4
    }
};
