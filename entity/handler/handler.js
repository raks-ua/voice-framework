'use strict';
let Router = require('../router/router');
let Request = require('../request');

class Handler {

    /**
     *
     * @param type {string}
     * @param aliases {string|array}
     * @param router {Router} Please override constructor for router
     */
    constructor(type, aliases, router) {
        if(router && !(router instanceof Router)) throw `Please set router in ${type}-${aliases}`;
        this.type = type;
        this.aliases = Array.isArray(aliases) ? aliases : [aliases];
        this.router = router || new Router();
    }

    /**
     *
     * @returns {Router}
     */
    getRouter(){
        return this.router;
    }

    /**
     *
     * @param router {Router}
     * @returns {Handler}
     */
    setRouter(router){
        this.router = router;
        return this;
    }

    getType(){
        return this.type;
    }

    getAliases(){
        return this.aliases;
    }

    getName(){
        return this.constructor.name;
    }

    /**
     *
     * @param request {Request}
     */
    process(request){
        console.log(`PROCESSING REQUEST IN HANDLER ${this.getType()}-${this.getName()}`);
        let p = new Promise((resolve, reject) => {
            this.call(request, (err) => {
               if(err) return reject(err);
                resolve();
            });
        });
        return p;
    }

    /**
     *
     * @param request {Request}
     * @param callback {Function<error>}
     */
    call(request, callback){
        callback && callback(undefined);
    }
}

module.exports = Handler;