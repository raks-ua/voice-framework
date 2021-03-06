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

    hasDisplay(){
	//response.event.context.System.device.supportedInterfaces.Display
	if(!this.getContext() || !this.getContext().System || !this.getContext().System.device || !this.getContext().System.device.supportedInterfaces || !this.getContext().System.device.supportedInterfaces.Display) return false;
	return true;
    }

    hasVideoApp(){
	//response.event.context.System.device.supportedInterfaces.Display
	if(!this.getContext() || !this.getContext().System || !this.getContext().System.device || !this.getContext().System.device.supportedInterfaces || !this.getContext().System.device.supportedInterfaces.VideoApp) return false;
	return true;
    }

    getViewport(){
	if(!this.getContext() || !this.getContext().Viewport) return undefined;
	return this.getContext().Viewport;
    }

    hasPresentationAPL(){
	if(!this.getContext() || !this.getContext().System || !this.getContext().System.device || !this.getContext().System.device.supportedInterfaces || !this.getContext().System.device.supportedInterfaces['Alexa.Presentation.APL']) return false;
	return true;
    }

    getSystemApiEndpoint(){
      if(!this.getContext() || !this.getContext().System) return undefined;

      let apiEndpoint = this.getContext().System.apiEndpoint;
      if(!apiEndpoint) return ;
      apiEndpoint = apiEndpoint.replace('https://', '');
      apiEndpoint = apiEndpoint.replace('http://', '');
      return apiEndpoint;
    }

    getRequestError(){
      if(!this.getEvent() || !this.getEvent().request || !this.getEvent().request.error) return undefined;
      return this.getEvent().request.error;
    }

    getRequestArguments(){
      if(!this.getEvent() || !this.getEvent().request) return [];
      return this.getEvent().request['arguments'] || [];
    }
}

module.exports = DataAlexa;