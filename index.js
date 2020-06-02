require('dotenv').config()
const express = require('express')
const app = express()
const db = require('./database')
const axios = require('axios')

const port = process.env.PORT || 8000
const clientID = process.env.CLIENTID

app.listen(port, () => {
    console.log('Server is running')
});

app.get('/search/:query', async (req, res) => {
    try {
        const cachedData = await db.fetchFromDB(req.params.query)

        if (cachedData == null) {
            const response = await axios.get(`https://api.twitch.tv/kraken/channels/${req.params.query}`, {
                headers: {
                    'client-id': clientID
                }
            })
            const data = response.data
            res.send(data)
    
            db.saveToDB(data.name, data)
        }

        else {
            res.send(cachedData)
        }
    } catch (error) {
        res.send(error)
    }
});