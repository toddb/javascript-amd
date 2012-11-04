/*
Copyright (c) 2010 Tim Caswell <tim@creationix.com>

Rewritten toddb@goneopen.com for Accept Headers and returning of data for a test server

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var sys = require('util');
var fs = require('fs');
var path = require('path');
var http = require('http');
var url_parse = require("url").parse;

// Used as a simple, convient 404 handler.
function notFound(req, res, message) {
  message = (message || "Not Found") + " : " + req.headers['accept'] + "\n";
  res.writeHead(404, {
    "Content-Type": "text/plain",
    "Content-Length": message.length
  });
  if (req.method !== "HEAD")
    res.write(message);
  res.end();
}

// Modifies req and res to call logger with a log line on each res.end
// Think of it as "middleware"
function logify(req, res, logger) {
  var end = res.end;
  res.end = function () {
    // Common Log Format (mostly)
    logger((req.socket && req.socket.remoteAddress) + " - - [" + (new Date()).toUTCString() + "]"
     + " \"" + req.method + " " + req.url
     + " HTTP/" + req.httpVersionMajor + "." + req.httpVersionMinor + "\" "
     + "Accept:" + req.headers['accept'] + " - "
     + res.statusCode + " - \""
     + (req.headers['referer'] || "") + "\" \"" + (req.headers["user-agent"] ? req.headers["user-agent"].split(' ')[0] : '') + "\"");
    return end.apply(this, arguments);
  }
  var writeHead = res.writeHead;
  res.writeHead = function (code) {
    res.statusCode = code;
    return writeHead.apply(this, arguments);
  }
}

exports.getServer = function getServer( opts ) {

  logger = opts.logger || sys.puts;
  basePath = opts.basePath || ".";
  encoding = 'utf8'

  var routes = [];

  // Adds a route the the current server
  function addRoute(method, pattern, accept, handler, format) {
    if (typeof pattern === 'string') {
      pattern = new RegExp("^" + pattern + "$");
    }
    
    if (typeof accept === 'string'){
      //accept = new RegExp( accept )
    }

    var route = {
      method: method,
      pattern: pattern,
      handler: handler,
      accept: accept
    };
    if (format !== undefined) {
      route.format = format;
    }
    routes.push(route);
  }

  // The four verbs are wrappers around addRoute
  function get(pattern, accept, handler) {
    return addRoute("GET", pattern, accept, handler);
  }
  function post(pattern, accept, handler, format) {
    return addRoute("POST", pattern, accept, handler, format);
  }
  function put(pattern, accept, handler, format) {
    return addRoute("PUT", pattern, accept, handler, format);
  }
  function del(pattern, accept, handler) {
    return addRoute("DELETE", pattern, accept, handler);
  }
  function head(pattern, accept, handler) {
    return addRoute("HEAD", accept, pattern, handler);
  }

 
  // Create the http server object
  var server = http.createServer(function (req, res) {

    // Enable logging on all requests using common-logger style
    logify(req, res, logger);

    var uri, path;

    // Performs an HTTP 302 redirect
    res.redirect = function redirect(location) {
      res.writeHead(302, {"Location": location});
      res.end();
    }

    // Performs an internal redirect
    res.innerRedirect = function innerRedirect(location) {
      logger("Internal Redirect: " + req.url + " -> " + location);
      req.url = location;
      doRoute();
    }
    
    function read( filename ){
      return fs.readFileSync(basePath + filename, encoding);
    }

    function simpleResponse(code, body, content_type, extra_headers) {
      res.writeHead(code, (extra_headers || []).concat(
                           [ ["Content-Type", content_type],
                             ["Content-Length", Buffer.byteLength(body, encoding)]
                           ]));
      if (req.method !== "HEAD")
        res.write(body, 'utf8');
      res.end();
    }

    res.text = function (code, body, extra_headers) {
      simpleResponse(code, body, "text/plain", extra_headers);;
    };

    res.html = function (code, body, extra_headers) {
      simpleResponse(code, read(body), "text/html", extra_headers);
    };

    res.json = function (code, json, extra_headers) {
      if (typeof json == 'string'){
        json = read(json);
      } else {
        json = JSON.stringify(json)
      }
      simpleResponse(code, json, "application/json", extra_headers);
    };

    res.created = function created(location, content_type) {
      res.writeHead(201, {
        Location: location,
        ETag: '',
        'Content-Type': content_type || 'application/json' });
      res.end();
    }

    res.notFound = function (message) {
      notFound(req, res, message);
    };

    res.onlyHead = function (code, extra_headers) {
      res.writeHead(code, (extra_headers || []).concat(
                           [["Content-Type", content_type]]));
      res.end();
    }
    
    res.successDeleteNoEntity = function () {
      res.writeHead(204);
      res.end();      
    }
    
    res.successDelete = function () {
      res.writeHead(200);
      res.end();      
    }
    
    // Is the given value a regular expression?
    function isRegExp(obj) {
      return toString.call(obj) == '[object RegExp]';
    };
    
    // A utility helper function to match a relationship type of media type string
    //
    // Match a link string if:
    //   a regular  expression is used
    //   the string is a special case wildcard string of '*'
    //   the string matches the link string
    //
    function matchHeader(linkString, matchString) {
      //matchString = new RegExp(matchString)
      return ( isRegExp(matchString) && linkString.match(matchString)) || 
           matchString === '*' ||
                linkString === matchString;
    }

    function doRoute() {
      
      uri = url_parse(req.url);
      path = uri.pathname;
      
      // iterate through routes
      for (var i = 0, l = routes.length; i < l; i += 1) {
        var route = routes[i];
        
        //check verb
        if (req.method === route.method) {         

          //check accept headers
          if (matchHeader(req.headers['accept'], route.accept)) {

            //check url
            var match = path.match(route.pattern);
            if (match && match[0].length > 0) {
              match.shift();
              match = match.map(function (part) {
                return part ? unescape(part) : part;
              });
              match.unshift(res);
              match.unshift(req);

              req.setEncoding(encoding);
              
              route.handler.apply(null, match);
              
              return

            }
          }
        }
      }
      
      notFound(req, res);

    }
    
    doRoute()
  });


  function listen(port, host, callback) {
    port = port || 8080;

    if (typeof host === 'undefined' || host == '*')
      host = null;

    server.listen(port, host, callback);

    if (typeof port === 'number') {
      logger("node-router server instance at http://" + (host || '*') + ":" + port + "/");
    } else {
      logger("node-router server instance at unix:" + port);
    }
  }

  function end() {
    return server.end();
  }

  // Return a handle to the public facing functions from this closure as the
  // server object.
  return {
    get: get,
    post: post,
    put: put,
    del: del,
    listen: listen,
    end: end
  };
}


exports.staticDirHandler = function(root, prefix) {
  function loadResponseData(req, res, filename, callback) {
    var content_type = mime.getMime(filename);
    var encoding = (content_type.slice(0,4) === "text" ? "utf8" : "binary");

    fs.readFile(filename, encoding, function(err, data) {
      if(err) {
        sys.puts("Cannot find file: " + filename)
        notFound(req, res, "Cannot find file: " + filename);
        return;
      }
      var headers = [ [ "Content-Type"   , content_type ],
                      [ "Content-Length" , data.length ],
                      [ "Cache-Control"  , "public" ]
                    ];
      callback(headers, data, encoding);
    });
  }

  return function (req, res) {
    // trim off any query/anchor stuff
    var filename = req.url.replace(/[\?|#].*$/, '');
    if (prefix) filename = filename.replace(new RegExp('^'+prefix), '');
    // make sure nobody can explore our local filesystem
    filename = path.join(root, filename.replace(/\.\.+/g, '.'));
    if (filename == root) filename = path.join(root, 'index.html');
    loadResponseData(req, res, filename, function(headers, body, encoding) {
      res.writeHead(200, headers);
      if (req.method !== "HEAD")
        res.write(body, encoding);
      res.end();
    });
  };
};


// Mini mime module for static file serving
var DEFAULT_MIME = 'application/octet-stream';
var mime = exports.mime = {

  getMime: function getMime(path) {
    var index = path.lastIndexOf(".");
    if (index < 0) {
      return DEFAULT_MIME;
    }
    return mime.TYPES[path.substring(index).toLowerCase()] || DEFAULT_MIME;
  },

  TYPES : { ".3gp"   : "video/3gpp",
            ".a"     : "application/octet-stream",
            ".ai"    : "application/postscript",
            ".aif"   : "audio/x-aiff",
            ".aiff"  : "audio/x-aiff",
            ".asc"   : "application/pgp-signature",
            ".asf"   : "video/x-ms-asf",
            ".asm"   : "text/x-asm",
            ".asx"   : "video/x-ms-asf",
            ".atom"  : "application/atom+xml",
            ".au"    : "audio/basic",
            ".avi"   : "video/x-msvideo",
            ".bat"   : "application/x-msdownload",
            ".bin"   : "application/octet-stream",
            ".bmp"   : "image/bmp",
            ".bz2"   : "application/x-bzip2",
            ".c"     : "text/x-c",
            ".cab"   : "application/vnd.ms-cab-compressed",
            ".cc"    : "text/x-c",
            ".chm"   : "application/vnd.ms-htmlhelp",
            ".class"   : "application/octet-stream",
            ".com"   : "application/x-msdownload",
            ".conf"  : "text/plain",
            ".cpp"   : "text/x-c",
            ".crt"   : "application/x-x509-ca-cert",
            ".css"   : "text/css",
            ".csv"   : "text/csv",
            ".cxx"   : "text/x-c",
            ".deb"   : "application/x-debian-package",
            ".der"   : "application/x-x509-ca-cert",
            ".diff"  : "text/x-diff",
            ".djv"   : "image/vnd.djvu",
            ".djvu"  : "image/vnd.djvu",
            ".dll"   : "application/x-msdownload",
            ".dmg"   : "application/octet-stream",
            ".doc"   : "application/msword",
            ".dot"   : "application/msword",
            ".dtd"   : "application/xml-dtd",
            ".dvi"   : "application/x-dvi",
            ".ear"   : "application/java-archive",
            ".eml"   : "message/rfc822",
            ".eps"   : "application/postscript",
            ".exe"   : "application/x-msdownload",
            ".f"     : "text/x-fortran",
            ".f77"   : "text/x-fortran",
            ".f90"   : "text/x-fortran",
            ".flv"   : "video/x-flv",
            ".for"   : "text/x-fortran",
            ".gem"   : "application/octet-stream",
            ".gemspec" : "text/x-script.ruby",
            ".gif"   : "image/gif",
            ".gz"    : "application/x-gzip",
            ".h"     : "text/x-c",
            ".hh"    : "text/x-c",
            ".htm"   : "text/html",
            ".html"  : "text/html",
            ".ico"   : "image/vnd.microsoft.icon",
            ".ics"   : "text/calendar",
            ".ifb"   : "text/calendar",
            ".iso"   : "application/octet-stream",
            ".jar"   : "application/java-archive",
            ".java"  : "text/x-java-source",
            ".jnlp"  : "application/x-java-jnlp-file",
            ".jpeg"  : "image/jpeg",
            ".jpg"   : "image/jpeg",
            ".js"    : "application/javascript",
            ".json"  : "application/json",
            ".log"   : "text/plain",
            ".m3u"   : "audio/x-mpegurl",
            ".m4v"   : "video/mp4",
            ".man"   : "text/troff",
            ".mathml"  : "application/mathml+xml",
            ".mbox"  : "application/mbox",
            ".mdoc"  : "text/troff",
            ".me"    : "text/troff",
            ".mid"   : "audio/midi",
            ".midi"  : "audio/midi",
            ".mime"  : "message/rfc822",
            ".mml"   : "application/mathml+xml",
            ".mng"   : "video/x-mng",
            ".mov"   : "video/quicktime",
            ".mp3"   : "audio/mpeg",
            ".mp4"   : "video/mp4",
            ".mp4v"  : "video/mp4",
            ".mpeg"  : "video/mpeg",
            ".mpg"   : "video/mpeg",
            ".ms"    : "text/troff",
            ".msi"   : "application/x-msdownload",
            ".odp"   : "application/vnd.oasis.opendocument.presentation",
            ".ods"   : "application/vnd.oasis.opendocument.spreadsheet",
            ".odt"   : "application/vnd.oasis.opendocument.text",
            ".ogg"   : "application/ogg",
            ".p"     : "text/x-pascal",
            ".pas"   : "text/x-pascal",
            ".pbm"   : "image/x-portable-bitmap",
            ".pdf"   : "application/pdf",
            ".pem"   : "application/x-x509-ca-cert",
            ".pgm"   : "image/x-portable-graymap",
            ".pgp"   : "application/pgp-encrypted",
            ".pkg"   : "application/octet-stream",
            ".pl"    : "text/x-script.perl",
            ".pm"    : "text/x-script.perl-module",
            ".png"   : "image/png",
            ".pnm"   : "image/x-portable-anymap",
            ".ppm"   : "image/x-portable-pixmap",
            ".pps"   : "application/vnd.ms-powerpoint",
            ".ppt"   : "application/vnd.ms-powerpoint",
            ".ps"    : "application/postscript",
            ".psd"   : "image/vnd.adobe.photoshop",
            ".py"    : "text/x-script.python",
            ".qt"    : "video/quicktime",
            ".ra"    : "audio/x-pn-realaudio",
            ".rake"  : "text/x-script.ruby",
            ".ram"   : "audio/x-pn-realaudio",
            ".rar"   : "application/x-rar-compressed",
            ".rb"    : "text/x-script.ruby",
            ".rdf"   : "application/rdf+xml",
            ".roff"  : "text/troff",
            ".rpm"   : "application/x-redhat-package-manager",
            ".rss"   : "application/rss+xml",
            ".rtf"   : "application/rtf",
            ".ru"    : "text/x-script.ruby",
            ".s"     : "text/x-asm",
            ".sgm"   : "text/sgml",
            ".sgml"  : "text/sgml",
            ".sh"    : "application/x-sh",
            ".sig"   : "application/pgp-signature",
            ".snd"   : "audio/basic",
            ".so"    : "application/octet-stream",
            ".svg"   : "image/svg+xml",
            ".svgz"  : "image/svg+xml",
            ".swf"   : "application/x-shockwave-flash",
            ".t"     : "text/troff",
            ".tar"   : "application/x-tar",
            ".tbz"   : "application/x-bzip-compressed-tar",
            ".tci"   : "application/x-topcloud",
            ".tcl"   : "application/x-tcl",
            ".tex"   : "application/x-tex",
            ".texi"  : "application/x-texinfo",
            ".texinfo" : "application/x-texinfo",
            ".text"  : "text/plain",
            ".tif"   : "image/tiff",
            ".tiff"  : "image/tiff",
            ".torrent" : "application/x-bittorrent",
            ".tr"    : "text/troff",
            ".ttf"   : "application/x-font-ttf",
            ".txt"   : "text/plain",
            ".vcf"   : "text/x-vcard",
            ".vcs"   : "text/x-vcalendar",
            ".vrml"  : "model/vrml",
            ".war"   : "application/java-archive",
            ".wav"   : "audio/x-wav",
            ".wma"   : "audio/x-ms-wma",
            ".wmv"   : "video/x-ms-wmv",
            ".wmx"   : "video/x-ms-wmx",
            ".wrl"   : "model/vrml",
            ".wsdl"  : "application/wsdl+xml",
            ".xbm"   : "image/x-xbitmap",
            ".xhtml"   : "application/xhtml+xml",
            ".xls"   : "application/vnd.ms-excel",
            ".xml"   : "application/xml",
            ".xpm"   : "image/x-xpixmap",
            ".xsl"   : "application/xml",
            ".xslt"  : "application/xslt+xml",
            ".yaml"  : "text/yaml",
            ".yml"   : "text/yaml",
            ".zip"   : "application/zip"
          }
};
