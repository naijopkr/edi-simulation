var http = require('http');

function ediApi(opts, callback) {
  var options = {}
  var resData;
  
  for (prop in opts) {
    if (prop) {
      options[prop] = opts[prop];
    }
  }

  var postData = JSON.stringify(opts.data || {});

  options.headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
  };
  
  var req = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      if (callback) {
        callback(JSON.parse(chunk));
      }
    });
  });
  
  req.on('error', err => {
    console.error(`Problem with request: ${err.message}`);
  })
  
  req.write(postData);
  req.end();
}

module.exports = ediApi;