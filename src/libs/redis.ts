import Redis from "ioredis";


const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');


redis.on("error", (err) => console.error("Erro no Redis:", err));

async function clearCacheOnStart() {
  try {
    await redis.flushdb();
    console.log("Cache Redis limpa ao iniciar.");
  } catch (err) {
    console.error("Erro a limpar o Redis:", err);
  }
}

clearCacheOnStart();

export default redis;