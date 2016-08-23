var http = require('http');
var https = require('https');
//var https = require('spdy');
// NOTE: you could use the old https module if for some reason you don't want to support modern browsers

var LEX = require('letsencrypt-express');


function redirectHttp() {
  http.createServer(LEX.createAcmeResponder(lex, function redirectHttps(req, res) {
    res.setHeader('Location', 'https://' + req.headers.host + req.url);
    res.statusCode = 302; // use 307 if you want to redirect requests with POST, DELETE or PUT action.
    res.end('<!-- Hello Developer Person! Please use HTTPS instead -->');
  })).listen(80);
}

function serveHttps() {
  var app = require('express')();

  app.use('/', function (req, res) {
    res.end('Hello!');
  });

  https.createServer(lex.httpsOptions, LEX.createAcmeResponder(lex, app)).listen(443);
}

redirectHttp();
serveHttps();
