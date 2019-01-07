'use strict';

const User = require("../user");

class UserClova extends User {


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

module.exports = UserClova;