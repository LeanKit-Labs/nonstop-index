require( "../setup" );
var postal = require( "postal" );
var publisherFn = require( "../../src/publisher" );

describe( "Publisher", function() {
	var hooks, channel;
	var host1, host2, host3;
	var subscription;

	before( function() {
		nock.disableNetConnect();
		channel = postal.channel( "testevents" );
		hooks = { getList: _.noop };
	} );

	describe( "when receiving an event with no registered hooks", function() {
		var publisher, emptyMock;
		before( function() {
			emptyMock = sinon.mock( hooks );
			emptyMock.expects( "getList" )
				.resolves( [] );

			subscription = publisher = publisherFn( hooks, channel );
			channel.publish( "test.event", {
				test: true,
				message: "anyone listening?"
			} );
		} );

		it( "should have requested list from hooks on event", function() {
			emptyMock.verify();
		} );

		describe( "after a hook is added", function() {
			var addedMock;
			before( function() {
				addedMock = sinon.mock( hooks );
				host1 = nock( "http://hook.host.one.net", {
					reqheaders: {
						"content-type": "application/json",
						authorization: "Basic Auth"
					}
				} )
				.post( "/api/callme",
				{
					test: true,
					message: "to host 1 only"
				} )
				.reply( 200 );

				addedMock.expects( "getList" )
					.resolves( [
						{
							url: "http://hook.host.one.net/api/callme",
							headers: {
								authorization: "Basic Auth"
							},
							method: "POST"
						}
					] );
				channel.publish( "test.event", {
					test: true,
					message: "to host 1 only"
				} );
			} );

			it( "should have requested list from hooks on event", function() {
				addedMock.verify();
			} );

			it( "should publish event to new hook", function() {
				host1.done();
			} );
		} );

		describe( "with multiple registered hooks", function() {
			var addedMock;
			before( function() {
				addedMock = sinon.mock( hooks );
				host1 = nock( "http://hook.host.one.net", {
					reqheaders: {
						"content-type": "application/json",
						authorization: "Basic Auth"
					}
				} )
				.post( "/api/callme",
				{
					test: true,
					message: "a thing for all 3 hosts"
				} )
				.reply( 200 );

				host2 = nock( "https://hook.host.two.net", {
					reqheaders: {
						"content-type": "application/json",
						authorization: "bearer atoken"
					}
				} )
				.put( "/something/happened",
				{
					test: true,
					message: "a thing for all 3 hosts"
				} )
				.reply( 200 );

				host3 = nock( "http://hook.host.three.net:8080", {
					reqheaders: {
						"content-type": "application/json"
					}
				} )
				.post( "/event",
				{
					test: true,
					message: "a thing for all 3 hosts"
				} )
				.reply( 200 );

				addedMock.expects( "getList" )
					.resolves( [
						{
							url: "http://hook.host.one.net/api/callme",
							headers: {
								authorization: "Basic Auth"
							},
							method: "POST"
						},
						{
							url: "https://hook.host.two.net/something/happened",
							headers: {
								authorization: "bearer atoken"
							},
							method: "PUT"
						},
						{
							url: "http://hook.host.three.net:8080/event"
						}
					] );

				channel.publish( "test.event", {
					test: true,
					message: "a thing for all 3 hosts"
				} );
			} );

			it( "should have requested list from hooks on event", function() {
				addedMock.verify();
			} );

			it( "should publish event to all 3 hooks", function() {
				host1.done();
				host2.done();
				host3.done();
			} );
		} );

		describe( "with an unreachable hook", function() {
			var addedMock;
			before( function() {
				addedMock = sinon.mock( hooks );
				host1 = nock( "http://hook.host.one.net", {
					reqheaders: {
						"content-type": "application/json",
						authorization: "Basic Auth"
					}
				} )
				.post( "/api/callme",
				{
					test: true,
					message: "a thing for all 3 hosts"
				} )
				.reply( 200 );

				host3 = nock( "http://hook.host.three.net:8080", {
					reqheaders: {
						"content-type": "application/json"
					}
				} )
				.post( "/event",
				{
					test: true,
					message: "a thing for all 3 hosts"
				} )
				.reply( 200 );

				addedMock.expects( "getList" )
					.resolves( [
						{
							url: "http://hook.host.one.net/api/callme",
							headers: {
								authorization: "Basic Auth"
							},
							method: "POST"
						},
						{
							url: "https://hook.host.two.net/something/happened",
							headers: {
								authorization: "bearer atoken"
							},
							method: "PUT"
						},
						{
							url: "http://hook.host.three.net:8080/event"
						}
					] );

				channel.publish( "test.event", {
					test: true,
					message: "a thing for all 3 hosts"
				} );
			} );

			it( "should have requested list from hooks on event", function() {
				addedMock.verify();
			} );

			it( "should publish event to 2 available hooks", function() {
				host1.done();
				host3.done();
			} );
		} );
	} );

	after( function() {
		nock.cleanAll();
		nock.enableNetConnect();
		subscription.unsubscribe();
	} );
} );
