'use strict';

const Session = require("../session");

class SessionGoogle extends Session {


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

    setConversationId(conversationId){
	this.conversationId = conversationId;
    }

    getConversationId(){
	return this.conversationId;
    }
}

module.exports = SessionGoogle;
