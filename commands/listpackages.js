'use strict';

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

function onResellersResponse(error, response, body) {
	let data;

	if (error) {
		console.error(error);
	} else {
		if (response.statusCode == 200) {
			data = body.data;
			request.get(Object.assign({url: services.get('listpkgs')}, reqOptions), onPackagesResponse.bind(null, data.reseller));
		} else {
			console.error('Error %s on listresellers.', response.statusCode);
		}
	}
}

function onPackagesResponse(resellers, error, response, body) {
    let data;
    let regexp;
    let row;

    if (error) {
        console.error(error);
    } else {
        if (response.statusCode == 200) {
            data = body.data;

            if (data.pkg.length) {
                if (resellers.length) {
                    regexp = new RegExp('^(' + resellers.join('|') + ')_');
                }

                row = ['name', 'reseller', 'disk_quota', 'monthly_bandwidth', 'ftp_accounts', 'email_accounts', 'databases', 'subdomains', 'addon_domains'];
                console.log(row.join(','));

                // If a package name is preceded by a reseller’s username and an underscore, only that reseller can see the package.
                data.pkg.forEach(function (pkg, index) {
                    let reseller = 'root';
                    let found = pkg.name.match(regexp);

                    if (found) {
                        reseller = found[1];
                    }

                    row = [reseller, pkg.name, pkg.QUOTA, pkg.BWLIMIT, pkg.MAXFTP, pkg.MAXPOP, pkg.MAXSQL, pkg.MAXSUB, pkg.MAXADDON];
                    console.log(row.join(','));
                })
            }
        } else {
            console.error('Error %s on listpkgs.', response.statusCode);
        }
    }
}

exports.command = 'listpackages';

exports.describe = 'List packages';

exports.builder = {};

exports.handler = function (argv) {
	request.get(Object.assign({url: services.get('listresellers')}, reqOptions), onResellersResponse);
}
