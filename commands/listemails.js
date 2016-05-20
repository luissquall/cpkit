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
					let url = services.get('list_pops', account);
					request.get(_.merge({url: url}, reqOptions), onEmailsResponse.bind(null, account, cb));
				});
			}
		} else {
			console.error('Error %s on listaccts.', response.statusCode);
		}
	}
}

function onEmailsResponse(account, cb, error, response, body) {
	let data;
	let line;

	if (error) {
		console.error('Error ' + error);
	} else {
		if (response.statusCode == 200) {
			data = body.result.data;

			if (data.length) {
				data.forEach(function(email) {
					line = `${account.owner},${account.user},${email.email}`;
					console.log(line);
				});
			}
		} else {
			console.error('Error %s on list_pops.', response.statusCode);
		}
	}

	cb();
}

exports.command = 'listemails';

exports.describe = 'List email accounts';

exports.builder = {};

exports.handler = function (argv) {
	request.get(_.merge({url: services.get('listaccts')}, reqOptions), onAccountsResponse);
}
