'use strict';

const Response = require("../response");

class ResponseGoogle extends Response {

    constructor(data = {}) {
        super(data);
    }

    setResultCallback(callback) {
        this.resultCallback = callback;
    }

    /**
     * Calling when need to call APP LIB, eg alexa.execute
     * @returns {Promise<any>}
     */
    process(appHandler, googleRequest) {
        return super.process(appHandler, googleRequest);
    }

    sendSuccess() {
        this.resultCallback(undefined, this.getRequest());
        super.sendSuccess();
    }

    sendError(error) {
        this.resultCallback(error, this.getRequest());
        super.sendError(error);
    }

    getResponse(){
        let d = {
            "speech": '',
            "displayText": ''
        };
        try {
            let displayText = this.message.getMessage('text');
            let displaySSML = this.message.getMessage('ssml');
            let resp = {
                "richResponse": {
                    "items": [
                        {
                            "simpleResponse": {
                                "ssml": displaySSML,
                                "displayText": displayText
                            }
                        }
                    ]
                }
            };

            let suggestions = this.request.getSession().getParam('suggestions');
            if (suggestions && suggestions.length > 0) {
                resp.richResponse.suggestions = suggestions;
            }
            d = {
                "speech": displaySSML,
                "displayText": displayText,
                "data": {
                    "google": resp
                }
            };
        }catch(e){
            console.log('[ERR ResponseGoogle]', 'not formed', err);
        }
        return d;
    }


}
module.exports = ResponseGoogle;
