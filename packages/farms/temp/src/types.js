"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protocol = void 0;
exports.isStableFarm = isStableFarm;
function isStableFarm(farmConfig) {
    return 'stableSwapAddress' in farmConfig && typeof farmConfig.stableSwapAddress === 'string';
}
var Protocol;
(function (Protocol) {
    Protocol["V2"] = "v2";
    Protocol["V3"] = "v3";
    Protocol["STABLE"] = "stable";
    Protocol["V4BIN"] = "v4bin";
})(Protocol || (exports.Protocol = Protocol = {}));
