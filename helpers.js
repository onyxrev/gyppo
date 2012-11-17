var querystring = require('querystring');

var helpers = {
    // from http://stackoverflow.com/a/12022746/365993
    postReq: function(req, res, callback) {
        var queryData = "";
        if(typeof callback !== 'function') return null;

        if(req.method == 'POST') {
            req.on('data', function(data) {
                queryData += data;

                // are we being flooded?
                if(queryData.length > 1e6) {
                    queryData = "";

                    // bug off
                    res.writeHead(413, {'Content-Type': 'text/plain'});
                    req.connection.destroy();
                }
            });

            req.on('end', function() {
                res.post = querystring.parse(queryData);
                helpers.collateMetaData(res);
                helpers.validateMessage(req, res, callback);
            });

        } else {
            // no method support
            res.writeHead(405, {'Content-Type': 'text/plain'});
            res.end();
        }
    },

    validateMessage: function(req, res, callback){
        if (!!res.post.message && !!res.post.message.trim()) callback();

        // unprocessable / invalid
        res.writeHead(422, {'Content-Type': 'text/plain'});
        res.end();
    },

    // turns nested stringified params "meta_data[foo]": "bar" into
    // meta_data: {foo: "bar"}
    collateMetaData: function(res){
        var subkey, key_extractor = /^meta_data\[(.+)\]$/
        res.post.meta_data = Object.keys(res.post).reduce(function(obj, key){
            if (subkey = key.match(key_extractor))
                obj[subkey[1]] = res.post[key];

            return obj;
        }, {});
    }
}

module.exports = helpers;
