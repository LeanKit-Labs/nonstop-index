var autohost = require( 'autohost' );
var host;
var hyped = require( 'hyped' )();
var authProvider = require( 'autohost-nedb-auth' )( {} );
var config = require( './config.js' );
var daedalus = require( 'daedalus' )( 'nonstop-host', config.consul );

function start() {
	try {
		host = hyped.createHost( autohost, {
			port: config.nonstop.host.port,
			modules: [
				'nonstop-package-resource',
				'nonstop-registry-resource'
			],
			authProvider: authProvider
		}, function() {
			host.start();
		} );

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
