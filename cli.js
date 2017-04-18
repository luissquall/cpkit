#!/usr/bin/env node
'use strict';

const yargs = require('yargs');

let argv = yargs
    .usage('Usage: $0 <command>')
	.command(require('./commands/listpackages'))
	.command(require('./commands/listaccounts'))
	.command(require('./commands/listemails'))
	.command(require('./commands/listdomains'))
	.demand(1, 'must provide a valid command')
	.help('h')
	.alias('h', 'help')
	.argv;
