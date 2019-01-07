'use strict';

class User {


    /**
     * @param {Object} data
     */
    constructor(data) {
        this.userId = data.userId;
    }

    /**
     *
     * @returns {string} userId
     */
    getUserId() {
        return this.userId;
    }

    /**
     *
     * @param {string} userId
     */
    setUserId(userId) {
        this.userId = userId;
    }

}

module.exports = User;