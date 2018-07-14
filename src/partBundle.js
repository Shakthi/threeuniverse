//Sole purpose of this file for now is  reloading  build on one of part file changes

var req = require.context('./universe_parts', true, /\.js$/);
req.keys().forEach(req);