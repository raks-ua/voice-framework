'use strict';

const Session = require("../session");

class SessionAlexa extends Session {


    constructor(data = true) {
        super(data);
        this.isNew = data.isNew;
        this.attributes = {};
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

    setAttributes(attributes){
        this.attributes = attributes;
        for (let i = 0; i < Object.keys(attributes).length; i++) {
            let key = Object.keys(attributes)[i];
            super.setParam(key, attributes[key]);
        }
    }

    setParam(key, val){
        this.attributes[key] = val;
        //console.log('[attributes]', this.attributes);
        super.setParam(key, val);
    }

}

module.exports = SessionAlexa;
