/*
(Proto-) Signaletic
Copyright 2017 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/fluid-project/sjrk-story-recorder/raw/master/LICENSE.txt
*/

"use strict";

fluid.defaults("signaletic.silentDestination", {
    gradeNames: "signaletic.masterOutput",

    // TODO: WHAT WE ARE STILL MISSING HERE:
    // * The ability to define "virtual inputs", which point to
    //  actual web audio inputs on contained AudioNode components.
});
