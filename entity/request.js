'use strict';
const Session = require("./session");
const User = require("./user");
const Intent = require("./intent");
let Response = require("./response");

class Request {

    /**
     * @param {Object} data
     */
    constructor(data) {
        this.response = data.response;
        this.error = data.error || '';
        this.data = data.data;
        this.session = data.session;
        this.user = data.user;
        this.intent = data.intent;
        this.device = data.device;
        this.lang = data.lang;
        this.created = Date.now();
    }


    /**
     * @returns {Object} data
     */
    getData() {
        return this.data;
    }

    /**
     * @param {Object} data
     */
    setData(data) {
        this.data = data;
    }

    /**
     * @returns {Session} session
     */
    getSession() {
        return this.session;
    }

    /**
     * @param {Session} session
     */
    setSession(session) {
        this.session = session;
    }

    /**
     * @returns {User} user
     */
    getUser() {
        return this.user;
    }

    /**
     * @param {User} user
     */
    setUser(user) {
        this.user = user;
    }

    /**
     * @returns {Intent} intent
     */
    getIntent() {
        return this.intent;
    }

    /**
     * @param {Intent} intent
     */
    setIntent(intent) {
        this.intent = intent;
    }

    /**
     * @returns {string} lang
     */
    getLang() {
        return this.lang;
    }

    /**
     * @param {string} lang
     */
    setLang(lang) {
        this.lang = lang;
    }

    /**
     * @returns {string} country
     */
    getCountry() {
        return this.country;
    }

    /**
     * @param {string} country
     */
    setCountry(country) {
        this.country = country;
    }

    process(appHandler) {
        return this.getResponse().process(appHandler, this);
    }

    /**
     *
     * @param response {Response}
     */
    setResponse(response) {
        this.response = response;
    }

    /**
     *
     * @returns {Response}
     */
    getResponse() {
        return this.response;
    }

    setDevice(device){
        this.device = device;
    }

    getDevice(){
        return this.device;
    }

    hasDisplay(){
        return false;
    }

    getResponseTime(){
        return (Date.now() - this.created) / 1000;
    }
}

module.exports = Request;