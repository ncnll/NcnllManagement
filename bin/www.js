#!/usr/bin/env node
var debug = require('debug')('ncnll');
var app = require('../server');

app.set('port', process.env.PORT || 18088);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
