var express = require('express');
var spark = require('sparknode');
var passport = require('./lib/auth').passport;
var routes = require('./lib/routes');
var PORT = process.env.PORT || 3000;


var app = express();
app.use(passport.initialize());
var server = require('http').Server(app);

server.listen(PORT, function(){
  console.log('server listening on port', PORT);
});

app.get('/', passport.authenticate('google', {
  accessType: 'offline',
  approvalPrompt: 'force',
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
}), routes.home);

app.get('/login-error', routes.loginError);

app.get('/oauth2callback',
  passport.authenticate('google', { failureRedirect: '/login-error'}),
  routes.oauth
);

app.get('/:userButtonId/event', routes.getNextCalendarEvent);


var core = new spark.Core(
  process.env.SPARK_ACCESS_TOKEN,
  process.env.SPARK_CORE_ID,
  {}
);

core.on('find-user', function(data){
  console.log(data);
});

core.on('error', function(err){
  console.log(err);
});
