var autohost = require( "autohost" );
var host;
var hyped = require( "hyped" )();
var authProvider = require( "autohost-nedb-auth" )( {} );
var fount = require( "fount" );
var config = require( "./config.js" );
var daedalus = require( "daedalus" )( "nonstop-host", config.consul );
var hooks = require( "./hooks" );
var postal = require( "postal" );
var channel = postal.channel( "eventChannel" );
var path = require( "path" );
require( "./publisher" )( hooks, channel );

function start() {
	try {
		fount.register( "hooks", hooks );
		fount.register( "events", channel );
		host = hyped.createHost( autohost, {
			port: config.nonstop.host.port,
			modules: [
				"nonstop-package-resource",
				"nonstop-registry-resource"
			],
			fount: fount,
			resources: path.resolve( __dirname, "../resource" ),
			authProvider: authProvider
		}, function() {
			host.start();
		} );

		daedalus.register( config.nonstop.host.port, [ "0.1.0", "nonstop", "hub" ] );
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
