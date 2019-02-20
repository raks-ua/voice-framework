'use strict';

const request = require('request');
const {google} = require('googleapis');
const {CompletePurchase} = require('actions-on-google');

const SKU_TYPE_IN_APP = 'SKU_TYPE_IN_APP';
const SKU_TYPE_SUBSCRIPTION = 'SKU_TYPE_SUBSCRIPTION';

class PaymentGoogleModel {

    constructor(config) {
        this.config = config;
	//console.log(config);
    }

    getJWTClient() {
        const jwtClient = new google.auth.JWT(
            this.config.serviceAccount.client_email, null, this.config.serviceAccount.private_key,
            ['https://www.googleapis.com/auth/actions.purchases.digital'],
            null
        );
        return jwtClient;
    }

    getInAppSkus(conversationId, ids, callback){
	this.getSKUs(SKU_TYPE_IN_APP, conversationId, ids, callback);
    }

    getSubscriptionSkus(conversationId, ids, callback){
	this.getSKUs(SKU_TYPE_SUBSCRIPTION, conversationId, ids, callback);
    }


    getSKUs(type, conversationId, ids, callback) {
        const jwtClient = this.getJWTClient();
        return jwtClient.authorize((err, tokens) => {
            if (err) {
                return callback && callback(err);
            }

            const packageName = this.config.packageName;

            request.post(`https://actions.googleapis.com/v3/packages/${packageName}/skus:batchGet`, {
                'auth': {
                    'bearer': tokens.access_token,
                },
                'json': true,
                'body': {
                    'conversationId': conversationId,
                    'skuType': type,
                    'ids': ids
                },
            }, (err, httpResponse, body) => {
                //console.log('[RES]', conversationId, this.config.packageName, JSON.stringify(err), JSON.stringify(httpResponse), JSON.stringify(body));

                if (err) {
                    return callback && callback(err);
                }
                //console.log(JSON.stringify(body));
                callback && callback(httpResponse.statusCode === 200 ? undefined : `${httpResponse.statusCode}: ${httpResponse.statusMessage}`, httpResponse.statusCode === 200 ? body.skus : undefined);
            });
        });
    }

    isInAppSubscribed(productId, packageEntitlements, period) {
        let isSubscribed = false;
        for (let i = 0; i < packageEntitlements.length; i++) {
            let packageEntitlement = packageEntitlements[i];
	    if(packageEntitlement.packageName !== this.config.packageName) continue;
	    for(let k = 0; k < packageEntitlement.entitlements.length; k++){
		let item = packageEntitlement.entitlements[k];
        	if(item.sku !== productId) continue;
    		if(item.inAppDetails.inAppPurchaseData.autoRenewing === true) {
            	    isSubscribed = true;
            	    break;
        	}
        	let purchaseTime = item.inAppDetails.inAppPurchaseData.purchaseTime;
        	if(purchaseTime + period * 1000 > Date.now()){
            	    isSubscribed = true;
            	    break;
        	}
	    }
        }
        return isSubscribed;
    }

    getAllSubscriptions(packageEntitlements){
	let subscriptions = [];
	for (let i = 0; i < packageEntitlements.length; i++) {
	    let packageEntitlement = packageEntitlements[i];
	    if(packageEntitlement.packageName !== this.config.packageName) continue;
	    for(let k = 0; k < packageEntitlement.entitlements.length; k++){
		    let item = packageEntitlement.entitlements[k];
		    if(item.skuType !== 'SUBSCRIPTION') continue;
		    subscriptions.push(item);
		}
	}
	return subscriptions;
    }

    completeInAppPurchase(productId){
	return this.completePurchase(productId, SKU_TYPE_IN_APP);
    }

    completeSubscribePurchase(productId){
	return this.completePurchase(productId, SKU_TYPE_SUBSCRIPTION);
    }


    completePurchase(productId, skuType) {
        return new CompletePurchase({
            skuId: {
                skuType: skuType,
                id: productId,
                packageName: this.config.packageName
            }
        })
    }

    consume(conversationId, purchaseToken, callback) {
	console.log('[consume]', conversationId, purchaseToken);
        const jwtClient = this.getJWTClient();
        jwtClient.authorize((err, tokens) => {
            if (err) {
                return callback && callback(err);
            }
	    let consumePromise = new Promise((resolve, reject) => {;
	    request.post(`https://actions.googleapis.com/v3/conversations/${conversationId}/entitlement:consume`, {
        	'auth': {
            	    'bearer': tokens.access_token,
        	},
        	'json': true,
        	'body': {
            	    "purchaseToken": purchaseToken
        	},
    	    }, (err, httpResponse, body) => {
        	if (err) {
            	    throw new Error(`API request error: ${err}`);
        	}
        	console.log(`${httpResponse.statusCode}: ${httpResponse.statusMessage}`);
        	console.log(JSON.stringify(httpResponse));
        	console.log(JSON.stringify(body));
        	resolve(body);
    	    });
	    });

    	    consumePromise.then(body => {
        	const consumed = Object.keys(body).length === 0;
		callback && callback(undefined, consumed);
	    }).catch((err) => {
		callback && callback(err);
	    });
        });
    }
}

module.exports = PaymentGoogleModel;