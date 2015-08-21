
module.exports = function( host, hooks ) {
	return {
		name: "hook",
		urlPrefix: "/nonstop",
		actions: {
			self: {
				method: "get",
				url: "/:id",
				handle: function( envelope ) {
					var id = envelope.data.id;
					return hooks.getById( id )
						.then(
							function( result ) {
								if ( result ) {
									return {
										data: result
									};
								} else {
									return {
										status: 404,
										data: { message: "Webhook not found" }
									};
								}
							},
							function( err ) {
								console.log( "Error trying to get webhook: " + id, err.stack );
								return {
									status: 500,
									data: { message: "Server error occurred" }
								};
							}
						);
				}
			},
			add: {
				method: "post",
				url: "/:id",
				handle: function( envelope ) {
					var id = envelope.data.id;
					function add() {
						return hooks.add( id, envelope.data )
							.then(
								function() {
									return {
										data: {
											id: id,
											message: "Webhook " + id + " added successfully"
										}
									};
								},
								onError
							);
					}
					function onError( err ) {
						console.log( "Error adding web hook: " + id, err.stack );
						return {
							status: 500,
							data: { message: "Failed to add webhook" }
						};
					}
					return hooks.checkId( id )
						.then( function( exists ) {
							return !exists ? add() :
								{
									status: 400,
									data: { message: "Webhook " + id + " already exists" }
								};
						},
						onError );
				},
				exclude: [ "_id" ]
			},
			list: {
				method: "get",
				url: "/",
				handle: function() {
					return hooks.getList()
						.then(
							function( list ) {
								return list;
							},
							function( err ) {
								console.log( "Error fetching webhook list:", err.stack );
								return {
									status: 500,
									data: { message: "Failed to get webhook list" }
								};
							}
						);
				},
				exclude: [ "_id" ]
			},
			remove: {
				method: "delete",
				url: "/:id",
				handle: function( envelope ) {
					var id = envelope.data.id;
					function onError( err ) {
						console.log( "Error removing webhook: " + id, err.stack );
						return {
							status: 500,
							data: { message: "Failed to remove webhook" }
						};
					}

					function remove() {
						return hooks.remove( id )
							.then(
								function() {
									return {
										data: {
											message: "Webhook " + id + " removed successfully"
										}
									};
								},
								onError
							);
					}
					return hooks.checkId( id )
						.then( function( exists ) {
							return exists ? remove() :
								{
									status: 404,
									data: { message: "Webhook " + id + " not found" }
								};
						},
						onError );
				}
			},
			update: {
				method: "put",
				url: "/:id",
				handle: function( envelope ) {
					var id = envelope.data.id;
					function onError( err ) {
						console.log( "Error updating webhook: " + id, err.stack );
						return {
							status: 500,
							data: { message: "Failed to update webhook" }
						};
					}
					function update() {
						return hooks.add( id )
							.then(
								function() {
									return {
										data: {
											id: id,
											message: "Webhook " + id + " updated successfully"
										}
									};
								},
								onError
							);
					}
					return hooks.checkId( id )
						.then( function( exists ) {
							return exists ? update() :
								{
									status: 404,
									data: { message: "Webhook " + id + " not found" }
								};
						},
						onError );
				}
			}
		}
	};
};
