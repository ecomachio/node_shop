const path = require('path')
const fs = require('fs')

const getFromFile = (fileName) => {
    const p = path.join(path.dirname(require.main.filename), 'data', fileName + '.json');
    return new Promise((res, rej) => {
        fs.readFile(p, "utf8", (err, data) => {
            if (err) {
                return res(null);
            } else {
                if (!data) {
                    return res(null);
                } else {
                    return res(JSON.parse(data));
                }
            }
        })
    })
}

exports.getFromFile = getFromFile;