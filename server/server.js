var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join( path.normalize(__dirname + '/..'), 'dist')));

// console.log("***** App Path *********" + path.join( path.normalize(__dirname + '/..'), 'dist'));
// console.log("***** ENV *********" + process.env.STORMPATH_API_KEY_ID);


require('./routes')(app);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
