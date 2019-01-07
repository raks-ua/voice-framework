'use strict';

class Router {

    constructor(callback) {
        callback = callback || function (request) {
            let p = new Promise((resolve, reject) => {
                resolve({
                    ok: true
                });
            });
            return p;
        };
        this.callback = callback;
    }

    /**
     *
     * @param request {Request}
     * @returns Promise
     */
    check(request) {
        return this.callback(request);
    }
}

module.exports = Router;