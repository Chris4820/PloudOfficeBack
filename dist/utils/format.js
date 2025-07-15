"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceToCentsUtil = PriceToCentsUtil;
exports.CentsToPriceUtil = CentsToPriceUtil;
async function PriceToCentsUtil(price) {
    return price * 100;
}
async function CentsToPriceUtil(price) {
    return price ? price / 100 : 0;
}
//# sourceMappingURL=format.js.map