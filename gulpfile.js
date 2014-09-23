var gulp = require( 'gulp' );
var mocha = require( 'gulp-mocha' );
var processHost = require( 'processHost' )();
var mochaPhantom = require( 'gulp-mocha-phantomjs' );
var webpack = require( 'gulp-webpack' );
var webpackCfg = require( './webpack.config.js' );

gulp.task( 'test', function() {
	return gulp.src( [ './spec/websocket/*.spec.js', './spec/socketio/*.spec.js', './spec/*.spec.js' ], { read: false } )
		.pipe( mocha( { reporter: 'spec' } ) )
		.on( 'end', process.exit.bind( process, 0 ) )
		.on( 'error', process.exit.bind( process, 1 ) );
} );

gulp.task( 'continuous-test', function() {
	return gulp.src( [ './spec/websocket/*.spec.js', './spec/socketio/*.spec.js', './spec/*.spec.js' ], { read: false } )
		.pipe( mocha( { reporter: 'spec' } ) );
} );

gulp.task( 'build-client', function() {
	return webpack( webpackCfg );
} );

gulp.task( 'continuous-client', function() {
	if ( !processHost.http ) {
		processHost.startProcess( 'http', {
			command: 'node',
			args: [ './src/index.js', '-s' ]
		} );
	}


	// I'm not entirely clear on when the
	// client will involve the mocha-phantom-browser
	// test runner output. But per discussion with Alex,
	// leaving this in for now for us to discuss.
	// var stream = mochaPhantom();
	// setTimeout( function() {
	// 	stream.write( { path: 'http://localhost:4488/spec/dash.html' } );
	// 	stream.end();
	// }, 200 );
	// return stream;
} );

gulp.task( 'watch', function() {
	gulp.watch( [ './src/**', './spec/**' ], [ 'continuous-test' ] );
} );

gulp.task( 'watch-client', function() {
	gulp.watch( [ './src/**', './spec/**', './public/**/*' ], [ 'build-client', 'continuous-client' ] );
} );

gulp.task( 'client', [ 'build-client', 'continuous-client', 'watch-client' ], function() {} );

gulp.task( 'default', [ 'continuous-test', 'watch' ], function() {} );