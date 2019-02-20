'use strict';

const User = require("../user");

class UserGoogle extends User {


    constructor(data = '') {
        super(data);
	this.packageEntitlements = [];
    }

    setPackageEntitlements(packageEntitlements){
	this.packageEntitlements = packageEntitlements || [];
    }

    getPackageEntitlements(){
	return this.packageEntitlements;
    }

}

module.exports = UserGoogle;