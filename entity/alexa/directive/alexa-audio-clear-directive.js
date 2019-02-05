let Directive = require('./../../directive/directive');

const CLEAR_ENQUEUED = 'CLEAR_ENQUEUED';
const CLEAR_ALL = 'CLEAR_ALL';

class AlexaAudioClearDirective extends Directive {
    constructor(data){
	super();
	this.clearBehavior = CLEAR_ENQUEUED;
    }

    getClearBehavior(){
	return this.clearBehavior;
    }

    clearAll(){
	this.clearBehavior = CLEAR_ALL;
    }

    clearCurrent(){
	this.clearBehavior = CLEAR_ENQUEUED;
    }

}

module.exports = AlexaAudioClearDirective;

