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
  },
  'POST' : function(req, res) {
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'plain/text';
    var parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname === '/classes/messages') {
      res.writeHead(201, headers);

      // var body = [];
      // req.on('data', (chunk) => {
      //   body.push(chunk);
      // }).on('end', () => {
      //   body = Buffer.concat(body).toString();
      // });
      var addedLobby = null;
      var data = '';
      req.on('data', function(chunk) {
        data += chunk;
      });
      req.on('end', function() {
        var message = JSON.parse(data);
        if (!message.roomname) {
          message.roomname = 'lobby';
          addedLobby = true;
        }
        console.log('fully chunked data ------>', data);
        fakeData.fakeMessages.results.unshift(message);
        //console.log('fake data ------------>', fakeData.fakeMessages.results[0]);
      });

      res.end(addedLobby ? 'No roomname was provided.  Your message has been assigned to the room "lobby"': 'successful post');
    } else {
      // check rest of headers
      res.writeHead(404, headers);
      res.end('bad request');
    }
  },

  'OPTIONS': function(req, res) {
    res.writeHead(200, defaultCorsHeaders);
    res.end('options were successful');
  },

  'PUT': function(req, res) {
    res.writeHead(405, defaultCorsHeaders);
    res.end('PUT requests are not allowed');
  },

  'DELETE': function(req, res) {
    res.writeHead(405, defaultCorsHeaders);
    res.end('DELETE requests are not allowed');
  },
};

exports.requestHandler = requestHandler;
