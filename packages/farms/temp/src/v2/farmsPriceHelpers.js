"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterFarmsByQuoteToken = void 0;
/**
 * Returns the first farm with a quote token that matches from an array of preferred quote tokens
 * @param farms Array of farms
 * @param preferredQuoteTokens Array of preferred quote tokens
 * @returns A preferred farm, if found - or the first element of the farms array
 */
const filterFarmsByQuoteToken = (farms, preferredQuoteTokens = ['BUSD', 'WBNB']) => {
    const preferredFarm = farms.find((farm) => {
        return preferredQuoteTokens.some((quoteToken) => {
            return farm.quoteToken.symbol === quoteToken;
        });
    });
    return preferredFarm || farms[0];
};
exports.filterFarmsByQuoteToken = filterFarmsByQuoteToken;
