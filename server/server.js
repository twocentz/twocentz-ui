var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var Logger = require('le_node');
var stormpath = require('express-stormpath');
var compress = require('compression');
var uuid = require('node-uuid');
var helpers = require('express-stormpath/lib/helpers');

var log = new Logger({
  token:'28364857-ccad-34ad-b844-44bb3a088cf1',
  console: true
});

var env = process.env.NODE_ENV || 'development';
var app = express();

if (env === 'production') {
  app.get('*',function(req,res,next){
    if (req.headers['x-forwarded-proto'] !== 'https') {
      log.info('server-'+ env +': redirect to https');
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
  })
}

//prerender redirect for crawlers
app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_APP_TOKEN));

// express serving files
app.use(express.static(path.join( path.normalize(__dirname + '/..'), 'dist')));

app.set('views', __dirname+'/views');

app.set('port', process.env.PORT || 3000);
app.use(compress());
app.use(cookieParser());
app.use(logger('dev'));

app.use(stormpath.init(app, {
  website: true,
  expand: {
    customData: true,
    providerData: true
  },
  web: {
  login: {
    view: path.join(__dirname,'views','login.ejs') // My custom login view
  },
  register: {
   autoLogin: true,
   nextUri: '/',
   fields: {
      username: {
        autoLogin: true,
        enabled: true,
        required: true,
        placeholder: 'Your display name in the app'
      }
   }
  }
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'jade');

function unify(req, res, next) {
  var application = app.get('stormpathApplication');

  if (!req.user) {
    return next();
  }

  req.user.getProviderData(function(err, data) {
    if (err) {
      return next(err);
    }

    if (data.providerId === 'stormpath') {
      return next();
    }

    // If this user was literally logged in on this SAME request, we cannot do
    // anything, so just continue onwards and force a page reload.
    if (res.headerSent) {
      return res.redirect(req.originalUrl);
    }

    // We found a social user, so we'll attempt to look up their Cloud
    // directory account.
    application.getAccounts({ email: req.user.email }, function(err, accounts) {
      if (err) {
        return next(err);
      }

      var cloudAccount;
      accounts.each(function(account, cb) {
        account.getProviderData(function(err, data) {
          if (err) {
            return cb(err);
          }

          if (data.providerId === 'stormpath') {
            cloudAccount = account;
          }

          cb();
        });
      }, function(err) {
        if (err) {
          return next(err);
        }

        // Swap session.
        if (cloudAccount) {
          var socialUser = req.user;

          res.locals.user = cloudAccount;
          req.user = cloudAccount;

          // save customData href for each social provider here if acct exists
          saveProviderData(socialUser, req.user);

          helpers.createIdSiteSession(req.user, req, res);

          return next();
        }

        // If we get here, it means we need to create a new Cloud account for
        // this social user -- so, let's do it!
        application.createAccount({
          status: req.user.status,
          givenName: req.user.givenName,
          surname: req.user.surname,
          middleName: req.user.middleName,
          email: req.user.email,
          password: uuid.v4() + uuid.v4().toUpperCase()
        }, { registrationWorkflowEnabled: false }, function(err, account) {
          if (err) {
            return next(err);
          }

          var socialUser = req.user;

          res.locals.user = account;
          req.user = account;

          var milliTime = '' + new Date().getTime();
          req.user.username = req.user.givenName.toLowerCase() + "_" + milliTime.slice(milliTime.length-4, milliTime.length);

          // save customData href for each social provider here if acct exists
          saveProviderData(socialUser, req.user);

          helpers.createIdSiteSession(account, req, res);

          next();
        });
      });
    });
  });
};

function saveProviderData(socialUser, cloudUser) {
  if(socialUser.providerData.providerId === 'facebook') {
    var fbProvider = {
      'href': socialUser.href,
      'createdAt': socialUser.providerData.createdAt,
      'modifiedAt': socialUser.providerData.modifiedAt,
      'accessToken': socialUser.providerData.accessToken,
      'providerId': socialUser.providerData.providerId
    };

    cloudUser.customData['providerLinks'] = [];
    cloudUser.customData['providerLinks'].push(fbProvider);
    cloudUser.save();
  }
}

app.use(unify);

require('./routes')(app);

app.on('stormpath.ready', function () {
  app.listen(app.get('port'), function() {
    log.info('server-'+ env +': Express server listening on port ' + app.get('port'));
  });
});
