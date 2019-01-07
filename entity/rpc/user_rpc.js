'use strict';

const User = require("../user");

class UserRPC extends User {

    constructor(data = {}) {
        super(data);
        this.accessToken = data.accessToken;
    }

}

module.exports = UserRPC;