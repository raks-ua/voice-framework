'use strict';

const Session = require("../session");

class SessionCustom extends Session {


    constructor(data = true) {
        super(data);
        this.isNew = data.isNew;
    }

    /**
     *
     * @returns {boolean} isNew
     */
    isIsNew() {
        return this.isNew;
    }

    /**
     *
     * @param {boolean} isNew
     */
    setNew(isNew) {
        this.isNew = isNew;
    }

}

module.exports = SessionCustom;
