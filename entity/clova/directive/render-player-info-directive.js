let Directive = require('./../../directive/directive');
const uuid = require('uuid').v4;

class RenderPlayerInfoDirective extends Directive {
    constructor(){
	this.controls = [];
	this.playableItems = [];
	this.displayType = 'single';
	this.provider = undefined;
	
    }

    addPauseButton(){
	this.addButton('PLAY_PAUSE', true, false);
    }

    addLikeButton(){
	this.addButton('LIKE_DISLIKE', true, false);
    }

    addProgressBarButton(){
	this.addButton('PROGRESS_BAR', true, false);
    }
    
    addButton(name, enabled, selected){
	this.controls.push({
	    enabled: enabled,
            name: name,
            selected: selected,
            type: 'BUTTON'
	});
    }

//token:uuid(), titleText:'빗소리', titleSubText1:'[출처] 잡소리 스킬', artImageUrl:`${DOMAIN}/img_sound_rain_108.png`, headerText:'잡소리 스킬 재생 목록', stream:`${DOMAIN}/rainning_sound.mp3`
    addPlayableItem(stream, title, subText, token, showAdultIcon, artImageUrl, headerText){
	showAdultIcon = showAdultIcon !== true && showAdultIcon !== false ? false: showAdultIcon;
	token = token || uuid();

	let item = {
	    token,
	    stream,
	    titleText: title,
	    titleSubText1: subText,
	    showAdultIcon,
	};
	if(artImageUrl) item.artImageUrl = artImageUrl;
	if(headerText) item.headerText = headerText;
	this.playableItems.push(item);
    }

    setProvider(name, logoUrl, smallLogoUrl){
	this.provider = {
	    name: name
	};
	if(logoUrl) this.provider.logoUrl = logoUrl;
	if(smallLogoUrl) this.provider.smallLogoUrl = smallLogoUrl;
    }

    getResponse(){
	let data = {
	    header: {
		namespace: 'TemplateRuntime',
		name: 'RenderPlayerInfo',
		messageId: uuid(),
	    },
	    payload: {
    		controls: this.controls,
        	displayType: this.displayType,
    		playerId: uuid(), //????
        	playableItems: this.playableItems,
	    }
	};
	if(this.provider) data.provider = this.provider;
	return data;
    }
}

module.exports = RenderPlayerInfoDirective;

