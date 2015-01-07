var host = require( 'autohost' );
var hyped = require( 'hyped' )();
var authProvider = require( 'autohost-nedb-auth' )( {} );
var config = require( './config.js' );
var daedalus = require( 'daedalus' )( 'nonstop-host', config.consul );

function start() {
	try {
		host.init( { 
			port: config.nonstop.host.port, 
			socketIO: true,
			origin: 'nonstop',
			modules: [ 'nonstop-package-resource' ],
			urlStrategy: hyped.urlStrategy,
			noOptions: true
		}, authProvider )
		.then( hyped.addResources );
		hyped.setupMiddleware( host );
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