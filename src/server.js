var autohost = require( "autohost" );
var host;
var hyped = require( "hyped" )();
var authProvider = require( "autohost-nedb-auth" )( {} );
var fount = require( "fount" );
var config = require( "./config.js" );
var postal = require( "postal" );
var channel = postal.channel( "eventChannel" );
var path = require( "path" );
require( "autohost-webhook" );

function start() {
	if( config.storage ) {
		fount.register( "storageConfig", config.storage );
	}
	try {
		fount.register( "webHookEvents", channel );
		fount.register( "events", channel );
		var hostConfig = {
			port: config.host.port,
			modules: config.host.modules,
			fount: fount,
			noSession: config.host.noSession,
			resources: path.resolve( __dirname, "../resource" ),
			authProvider: authProvider,
			cors: config.host.cors,
			logging: config.host.logging
		};
		if( config.host.urlPrefix ) {
			hostConfig.urlPrefix = config.host.urlPrefix;
		}
		if( config.host.apiPrefix ) {
			hostConfig.apiPrefix = config.host.apiPrefix;
		}
		host = hyped.createHost( autohost, hostConfig, function() {
			host.start();
		} );
		if( config.consul ) {
			console.log( "TRYING TO REACH CONSUL" );
			var daedalus = require( "daedalus" )( "nonstop-host", config.consul );
			daedalus.register( config.host.port, [ "0.1.0", "nonstop", "index" ] );
		}
	} catch ( err ) {
		console.log( "Starting server failed with", err.stack );
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
