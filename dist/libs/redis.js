"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
redis.on("error", (err) => console.error("Erro no Redis:", err));
async function clearCacheOnStart() {
    try {
        await redis.flushdb();
        console.log("Cache Redis limpa ao iniciar.");
    }
    catch (err) {
        console.error("Erro a limpar o Redis:", err);
    }
}
clearCacheOnStart();
exports.default = redis;
//# sourceMappingURL=redis.js.map