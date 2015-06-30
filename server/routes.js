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
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var moment = require('moment');

var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

var API_VERSION = "1.0";
var API_URL = "https://twocentz-svc-stage.herokuapp.com/" + API_VERSION + "/";

var _ = require('lodash');
var spMiddleware = stormpathExpressSdk.createMiddleware();

module.exports = function(app) {

   //attaching stormpath middleware
  spMiddleware.attachDefaults(app);

  var showSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    airsDayOfWeek: String,
    airsTime: String,
    firstAired: Date,
    genre: [String],
    network: String,
    overview: String,
    rating: Number,
    ratingCount: Number,
    status: String,
    poster: String,
    subscribers: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    episodes: [{
        season: Number,
        episodeNumber: Number,
        episodeName: String,
        firstAired: Date,
        overview: String
    }]
  });

  var userSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: String,
    facebook: {
      id: String,
      email: String
    },
    google: {
      id: String,
      email: String
    }
  });

  userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  });

  userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };

  var User = mongoose.model('User', userSchema);
  var Show = mongoose.model('Show', showSchema);

  mongoose.connect('mongodb://admin:password@ds049161.mongolab.com:49161/campaign-yo');

  app.get('/api/topics',  function(req, res, next) {
    request({
      url: API_URL + "topics",
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    }, function(error, response, body) {
      console.log(body);
      res.status(200).json(JSON.parse(body));
    });
  });

  app.get('/api/topics/:topic_id',  function(req, res, next) {
    request({
      url: API_URL + "topics" + "/" + req.params.topic_id,
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    }, function(error, response, body) {
      console.log(body);
      res.status(200).json(JSON.parse(body));
    });
  });

  app.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
  });

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
  });

};
