'use strict';

const User = require("../user");

class UserAlexa extends User {


    constructor(data ='') {
        super(data);
        this.accessToken = data.accessToken;
    }

    /**
     *
     * @returns {string} accessToken
     */
    getAccessToken() {
        return this.accessToken;
    }

    /**
     *
     * @param {string} accessToken
     */
    setAccessToken(accessToken) {
        this.accessToken = accessToken;
    }

}

module.exports = UserAlexa;