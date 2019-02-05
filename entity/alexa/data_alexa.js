'use strict';

const Data = require("../data");

class DataAlexa extends Data {


    constructor(data = '') {
        super(data);
        this.event = data.event;
        this.context = data.context;
    }

    /**
     *
     * @param {*} event
     */
    setEvent(event) {
        this.event = event;
    }

    /**
     *
     * @param {*} event
     */
    getEvent() {
        return this.event;
    }

    /**
     *
     * @param {Object} context
     */
    setContext(context) {
        this.context = context;
    }

    /**
     *
     */
    getContext() {
        return this.context;
    }

    getSystemApiToken(){
	if(!this.getContext() || !this.getContext().System) return undefined;
	return this.getContext().System.apiAccessToken;
    }

    getRequestToken(){
	//console.log('[REQUEST]', this.getEvent());
	if(!this.getEvent() || !this.getEvent().request) return undefined;
	return this.getEvent().request.token;
    }

    getPurchaseResult(){
	if(!this.getEvent() || !this.getEvent().request || !this.getEvent().request.payload) return undefined;
	return this.getEvent().request.payload.purchaseResult;
    }

    getPurchaseResultProductId(){
	if(!this.getEvent() || !this.getEvent().request || !this.getEvent().request.payload) return undefined;
	return this.getEvent().request.payload.productId;
    }

    getAudioPlayerToken(){
	//response.event.context.AudioPlayer.token;
	if(!this.getContext() || !this.getContext().AudioPlayer) return undefined;
	return this.getContext().AudioPlayer.token;
	
    }

    

}

module.exports = DataAlexa;