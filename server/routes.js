/**
 * Main application routes
 */

'use strict';
var stormpathExpressSdk = require('stormpath-sdk-express');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var moment = require('moment');

var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

var API_VERSION = "1.0";
var API_URL = "https://twocentz-svc-stage.herokuapp.com/" + API_VERSION + "/";

var spMiddleware = stormpathExpressSdk.createMiddleware();

module.exports = function(app) {

   //attaching stormpath middleware
  spMiddleware.attachDefaults(app);

  app.get('/api/topics',  function(req, res, next) {
    request({
      url: API_URL + "topics",
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    }, function(error, response, body) {
      res.status(200).json(JSON.parse(body)["content"]);
    });
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
