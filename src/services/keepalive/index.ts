

import http from 'http'

function startKeepAlive() {
    setInterval(function () {
        var options = {
            host: process.env.DOMAIN,
            port: 80,
            path: '/api',
            headers: {
                client_id: process.env.HELIX_CLIENT_ID
            }
        };
        http.get(options, function (res) {
            res.on('data', function (chunk) {
                try {
                    // optional logging... disable after it's working
                    console.log("HEROKU RESPONSE: " + chunk);
                } catch (err) {
                    console.log(err);
                }
            });
        }).on('error', function (err) {
            console.log("Error: " + err.message);
        });
    }, 20 * 60 * 1000); // load every 20 minutes
}

startKeepAlive()