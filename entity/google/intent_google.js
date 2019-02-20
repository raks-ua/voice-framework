'use strict';

const Intent = require("../intent");

class IntentGoogle extends Intent {

    /**
     *
     * @param {Object} data
     */
    constructor(data = '') {
        super(data);
        if (data.parameters) this.setParameters(data.parameters);
        this.queryText = '';
	this.args = {};
	this.option;
    }


    /**
     *
     * @param {Object} parameters
     */
    setParameters(parameters) {
        if (Object.keys(parameters).length === 0) return false;
        this.parameters = parameters;
        for (let parameter in parameters) {
            this.setValue(parameter, parameters[parameter]);
        }
    }

    setQueryText(queryText){
        this.queryText = queryText;
    }

    getQueryText(){
        return this.queryText;
    }

    setArguments(inputs){
	let items = {};
	for(let i = 0; i < inputs.length; i++){
    	    if (!inputs[i].arguments) continue;
	    for(let k = 0; k < inputs[i].arguments.length; k++){
		let argument = inputs[i].arguments[k];
		if(!argument.name) continue;
		items[argument.name] = argument.extension;
	    }
	}
	this.args = items;
    }

    getArguments(){
	return this.args;
    }

    getArgument(name){
	if(!this.args) return undefined;
	return this.args[name];
    }

    setOption(option){
	this.option = option;
    }

    getOption(){
	return this.option;
    }
}

module.exports = IntentGoogle;