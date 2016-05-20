'use strict';

const _ = require('lodash');
const conf = require('rc')('cpkit');

// Use WHM API to Call cPanel API & UAPI, https://documentation.cpanel.net/pages/viewpage.action?pageId=8159727
const services = {
	listaccts: '/json-api/listaccts?api.version=1',
	list_pops: '/json-api/cpanel?cpanel_jsonapi_apiversion=3&cpanel_jsonapi_user=<%= user %>&cpanel_jsonapi_module=Email&cpanel_jsonapi_func=list_pops',
	list_domains: '/json-api/cpanel?cpanel_jsonapi_apiversion=3&cpanel_jsonapi_user=<%= user %>&cpanel_jsonapi_module=DomainInfo&cpanel_jsonapi_func=list_domains',
	listresellers: '/json-api/listresellers?api.version=1',
	listpkgs: '/json-api/listpkgs?api.version=1'
};

exports.get = (key, data) => {
	if (services[key]) {
		return _.template(conf.url + services[key])(data);
	}

	return null;
}
