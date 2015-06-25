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


var _ = require('lodash');
var spMiddleware = stormpathExpressSdk.createMiddleware();

module.exports = function(app) {

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

  function ensureAuthenticated(req, res, next) {
    if (req.headers.authorization) {
      var token = req.headers.authorization.split(' ')[1];
      try {
        var decoded = jwt.decode(token, tokenSecret);
        if (decoded.exp <= Date.now()) {
          res.send(400, 'Access token has expired');
        } else {
          req.user = decoded.user;
          return next();
        }
      } catch (err) {
        return res.send(500, 'Error parsing token');
      }
    } else {
      return res.send(401);
    }
  }

  function createJwtToken(user) {
    var payload = {
      user: user,
      iat: new Date().getTime(),
      exp: moment().add('days', 7).valueOf()
    };
    return jwt.encode(payload, tokenSecret);
  }

  //attaching stormpath middleware
  spMiddleware.attachDefaults(app);

  // Insert routes below
  app.post('/auth/signup', function(req, res, next) {
    var user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });

  app.post('/auth/login', function(req, res, next) {
    User.findOne({ email: req.body.email }, function(err, user) {
      if (!user) return res.send(401, 'User does not exist');
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) return res.send(401, 'Invalid email and/or password');
        var token = createJwtToken(user);
        res.send({ token: token });
      });
    });
  });

  app.post('/auth/facebook', function(req, res, next) {
    var profile = req.body.profile;
    var signedRequest = req.body.signedRequest;
    var encodedSignature = signedRequest.split('.')[0];
    var payload = signedRequest.split('.')[1];

    var appSecret = '298fb6c080fda239b809ae418bf49700';

    var expectedSignature = crypto.createHmac('sha256', appSecret).update(payload).digest('base64');
    expectedSignature = expectedSignature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    if (encodedSignature !== expectedSignature) {
      return res.send(400, 'Invalid Request Signature');
    }

    User.findOne({ facebook: profile.id }, function(err, existingUser) {
      if (existingUser) {
        var token = createJwtToken(existingUser);
        return res.send(token);
      }
      var user = new User({
        name: profile.name,
        facebook: {
          id: profile.id,
          email: profile.email
        }
      });
      user.save(function(err) {
        if (err) return next(err);
        var token = createJwtToken(user);
        res.send(token);
      });
    });
  });

  app.post('/auth/google', function(req, res, next) {
    var profile = req.body.profile;
    User.findOne({ google: profile.id }, function(err, existingUser) {
      if (existingUser) {
        var token = createJwtToken(existingUser);
        return res.send(token);
      }
      var user = new User({
        name: profile.displayName,
        google: {
          id: profile.id,
          email: profile.emails[0].value
        }
      });
      user.save(function(err) {
        if (err) return next(err);
        var token = createJwtToken(user);
        res.send(token);
      });
    });
  });

  app.get('/api/users', function(req, res, next) {
    if (!req.query.email) {
      return res.send(400, { message: 'Email parameter is required.' });
    }

    User.findOne({ email: req.query.email }, function(err, user) {
      if (err) return next(err);
      res.send({ available: !user });
    });
  });



  app.get('/api/shows',  function(req, res, next) {
    var query = Show.find();
    if (req.query.genre) {
      query.where({ genre: req.query.genre });
    } else if (req.query.alphabet) {
      query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
    } else {
      query.limit(12);
    }
    query.exec(function(err, shows) {
      if (err) return next(err);
      res.send(shows);
    });
  });

  //app.get('/api/shows/:id', spMiddleware.authenticate, function(req, res, next) {
  app.get('/api/shows/:id',  function(req, res, next) {
    Show.findById(req.params.id, function(err, show) {
      if (err) return next(err);
      res.send(show);
    });
  });

  app.post('/api/shows', function (req, res, next) {
    var seriesName = req.body.showName
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '');
    var apiKey = '9EF1D1E7D28FDA0B';
    var parser = xml2js.Parser({
      explicitArray: false,
      normalizeTags: true
    });

    async.waterfall([
      function (callback) {
        request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function (error, response, body) {
          if (error) return next(error);
          parser.parseString(body, function (err, result) {
            if (!result.data.series) {
              return res.send(400, { message: req.body.showName + ' was not found.' });
            }
            var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
            callback(err, seriesId);
          });
        });
      },
      function (seriesId, callback) {
        request.get('http://thetvdb.com/api/' + apiKey + '/series/' + seriesId + '/all/en.xml', function (error, response, body) {
          if (error) return next(error);
          parser.parseString(body, function (err, result) {
            var series = result.data.series;
            var episodes = result.data.episode;
            var show = new Show({
              _id: series.id,
              name: series.seriesname,
              airsDayOfWeek: series.airs_dayofweek,
              airsTime: series.airs_time,
              firstAired: series.firstaired,
              genre: series.genre.split('|').filter(Boolean),
              network: series.network,
              overview: series.overview,
              rating: series.rating,
              ratingCount: series.ratingcount,
              runtime: series.runtime,
              status: series.status,
              poster: series.poster,
              episodes: []
            });
            _.each(episodes, function (episode) {
              show.episodes.push({
                season: episode.seasonnumber,
                episodeNumber: episode.episodenumber,
                episodeName: episode.episodename,
                firstAired: episode.firstaired,
                overview: episode.overview
              });
            });
            callback(err, show);
          });
        });
      },
      function (show, callback) {
        var url = 'http://thetvdb.com/banners/' + show.poster;
        request({ url: url, encoding: null }, function (error, response, body) {
          show.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
          callback(error, show);
        });
      }
    ], function (err, show) {
      if (err) return next(err);
      show.save(function (err) {
        if (err) {
          if (err.code == 11000) {
            return res.send(409, { message: show.name + ' already exists.' });
          }
          return next(err);
        }
        var alertDate = Date.create('Next ' + show.airsDayOfWeek + ' at ' + show.airsTime).rewind({ hour: 2});
        //agenda.schedule(alertDate, 'send email alert', show.name).repeatEvery('1 week');
        res.send(200);
      });
    });
  });

  app.post('/api/subscribe', ensureAuthenticated, function(req, res, next) {
    Show.findById(req.body.showId, function(err, show) {
      if (err) return next(err);
      show.subscribers.push(req.user._id);
      show.save(function(err) {
        if (err) return next(err);
        res.send(200);
      });
    });
  });

  app.post('/api/unsubscribe', ensureAuthenticated, function(req, res, next) {
    Show.findById(req.body.showId, function(err, show) {
      if (err) return next(err);
      var index = show.subscribers.indexOf(req.user._id);
      show.subscribers.splice(index, 1);
      show.save(function(err) {
        if (err) return next(err);
        res.send(200);
      });
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
