'use strict';

const _ = require('lodash');
const conf = require('rc')('cpkit');

const services = {
	listaccts: '/json-api/listaccts?api.version=1',
	list_pops: '/json-api/cpanel?cpanel_jsonapi_apiversion=3&cpanel_jsonapi_user=<%= user %>&cpanel_jsonapi_module=Email&cpanel_jsonapi_func=list_pops'
};

exports.get = (key, data) => {
	if (services[key]) {
		return _.template(conf.url + services[key])(data);
	}

	return null;
}
