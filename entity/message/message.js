'use strict';

class Message {

    /**
     *
     * @param message {String}
     */
    constructor(message) {
        this.message = message;
        this.messageSSML = undefined;
        this.messageReprompt = undefined;
        this.messageRepromptSSML = undefined;
        return this;
    }

    /**
     *
     * @returns {string}
     */
    getMessage(type = 'ssml') {
        if (type === 'ssml') {
            if(this.messageSSML){
                if (!this.isSSML('messageSSML')) {
                    return '<speak>' + this.messageSSML + '</speak>';
                }
                return this.messageSSML;
            }
            if (!this.isSSML('message')) {
                return '<speak>' + this.message + '</speak>';
            }
            return this.message;
        }
        return this.message;
    }

    /**
     *
     * @param message {String}
     */
    setMessage(message) {
        this.message = message;
        return this;
    }

    setMessageSSML(messageSSML){
        messageSSML = messageSSML.replace(/<speak>/ig, '');
        messageSSML = messageSSML.replace(/<\/speak>/ig, '');
        this.messageSSML = messageSSML;
    }

    setMessageRepromptSSML(messageSSML){
        messageSSML = messageSSML.replace(/<speak>/ig, '');
        messageSSML = messageSSML.replace(/<\/speak>/ig, '');
        this.messageRepromptSSML = messageSSML;
        return this;
    }

    /**
     *
     * @param messageReprompt {String}
     */
    setMessageReprompt(messageReprompt) {
        this.messageReprompt = messageReprompt;
        return this;
    }


    /**
     *
     * @returns {String}
     */
    getMessageReprompt(type = 'ssml') {
        if (type === 'ssml') {
            if(this.messageRepromptSSML){
                if (!this.isSSML('messageRepromptSSML')) {
                    return '<speak>' + this.messageRepromptSSML + '</speak>';
                }
                return this.messageRepromptSSML;
            }
            if (!this.isSSML('messageReprompt') && this.messageReprompt) {
                return '<speak>' + this.messageReprompt + '</speak>';
            }
            return this.messageReprompt;
        }
        return this.messageReprompt;
    }


    /**
     *
     * @returns {boolean}
     */
    isSSML(property) {
        let re = /\<speak\>/i;
        if(!this[property]) return false;
        return this[property].match(re);
    }

    /**
     * TODO: check for SSML. Yes - make ssml concat -> <speak> CURRENT TEXT + NEW TEXT</>
     * @param msg {string}
     */
    addMessage(msg) {
        msg = msg.replace(/<speak>/ig, '');
        msg = msg.replace(/<\/speak>/ig, '');
        this.message += ' ' + msg;
        return this;
    }

    addMessageSSML(msg) {
        msg = msg.replace(/<speak>/ig, '');
        msg = msg.replace(/<\/speak>/ig, '');
        if(!this.messageSSML){
            this.messageSSML = msg;
        }else{
            this.messageSSML += ' ' + msg;
        }
        return this;
    }

    /**
     * TODO: check for SSML. Yes - make ssml concat -> <speak> CURRENT TEXT + NEW TEXT</>
     * @param msg {String}
     */
    addMessageReprompt(msg) {
        msg = msg.replace(/<speak>/ig, '');
        msg = msg.replace(/<\/speak>/ig, '');
        if(!this.messageSSML){
            this.messageReprompt = msg;
        }else{
            this.messageReprompt += ' ' + msg;
        }
        return this;
    }

    /**
     * 
     * @param msg
     * @returns {Message}
     */
    addMessageRepromptSSML(msg) {
        msg = msg.replace(/<speak>/ig, '');
        msg = msg.replace(/<\/speak>/ig, '');
        if(!this.messageRepromptSSML){
            this.messageRepromptSSML = msg;
        }else{
            this.messageRepromptSSML += ' ' + msg;
        }
        return this;
    }
}

module.exports = Message;