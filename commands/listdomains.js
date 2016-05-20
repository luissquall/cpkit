'use strict';

const _ = require('lodash');
const request = require('request');
const async = require('async');
const config = require('rc')('cpkit');
const services = require('../services');

let reqOptions = {
	json: true,
	headers: {
		'Authorization': `WHM root:${config.key}`
	},
	rejectUnauthorized: false
};

function onAccountsResponse(error, response, body) {
	let data;

	if (error) {
		console.error(error);
	} else {
		if (response.statusCode == 200) {
			data = body.data;

			if (data.acct.length) {
				async.eachLimit(data.acct, 3, function(account, cb) {
					let url = services.get('list_domains', account);
					request.get(_.merge({url: url}, reqOptions), onDomainsResponse.bind(null, account, cb));
				});
			}
		} else {
			console.error('Error %s on listaccts.', response.statusCode);
		}
	}
}

function onDomainsResponse(account, cb, error, response, body) {
	let data;
	let line;

	if (error) {
		console.error('Error ' + error);
	} else {
		if (response.statusCode == 200) {
			data = body.result.data;

            line = `${account.owner},${account.user},${data.main_domain},main`;
            console.log(line);

            data.addon_domains.forEach(function(domain) {
                line = `${account.owner},${account.user},${domain},addon`;
                console.log(line);
            });

            data.parked_domains.forEach(function(domain) {
                line = `${account.owner},${account.user},${domain},parked`;
                console.log(line);
            });
		} else {
			console.error('Error %s on list_domains.', response.statusCode);
		}
	}

	cb();
}

exports.command = 'listdomains';

exports.describe = 'List domains';

exports.builder = {};

exports.handler = function (argv) {
	request.get(_.merge({url: services.get('listaccts')}, reqOptions), onAccountsResponse);
}
