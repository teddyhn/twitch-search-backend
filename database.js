const fs = require('fs')

const PATH = `${__dirname}/cache/`

const readFile = path =>
    new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    });

const writeFile = (path, data) =>
    new Promise((resolve, reject) => {
        fs.writeFile(path, data, err => {
            if (err) reject(err)
            else resolve()
        })
    })

const deleteFile = path => fs.unlinkSync(path)

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

async function saveToDB(path, data) {
    console.log("Saving to DB: " + PATH + path + ".json")
    try {
        await writeFile(PATH + path + ".json", JSON.stringify(data))

        // Delete cached .json file after 5 minutes
        await waitFor(1000 * 60 * 5)
        await deleteFile(PATH + path + ".json")
    }
    catch {
        console.log("Failed saving", PATH + path + ".json")
        return null
    }
}

async function fetchFromDB(path) {
  console.log("Requesting from DB: " + PATH + path + ".json")
  try {
    let rawData = await readFile(PATH + path + ".json")
    return JSON.parse(rawData)
  }
  catch {
    console.log("Failed reading", PATH + path + ".json")
    return null
  }
}

module.exports = {
  saveToDB: saveToDB,
  fetchFromDB: fetchFromDB
}