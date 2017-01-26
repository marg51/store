const _ = require("lodash")

const http = require("http")

const logger = require("./log").createLogger("server")

const store = require("./store")

const server = http.createServer((req, res) => {

    if(req.method == "POST") {
        var body = [];
        req.on('data', function(chunk) {
          body.push(chunk);
        }).on('end', function() {
          body = Buffer.concat(body).toString();
          res.end("not valid")

          try {
            json = JSON.parse(body)

            if(json.add && json.value) {
                logger.log("adding", json.add)
                store.add(String(json.add), json.value)
            }

          }
          catch(e) {
            logger.warn("couldn't parse", e.message)
          }
        })
    } else {
        res.end("can't validate")
        logger.warn("unknown query", req.method, req.url)
    }
})

server.listen(8000, () => console.log("8000"));