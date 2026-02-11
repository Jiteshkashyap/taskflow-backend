import redis from "../config/redis.js";

export const cacheSet=async(key , value , ttl=60)=>{
    await redis.set(key,JSON.stringify(value),"EX",ttl)
};

export const cacheGet=async(key,)=>{
   const data= await redis.get(key);
   return data? JSON.parse(data):null
}
 // delete multiple keys for same pattern

export const delByPattern=async(pattern)=>{

    if(!redis) return;

    let cursor=0;
    do{
        const reply =await redis.scan(cursor ,'MATCH',pattern,'COUNT',100)
        cursor =Number(reply[0]);
        const keys=reply[1]
        if(keys.length)
            await redis.del(...keys)

    }while(cursor!==0)
}