/**
 * Main application routes
 */

'use strict';
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var _ = require('lodash');
var stormpath = require('express-stormpath');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var moment = require('moment');

var async = require('async');
var request = require('request');
var rp = require('request-promise');
var xml2js = require('xml2js');

var API_VERSION = "1.0";
var API_URL = "https://twocentz-svc-stage.herokuapp.com/" + API_VERSION + "/";

function geUserID(req){
  return req.user.href.slice(req.user.href.lastIndexOf("/")+1);
}

function getUserName(req){
  return req.user.username;
}

function validateEntry(text){

  var error = false;
  // check that entry has two words and each word is max 20 letters
  var entry = _.words(_.trim(text), /[^, ]+/g);
  if(entry.length > 2){
    error = "only two words allowed";
  }
  if(_.some(entry, function(n){ return n.length > 20;})){
    error = "max length per word is 20";
  }
  if(error){
    return res.status(400).send({'error': error, 'status': 400});
  }
  return entry;
}

module.exports = function(app) {
  app.get('/api/email', stormpath.loginRequired, function (req, res) {
    req.user.givenName = 'Randall';
    req.user.username="blah";
    req.user.save(function (err) {
      if (err) {
        console.log("ERROR");
        return res.status(400).end('Oops!  There was an error: ' + err.userMessage);
        next();
      }else{
        console.log("NAME CHANGED");
        return res.end('Name was changed!');
        next();
      }
    });
  });

  app.get('/api/topics',  function(req, res, next) {
    rp(API_URL + "topics" + "/movies/")
      .then(function(resp){
        res.status(200).json(JSON.parse(resp));
      })
      .catch(function(error){
        res.status(404).json({error:"failed to get topics"});
        console.error(error);
      })
  });

  app.get('/api/user/entries/:topicId?', stormpath.loginRequired, function(req, res, next) {
    var full_URL;
    if(req.params.topicId){
      full_URL = API_URL + "user/" +  geUserID(req) + "/entries?topicId=" + req.params.topicId;
    } else{
      full_URL = API_URL + "user/" + geUserID(req) + "/entries/";
    }

    rp(full_URL)
      .then(function(resp){
        res.status(200).json(JSON.parse(resp));
      })
      .catch(function(error){
        res.status(404).json({error:"failed to get user entries for topicId: " + req.params.topicId});
        console.error(error);
      })
  });

  app.get('/api/movies/s/:slug',  function(req, res, next) {
    request({
      url: API_URL + "topics" + "/movies/" + "s" + "/" + req.params.slug,
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    }, function(error, response, body) {
      if(body){
        res.status(200).json(JSON.parse(body));
      }else{
        res.status(404).json({error:"movie not found"});
        console.error("movie not found");
      }
    });
  });

  app.get('/api/movies/entries/:id',  function(req, res, next) {
    request({
      url: API_URL + "topics" + "/movies/" + req.params.id + "/entries",
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    }, function(error, response, body) {
      res.status(200).json(JSON.parse(body));
    });
  });

  app.post('/api/entries/movies', stormpath.loginRequired,  function(req, res, next) {
    var entry, error;


    if(req.body.text){

      entry = validateEntry(req.body.text, res);
      var formObj = {
        text: entry.join(" "),
        topicId: req.body.topicId,
        userId: geUserID(req)
      }

      var options = {
          uri : API_URL + "entries/movies",
          method : 'POST',
          json: true,
          body: formObj
      };

      rp(options)
          .then(function(resp){
            res.status(200).json(resp);
          })
          .catch(function(err){
            res.status(400).send({'error': 'server error', 'status': 400})
            console.error(err);
          });


    } else {
      return res.status(400).send({'error': 'twocentz missing', 'status': 400});
    }

  });

  app.post('/api/entries/usertopics', stormpath.loginRequired,  function(req, res, next) {

    var entry, error;
    if(req.body.text){

      entry = validateEntry(req.body.text);

      var formObj = {
        text: entry.join(" "),
        topicId: req.body.topicId,
        userId: geUserID(req)
      }

      var options = {
          uri : API_URL + "entries/usertopics",
          method : 'POST',
          json: true,
          body: formObj
      };

      rp(options)
          .then(function(resp){
            res.status(200).json(resp);
          })
          .catch(function(err){
            res.status(400).send({'error': 'server error', 'status': 400})
            console.error(err);
          });


    } else {
      return res.status(400).send({'error': 'twocentz missing', 'status': 400});
    }

  });

  app.get('/api/topics/users/:userName/:slug', function(req, res, next) {
    request({
      url: API_URL + "topics" + "/users/" + req.params.userName + "?" +"slug=" + req.params.slug,
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    }, function(error, response, body) {
      if(body){
        res.status(200).json(JSON.parse(body));
      }else{
        res.status(404).json({error:"topic not found"});
        console.error("topic not found");
      }
    });
  });

  app.get('/api/usertopics',  stormpath.loginRequired, function(req, res, next) {
    request({
      url: API_URL + "topics" + "/users/" + getUserName(req),
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    }, function(error, response, body) {
      if(body){
        res.status(200).json(JSON.parse(body));
      }else{
        res.status(404).json({error:"Topics not found"});
        console.error("topics not found");
      }
    });
  });

  app.post('/api/topics/users', stormpath.loginRequired,  function(req, res, next) {
    var error;
    if(req.body.title){

      if(_.trim(req.body.title) < 3){
        error = "title should be at least 3 letter long";
      }
      if(error){
        return res.status(400).send({'error': error, 'status': 400});
      }


      var formObj = {
        title: _.trim(req.body.title),
        description: req.body.description,
        props: req.body.props,
        mediaFiles: req.body.mediaFiles,
        userId: geUserID(req),
        userName: getUserName(req)
      }

      var options = {
        uri : API_URL + "topics/users",
        method : 'POST',
        json: true,
        body: formObj
      };

      rp(options)
          .then(function(resp){
            res.status(200).json(resp);
          })
          .catch(function(err){
            res.status(400).send({'error': 'server error', 'status': 400})
            console.error(err);
          });


    } else {
      return res.status(400).send({'error': 'title missing', 'status': 400});
    }

  });

  /*
   * Ensure this route is last.
   */
   app.all('/*', function(req, res){
     res.sendFile('index.html',  { root: path.join( path.normalize(__dirname + '/..'), 'dist') });
   });

  // app.get('*', function(req, res) {
  //   res.redirect('/#' + req.originalUrl);
  // });

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({ message: err.message });
  });

};
