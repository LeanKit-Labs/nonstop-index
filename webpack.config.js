var webpack = require( "webpack" ); //jshint ignore:line
var path = require( "path" );

module.exports = {
	context: __dirname,
	entry: "./public/js/app.js",
	output: {
		path: path.join( __dirname, "./public/js-dist" ),
		publicPath: "./js-dist/",
		filename: "main.js",
		chunkFilename: "[hash]/js/[id].js"
	},
	amd: { jQuery: true },
	module: {
		loaders: [
			{ test: /\.jsx$/, loader: "jsx-loader" },
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{ test: /\.json$/, loader: "json-loader" }
		]
	},
	resolve: {
		alias: {
			jquery: path.join( __dirname, "./node_modules/jquery/dist/jquery.js" ),
			lodash: path.join( __dirname, "./node_modules/lodash/dist/lodash.js" ),
			react: path.join( __dirname, "./node_modules/react/dist/react-with-addons.js" ),
			conduitjs: path.join( __dirname, "./node_modules/conduitjs/lib/conduit.js" ),
			machina: path.join( __dirname, "./node_modules/machina/lib/machina.js" ),
			postal: path.join( __dirname, "./node_modules/postal/lib/postal.js" ),
			"postal.request-response": path.join( __dirname, "./node_modules/postal.request-response/lib/postal.request-response.js" ),
			"lux": path.join( __dirname, "./node_modules/lux.js/lib/lux.js" ),
			traceur: path.join( __dirname, "./node_modules/traceur/bin/traceur-runtime.js" ),
			"when.pipeline": path.join( __dirname, "./node_modules/when/pipeline.js" ),
			"when.parallel": path.join( __dirname, "./node_modules/when/parallel.js" ),
		}
	},
	debug: true
};