const express = require('express');
const app = express();
const axios = require('axios');

app.listen(8000, () => {
    console.log('App listening on port 8000!')
});

app.get('/search/:query', async (req, res) => {
    try {
        const response = await axios.get(`https://api.twitch.tv/kraken/channels/${req.params.query}`, {
            headers: {
                'client-id': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
            }
        })
        const data = response.data
        res.send(data)
    } catch (error) {
        res.send(error)
    }
});