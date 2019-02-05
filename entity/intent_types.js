'use strict';

let intentTypes = {
    TYPE_SPEECH: 'speech',
    TYPE_TEXT: 'text',
    TYPE_BUTTON: 'button',
    TYPE_AUDIO: 'audio',
    TYPE_VIDEO: 'video',
    TYPE_EVENT: 'event',
    TYPE_API: 'api',
    TYPE_SEO: 'seo',
    TYPE_ERROR: 'error'
};

let intentSubTypes = {
    SUB_TYPE_SYSTEM: 'system', // alexa -> System.ExceptionEncountered
    SUB_TYPE_PLAYBACK: 'playback',
    SUB_TYPE_ALEXA_SKILL: 'alexa_skill',
    SUB_TYPE_ALEXA_HOUSE_HOLD: 'alexa_house_hold',
};


module.exports = {
    intentTypes: intentTypes,
    intentSubTypes: intentSubTypes
};