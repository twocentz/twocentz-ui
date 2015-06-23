var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join( path.normalize(__dirname + '/..'), 'public')));

console.log("***** App Path *********" + path.join( path.normalize(__dirname + '/..'), 'public'));


require('./routes')(app);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
