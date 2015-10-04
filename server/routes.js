/**
 * Main application routes
 */

'use strict';
var stormpathExpressSdk = require('stormpath-sdk-express');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var _ = require('lodash');

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

var spMiddleware = stormpathExpressSdk.createMiddleware();

module.exports = function(app) {

   //attaching stormpath middleware
  spMiddleware.attachDefaults(app);

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

  app.get('/api/user',  function(req, res, next) {
    rp(API_URL + "user" + "/entries/")
      .then(function(resp){
        res.status(200).json(JSON.parse(resp));
      })
      .catch(function(error){
        res.status(404).json({error:"failed to get all user entries"});
        console.error(error);
      })
  });

  app.get('/api/user/entries/:topicId',  function(req, res, next) {
    rp(API_URL + "user" + "/entries/" + req.params.topicId)
      .then(function(resp){
        res.status(200).json(JSON.parse(resp));
      })
      .catch(function(error){
        res.status(404).json({error:"failed to user entries for topicId: " + req.params.topicId});
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

  app.post('/api/entries/movies', spMiddleware.authenticate,  function(req, res, next) {
    
    //console.log(req.user);
    var entry, error;
    if(req.body.text){

      // check that entry has two words and each word is max 20 letters
      entry = _.words(_.trim(req.body.text), /[^, ]+/g);
      if(entry.length > 2){
        error = "only two words allowed";
      }
      if(_.some(entry, function(n){ return n.length > 20;})){
        error = "max length per word is 20";
      }
      if(error){
        return res.status(400).send({'error': error, 'status': 400});
      }

      
      var formObj = {
        text: entry.join(" "),
        topicId: req.body.topicId,
        userId: req.user.href
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
          .catch(console.error);
      

    } else {
      return res.status(400).send({'error': 'twocentz missing', 'status': 400});
    }
    
  });

  /*
   * Ensure this route is last.
   */
  app.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
  });

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
  });

};
