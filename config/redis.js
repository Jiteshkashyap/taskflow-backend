import Redis from "ioredis";

const redis =new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT
})

redis.on('connect',()=>{
    console.log(" Redis connected")
})
redis.on('error',()=>{
    console.log('Error in connecting redis')
})

export default redis

