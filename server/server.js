var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var Logger = require('le_node');
var stormpath = require('express-stormpath');
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

app.set('port', process.env.PORT || 3000);
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(stormpath.init(app, {
  // Optional configuration options.
  website: true,
  enableFacebook: true,
  social: {
    facebook: {
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET
    },
  },
  web: {
    spaRoot: path.join(__dirname, '../dist', 'index.html')
  }
}));

// express serving files
app.use(express.static(path.join( path.normalize(__dirname + '/..'), 'dist')));

// console.log("***** App Path *********" + path.join( path.normalize(__dirname + '/..'), 'dist'));
// console.log("***** ENV *********" + process.env.STORMPATH_API_KEY_ID);



require('./routes')(app);

app.on('stormpath.ready', function() {
  app.listen(3000, function() {
    console.log('Stormpath SPA Development Server listening at http://localhost:3000');
  });
});
