'use strict';

const eventDispatcher = require('./model/event_dispatcher_model.js');

const AppModel = require('./model/app_model.js');
const DashbotModel = require('./model/dashbot_model.js');

const User = require('./entity/user.js');
const Session = require('./entity/session.js');
const Intent = require('./entity/intent.js');
const IntentTypes = require('./entity/intent_types.js');
const Error = require('./entity/error.js');
const Request = require('./entity/request.js');
const Response = require('./entity/response.js');
const Router = require('./entity/router/router.js');
const Message = require('./entity/message/message.js');
const Handler = require('./entity/handler/handler.js');
const Card = require('./entity/card/card.js');

const Directive = require('./entity/directive/directive.js');
const AudioPlayDirective = require('./entity/directive/audio-play-directive.js');
const AudioStopDirective = require('./entity/directive/audio-stop-directive.js');

const AlexaCardModel = require('./model/alexa_card_model.js');
const CardAlexa = require('./entity/alexa/card_alexa.js');
const RequestAlexa = require('./entity/alexa/request_alexa.js');
const ResponseAlexa = require('./entity/alexa/response_alexa.js');
const SessionAlexa = require('./entity/alexa/session_alexa.js');
const UserAlexa = require('./entity/alexa/user_alexa.js');
const IntentAlexa = require('./entity/alexa/intent_alexa.js');
const DataAlexa = require('./entity/alexa/data_alexa.js');
const AlexaAudioPlayDirective = require('./entity/alexa/directive/alexa-audio-play-directive.js');
const AlexaAudioClearDirective = require('./entity/alexa/directive/alexa-audio-clear-directive.js');

const RequestGoogle = require('./entity/google/request_google.js');
const ResponseGoogle = require('./entity/google/response_google.js');
const SessionGoogle = require('./entity/google/session_google.js');
const UserGoogle = require('./entity/google/user_google.js');
const IntentGoogle = require('./entity/google/intent_google.js');
const DataGoogle = require('./entity/google/data_google.js');
const PaymentGoogleModel = require('./model/payment_google_model.js');

const RequestClova = require('./entity/clova/request_clova.js');
const ResponseClova = require('./entity/clova/response_clova.js');
const SessionClova = require('./entity/clova/session_clova.js');
const UserClova = require('./entity/clova/user_clova.js');
const IntentClova = require('./entity/clova/intent_clova.js');
const DataClova = require('./entity/clova/data_clova.js');


module.exports = {
    eventDispatcher,
    models: {
        AppModel,
        DashbotModel,
    },
    entities: {
        User,
        Session,
        Error,
        Request,
        Response,
        Intent,
        IntentTypes,
        Router,
        Message,
        Handler,
        Card,
        directives: {
            Directive,
            AudioPlayDirective,
	    AudioStopDirective,
        },
        alexa: {
            RequestAlexa,
            ResponseAlexa,
            SessionAlexa,
            UserAlexa,
            IntentAlexa,
            DataAlexa,
            card: {
                CardAlexa
            },
            AlexaCardModel,
	    directives: {
		AlexaAudioPlayDirective,
		AlexaAudioClearDirective,
	    }
        },
        google: {
            RequestGoogle,
            ResponseGoogle,
            SessionGoogle,
            UserGoogle,
            IntentGoogle,
            DataGoogle,
	    PaymentGoogleModel
        },
        clova: {
            RequestClova,
            ResponseClova,
            SessionClova,
            UserClova,
            IntentClova,
            DataClova,
        }
    },
};
