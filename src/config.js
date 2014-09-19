var path = require( 'path' );

module.exports = require( 'configya' )
	( 
		path.join( process.cwd(), './config.json' ),
		{
			continua: {
				host: {
					port: 4444
				}
			},
			consul: {
				dc: 'dc1'
			}
		} 
	);