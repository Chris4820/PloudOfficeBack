"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShortName = generateShortName;
async function generateShortName(name) {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }
    else {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
}
//# sourceMappingURL=utils.js.map