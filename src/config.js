var path = require( 'path' );

module.exports = require( 'configya' )
	(
		path.join( process.cwd(), './config.json' ),
		{
			nonstop: {
				host: {
					port: 4444,
					socketIO: true,
					origin: 'nonstop',
					modules: [ 'nonstop-package-resource' ]
				}
			},
			consul: {
				dc: 'dc1'
			}
		}
	);
