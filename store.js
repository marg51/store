const _ = require("lodash")
const fs = require("fs")

const logger = require("./log").createLogger("store")

let store
fs.readFile("./_data.json", (err, result) => {
    if(err && err.code!== "ENOENT") {
        return logger.error(err)
    }

    try {
        if(!result) {
            store = {}
            logger.warn("new store created")
        } else {
            store = JSON.parse(result)
            logger.success("data loaded")
        }


    } catch(e) {
        logger.error("_data.json is corrupted", e.message)
    }
})

exports.add = (type, data) => {
    if(!store) {
        return logger.error("data isn't loaded")
    }

    if(!type || !data) {
        return logger.warn("wrong params", type, data)
    }

    if(!store[type]) {
        store[type] = []
    }

    store[type].push(data)

    exports.save()
}

exports.save = _.throttle(() => {
    fs.writeFile("./_data.json", JSON.stringify(store, null, 4), (err, result) => {
        if(err) {
            return logger.error("save:",err)
        }
        logger.success("persisted")
    })
}, 60000)