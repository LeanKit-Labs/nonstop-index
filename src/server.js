var _ = require( 'lodash' );
var autohost = require( 'autohost' );
var authProvider = require( 'autohost-nedb-auth' )( {} );
var config = require( './config.js' );
var ahConfig = _.extend( config.nonstop.host, { authProvider: authProvider } );
var host = require( 'hyped' )().createHost(autohost, ahConfig);
var daedalus = require( 'daedalus' )( 'nonstop-host', config );

function start() {
	try {
		host.start();
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
