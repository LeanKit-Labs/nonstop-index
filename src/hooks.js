var hooks = require( "./db" )( "hooks.db" );

function add( id, hook ) {
	return hooks.upsert(
		{ id: id },
		hook
	);
}

function check( id ) {
	return hooks.count( { id: id } )
		.then( function( count ) {
			return count > 0 ;
		} );
}

function getById( id ) {
	return hooks.fetch( { id: id } );
}

function getList() {
	return hooks.fetch( {} );
}

function remove( id ) {
	return hooks.purge( { id: id } );
}

module.exports = {
	add: add,
	checkId: check,
	getById: getById,
	getList: getList,
	remove: remove
};
