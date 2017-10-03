"use strict";

fluid.registerNamespace("sjrk.time");

sjrk.time.applyNow = function (applier, path) {
    applier.change(path, Date.now());
};
