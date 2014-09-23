var _ = require( 'lodash' );
var commander = require( 'commander' );
var inquire = require( 'inquirer' );

var initialChoices = {
		adminPassword: 'Change admin password',
		agentCredentials: 'Create agent credentials',
		clientCredentials: 'Create client credentials',
		start: 'Start service'
	},
	reverseLookup = {};
_.each( initialChoices, function( val, key ) { reverseLookup[ val ] = key; } );

commander
	.option( '-s, --start', 'Start service immediately' )
	.parse( process.argv );

function adminPrompt( cb ) {
	inquire.prompt( [
		{
			type: 'password',
			name: 'nextPassword',
			message: 'New password'
		},
		{
			type: 'password',
			name: 'confirmPassword',
			message: 'Confirm new password'
		}
	], cb );
}

function agentPrompt( cb ) {
	inquire.prompt( [
		{
			type: 'input',
			name: 'user',
			message: 'Agent username'
		},
		{
			type: 'password',
			name: 'password',
			message: 'Agent password'
		},
		{
			type: 'input',
			name: 'token',
			message: 'Agent token'
		}
	], cb );
}

function clientPrompt( cb ) {
	inquire.prompt( [
		{
			type: 'input',
			name: 'user',
			message: 'Client username'
		},
		{
			type: 'password',
			name: 'password',
			message: 'Client password'
		}
	], cb );
}

function initiatePrompt( cb ) {
	inquire.prompt( [
		{
			type: 'list',
			name: 'initialization',
			message: 'Please select a task:',
			choices: _.values( initialChoices )
		}
	], cb );
}

module.exports = {
	admin: adminPrompt,
	agent: agentPrompt,
	client: clientPrompt,
	initiate: initiatePrompt,
	lookup: reverseLookup,
	start: commander.start
};