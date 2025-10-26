"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterFarmsByQuery = void 0;
const latinise_1 = __importDefault(require("@cometswap/utils/latinise"));
const filterFarmsByQuery = (farms, query) => {
    if (query) {
        const queryParts = (0, latinise_1.default)(query.toLowerCase()).trim().split(' ');
        return farms.filter((farm) => {
            const farmSymbol = (0, latinise_1.default)(farm.lpSymbol.toLowerCase());
            return queryParts.every((queryPart) => {
                return farmSymbol.includes(queryPart);
            });
        });
    }
    return farms;
};
exports.filterFarmsByQuery = filterFarmsByQuery;
