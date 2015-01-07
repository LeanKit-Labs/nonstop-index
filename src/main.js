var fs = require( 'fs' );
var path = require( 'path' );
var _ = require( 'lodash' );
var when = require( 'when' );
var sequence = require( 'when/sequence' );
var uuid = require( 'node-uuid' );
var machina = require( 'machina' );

module.exports = function( prompt, server ) {
	var auth = server.auth;
	var Machine = machina.Fsm.extend( {
		
		raiseAny: function( step ) {
			return function( err, result ) {
				var ev = step + '.' + ( err ? 'failed' : 'done' );
				this.handle( ev, err || result );
			}.bind( this );
		},

		raiseResult: function( step ) {
			return function( result ) {
				this.handle( step + '.done', result );
			}.bind( this );
		},

		setupAdmin: function() {
			sequence( [
				function() { return auth.createUser( 'admin', 'admin' ); },
				function() { return auth.createRole( 'admin' ); },
				function() { return auth.changeUserRoles( 'admin', [ 'admin' ], 'add' ); },
				function() { return auth.createRole( 'client' ); },
				function() { return auth.changeActionRoles( 'package.list', [ 'client' ], 'add' ); },
				function() { return auth.changeActionRoles( 'package.projects', [ 'client' ], 'add' ); },
				function() { return auth.changeActionRoles( 'package.terms', [ 'client' ], 'add' ); },
				function() { return auth.createRole( 'agent' ); },
				function() { return auth.changeActionRoles( 'package.upload', [ 'agent' ], 'add' ); },			
				function() {
					return when.promise( function( resolve ) {
						auth.getActions()
							.then( function( actions ) {
								when.all( _.map( actions, function( action ) {
									return auth.changeActionRoles( action.name, [ 'admin' ], 'add' );
								} ) ).then( resolve );
							} );
					} );
				}
			] )
			.then( function() {
				console.log( 'Created admin account with default permissions' );
				this.transition( 'checkingParameters' );
			}.bind( this ) );
		},
		
		initialState: 'checkingForAdmin',
		states: {
			adminPassword: {
				_onEnter: function() {
					prompt.admin( this.raiseResult( 'prompt' ) );
				},
				'prompt.done': function( passwords ) {
					if( passwords.nextPassword === passwords.confirmPassword ) {
						auth.changePassword( 'admin', passwords.nextPassword )
							.then( this.raiseResult( 'changePassword' ) );
					} else {
						console.log( 'Passwords must match in order to change the admin password.' );
						this.transition( 'prompt' );
					}					
				},
				'changePassword.done': function() {
					console.log( 'Admin password changed successfully' );
					this.transition( 'prompt' );
				}
			},
			checkingForAdmin: {
				_onEnter: function() {
					auth.getUsers()
						.then( function( list ) {
							var hasAdmin = _.any( list, function( user ) { return user.name === 'admin'; } );
							if( hasAdmin ) {
								this.transition( 'checkingParameters' );
							} else {
								this.transition( 'createAdmin' );
							}
						}.bind( this ) );
				}
			},
			checkingParameters: {
				_onEnter: function() {
					var nextState = prompt.start ? 'start' : 'prompt';
					this.transition( nextState );
				}
			},
			createAdmin: {
				_onEnter: function() {
					server.start();
							console.log( 'Initializing database...' );
							setTimeout( function() {
								this.setupAdmin();
								server.stop();
							}.bind( this ), 5000 );
				}
			},
			agentCredentials: {
				_onEnter: function() {
					prompt.agent( this.raiseResult( 'prompt' ) );
				},
				'prompt.done': function( credentials ) {
					sequence( [
							function() { return auth.createUser( credentials.user, credentials.password ); },
							function() { return auth.changeUserRoles( credentials.user, [ 'agent' ], 'add' ); },
							function() { return auth.createToken( credentials.user, credentials.token ); }
						] )
						.then( function() {
							console.log( 'Agent credentials and permissions created.' );
							this.transition( 'prompt' );
						}.bind( this ) );
				}
			},
			clientCredentials: {
				_onEnter: function() {
					prompt.client( this.raiseResult( 'prompt' ) );
				},
				'prompt.done': function( credentials ) {
					var token = uuid.v4();
					sequence( [
							function() { return auth.createUser( credentials.user, credentials.password ); },
							function() { return auth.changeUserRoles( credentials.user, [ 'client' ], 'add' ); },
							function() { return auth.createToken( credentials.user, token ); }
						] )
						.then( function() {
							console.log( 'Client credentials and permissions created. Client token:', token );
							this.transition( 'prompt' );
						}.bind( this ) );
				}
			},
			prompt: {
				_onEnter: function() {
					console.log( 'initiating prompt' );
					try {
						prompt.initiate( this.raiseResult( 'prompt' ) );
					} catch( e ) { console.log( e.stack ); }
				},
				'prompt.done': function( choice ) {
					var nextState = prompt.lookup[ choice.initialization ];
					this.transition( nextState );
				}
			},
			start: {
				_onEnter: function() {
					server.start();
				}
			}
		}
	} );
	var m = new Machine();
};