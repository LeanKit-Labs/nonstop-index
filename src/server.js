var	_ = require( 'lodash' );
var path = require( 'path' );
var sequence = require( 'when/sequence' );
var host = require( 'autohost' );
var authProvider = require( 'autohost-nedb-auth' )( {} );
var config = require( './config.js' );
var daedalus = require( 'daedalus' )( 'nonstop-host', config.consul );

function start() {
	try {
		host.init( { 
			port: config.nonstop.host.port, 
			socketIO: true,
			origin: 'nonstop',
			modules: [ 'nonstop-package-resource' ]
		}, authProvider );
		daedalus.register( config.nonstop.host.port, [ '0.1.0', 'nonstop', 'hub' ] );
	} catch( err ) {
		console.log( 'Starting server failed with', err.stack );
	}
}

function stop() {
	host.stop();
}

module.exports = {
	auth: authProvider,
	start: start,
	stop: stop
};