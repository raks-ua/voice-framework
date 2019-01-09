'use strict';

const Response = require("../response");
const Message = require("../message/message");
const AudioPlayDirective = require("../directive/audio-play-directive");
const uuid = require('uuid').v4;

let self;

class ResponseClova extends Response {

    constructor(data) {
        super(data);
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
//                        "logoUrl": directive.getLogoUrl(),
                        //"logoUrl":"http://static.naver.net/clova/service/native_extensions/sound_serise/img_sound_rain_108.png",
                        "name": directive.getSource().name
                    }
                }
            };
        }
    }

    convertMessageToSpeech() {
        //TODO

        let speech = {
            "type": "SimpleSpeech",
            "values": {
                "type": "PlainText",
                "lang": this.getRequest().getLang(),
                "value": this.message.getMessage('text')
            }
        };

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

        if (this.message) {
            response.response.outputSpeech = this.convertMessageToSpeech();
        }

        for (let i = 0; i < this.directives.length; i++) {
            response.response.directives.push(this.convertDirectiveToResponse(this.directives[i]));
        }

        return response;
    }
}

module.exports = ResponseClova;