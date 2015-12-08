var path = require( "path" );

console.log( "LOADING CONFIG JSON FROM", process.cwd() );

module.exports = require( "configya" )
(
	path.join( process.cwd(), "./config.json" ),
	{
		host: {
			cors: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "X-Requested-With,Authorization,Content-Type",
 				"Access-Control-Allow-Methods": "OPTIONS,POST,PUT,PATCH,GET,DELETE"
			},
			modules: [
				"nonstop-package-resource",
				"nonstop-registry-resource",
				"autohost-webhook"
			],
			noSession: true,
			port: 4444,
			urlPrefix: "",
			apiPrefix: "",
			logging: {
				adapters: {
					stdOut: {
						level: 3,
						topic: "#"
					}
				}
			}
		}
	}
);
