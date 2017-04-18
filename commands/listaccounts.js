'use strict';

const request = require('request');
const config = require('rc')('cpkit');
const services = require('../services');
const fields = [
	'domain',
	'ip',
	'ipv6',
	'user',
	'uid',
	'email',
	'startdate',
	'partition',
	'disklimit',
	'diskused',
	'plan',
	'theme',
	'owner',
	'unix_startdate',
	'suspended',
	'suspendtime',
	'is_locked',
	'suspendreason',
	'temporary',
	'backup',
	'legacy_backup',
	'inodeslimit',
	'inodesused',
	'mailbox_format',
	'max_defer_fail_percentage',
	'max_email_per_hour',
	'maxaddons',
	'maxftp',
	'maxlst',
	'maxparked',
	'maxpop',
	'maxsql',
	'maxsub',
	'min_defer_fail_to_trigger_protection',
	'outgoing_mail_hold',
	'outgoing_mail_suspended',
	'shell'
];

let reqOptions = {
	json: true,
	headers: {
		'Authorization': `WHM root:${config.key}`
	},
	rejectUnauthorized: false
};

function onAccountsResponse(error, response, body) {
	let data;
	let row;

	if (error) {
		console.error(error);
	} else {
		if (response.statusCode == 200) {
			data = body.data;

			// Header
			console.log(fields.join(','));

			if (data.acct.length) {
				data.acct.forEach(function(account, index) {
					row = [];

					fields.forEach(field => {
						let val = account[field];

						if (Array.isArray(val)) {
							val = val.join('|');
						}
						// Replace , with |
						if (typeof val == 'string') {
							val = val.replace(/,\s*/g, '|');
						}

						row.push(val);
					});

					console.log(row.join(','));
				}, this);
			}
		} else {
			console.error('Error %s on listaccts.', response.statusCode);
		}
	}
}

exports.command = 'listaccounts';

exports.describe = 'List accounts';

exports.builder = {};

exports.handler = function (argv) {
	request.get(Object.assign({url: services.get('listaccts')}, reqOptions), onAccountsResponse);
}
