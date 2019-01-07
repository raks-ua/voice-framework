let Directive = require('./directive');

class AudioPlayDirective extends Directive {

    setUrl(url){
        this.url = url;
    }

    getUrl(){
        return this.url;
    }

    setSource(source){
        this.source = source;
    }

    getSource(source){
        return this.source;
    }


    setBehaviour(behaviour) {
        this.behaviour = behaviour;
    }

    getBehaviour() {
        return this.behaviour || 'REPLACE_ALL';
    }
}

module.exports = AudioPlayDirective;
