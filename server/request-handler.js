/* Import example data */
/* remember to call fakeData.fakeMessages */
var fakeData = require('./example/example-data.js');

/* Import url module */
var url = require('url');

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // check to see method of request
  // then grab the functionality stored in actions obj and run it
  // actions[request.method]
  var action = actions[request.method];
  action(request, response);



  // The outgoing status.
  // var statusCode = 200;

  // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('Hello, World!');

  // we may send back object messages or
  // a success message or error message
  // if error message change status code

};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

// Object to map actions to functions
var actions = {
  'GET' : function(req, res) {
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/json';
    var parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname === '/classes/messages') {
      res.writeHead(200, headers);
      res.end(JSON.stringify(fakeData.fakeMessages));
    } else {
      // check rest of headers
      res.writeHead(404, headers);
      res.end('bad request');
    }
  }
  // GET
  // responds to fetch request from client
  // check to make sure URL is correct (parse url?)
    // if it is, send back the data in question
    // if url is not, send an error message

  // POST
  // when user posts a new message
  // check to make sure URL is correct
    // if it is, add message object to wherever we store messages
    // send back a confirmation/success
    // also detect if current or new room

  // OPTIONS

  // DEFAULT
    // send some type of error code

};

exports.requestHandler = requestHandler;
