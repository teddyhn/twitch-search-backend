require('dotenv').config()
const express = require('express')
const app = express()
const db = require('./database')
const axios = require('axios')
const cors = require('cors')

const port = process.env.PORT || 8000
const clientID = process.env.CLIENTID

app.use(cors())

app.listen(port, () => {
    console.log('Server is running')
});

app.get('/search/:query', async (req, res) => {
    try {
        const cachedData = await db.fetchFromDB(req.params.query.toLowerCase())

        if (cachedData == null) {
            const response = await axios.get(`https://api.twitch.tv/kraken/users/?login=${req.params.query}`, {
                headers: {
                    'client-id': clientID,
                    'accept': 'application/vnd.twitchtv.v5+json'
                }
            })

            if (response.data._total == 1) {
                const channel = await axios.get(`https://api.twitch.tv/kraken/channels/${response.data.users[0]._id}`, {
                    headers: {
                        'client-id': clientID,
                        'accept': 'application/vnd.twitchtv.v5+json'
                    }
                })
                
                res.send(channel.data)

                db.saveToDB(channel.data.name, channel.data)
            }

            else res.status(404).send('Twitch user not found')
        }

        else {
            res.send(cachedData)
        }
    } catch (error) {
        res.send(error)
    }
});