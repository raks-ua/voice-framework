'use strict';

const Session = require("../session");

class SessionAlexa extends Session {


    constructor(data = true) {
        super(data);
        this.isNew = data.isNew;
        this.attributes = {};
	this.attributesManager = undefined;
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
	if(this.attributesManager) this.attributesManager.setSessionAttributes(this.attributes);
        super.setParam(key, val);
    }

    setAttributesManager(attributesManager){
	this.attributesManager = attributesManager;
    }
}

module.exports = SessionAlexa;
