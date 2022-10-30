const nodeCache = require('node-cache');

const cache = new nodeCache({ stdTTL: 300, checkperiod: 300 });

const checkCache = (req, res, next) => {
    // use url as key
    const key = req.originalUrl;

    // get data from cache
    const cacheHit = cache.get(key);

    if(cacheHit){
        // return cached data
        res.setHeader('X-Cache', 'HIT');
        return res.json(cacheHit)
    }else{
        res.setHeader('X-Cache', 'MISS');
        next();
    }
}

const saveCache = (key, data) => {

    // save data in cache
    cache.set(key, data)
}

const deleteCache = (key) => {

    // save data in cache
    cache.del(key);
}
module.exports = {
    checkCache,
    saveCache,
    deleteCache
};