'use strict';

const Response = require("../response");
const Message = require("../message/message");
const AudioPlayDirective = require("../directive/audio-play-directive");
const AudioPauseDirective = require("../directive/audio-pause-directive");
const AudioResumeDirective = require("../directive/audio-resume-directive");
const AudioStopDirective = require("../directive/audio-stop-directive");
const RenderPlayerInfoDirective = require("./directive/render-player-info-directive.js");

const uuid = require('uuid').v4;

let self;

class ResponseClova extends Response {

    constructor(data) {
        super(data);
    }

    /**
     * Finishing session after message
     * @param url {String}
     */
    tellUrl(url) {
        this.tellUrl = url;
        this.shouldEndSession(true);
    }

    /**
     *
     * @param {Object} directive
     */
    addDirective(directive) {
        this.directives.push(directive);
    }


    shouldEndSession(should) {
        super.shouldEndSession(should);
    }

    setResultCallback(callback) {
        this.resultCallback = callback;
    }

    /**
     * Calling when need to call APP LIB, eg alexa.execute
     * @returns {Promise<any>}
     */
    process(appHandler, clovaRequest) {
        return super.process(appHandler, clovaRequest);
    }

    sendSuccess() {
        this.resultCallback(undefined, this.getRequest());
        super.sendSuccess();
    }

    sendError(error) {
        this.resultCallback(error, this.getRequest());
        super.sendError(error);
    }

    /**
     *
     * @param directive {Directive}
     * @returns {*}
     */
    convertDirectiveToResponse(directive) {
        if (directive instanceof AudioPlayDirective) {
            return {
                "header": {
                    "messageId": uuid(),
                    "namespace": "AudioPlayer",
                    "name": "Play"
                },
                "payload": {
                    "audioItem": {
                        "audioItemId": uuid(),
                        "stream": {
                            "beginAtInMilliseconds": 0,
                            "playType": "NONE",
                            "token": uuid(),
                            "url": directive.getUrl(),
                            "urlPlayable": true
                        },
                        "type": "custom"
                    },
                    "playBehavior": directive.getBehaviour(),
                    "source": {
                        "name": directive.getSource().name
                    }
                }
            };
        }

        if (directive instanceof AudioPauseDirective) {
            return {
                "header": {
		    "namespace": "PlaybackController",
        	    "name": "Pause"
                },
                "payload": {}
            };
        }
	
        if (directive instanceof AudioResumeDirective) {
            return {
                "header": {
		    "namespace": "PlaybackController",
        	    "name": "Resume"
                },
                "payload": {}
            };
        }

        if (directive instanceof AudioStopDirective) {
            return {
                "header": {
		    "namespace": "PlaybackController",
        	    "name": "Stop"
                },
                "payload": {}
            };
        }

	if(directive instanceof RenderPlayerInfoDirective){
	    return directive.getResponse();
	}

    }

    convertMessageToSpeech() {
        //TODO
        let speech;
        if(this.message){
            speech = {
                "type": "SimpleSpeech",
                "values": {
                    "type": "PlainText",
                    "lang": this.getRequest().getLang(),
                    "value": this.message.getMessage('text')
                }
            };
        }else if (this.tellUrl){
            speech = {
                "type": "SimpleSpeech",
                "values": {
                    "type": "URL",
                    "lang": this.getRequest().getLang(),
                    "value": this.tellUrl
                }
            };
        }
        return speech;
    }

    getResponse() {
        let response = {
            "version": "0.1.0",
            "sessionAttributes": this.getRequest().getSession().getParams(),
            "response": {
                "shouldEndSession": this.endSession,
                "directives": []
            }
        };

        if (this.message || this.tellUrl) {
            response.response.outputSpeech = this.convertMessageToSpeech();
        }

        for (let i = 0; i < this.directives.length; i++) {
            response.response.directives.push(this.convertDirectiveToResponse(this.directives[i]));
        }

        return response;
    }
}

module.exports = ResponseClova;