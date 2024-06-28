const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const spotifyWebApi = require('spotify-web-api-node');
const spotifyAPI = new spotifyWebApi({
    clientId: "08c0956377e24669991df441c90d1fce",
    clientSecret: "2815e53aa7de4f5f812a2222c24f1b83",
    redirectUri: "https://csci-571-hw8-backend-382602.wl.r.appspot.com"
});

const PRIVATE_API_KEY = "S02CZYJ9wVYN-BgNrWdZa199BpG-YPrVsVT5RbTMe27zj0-fY6rx4OkW6SkE-jo10g2lnzciTZyMlkvHvX-Ardu1PLIedbv1gNp5ZpQp5-TUvY7HlxmJwBTvRl3pRuG49iKbVL"
const TICKETMASTER_API_KEY = "NmAmzzULd27THrpNvoNsYanQuaA6wpE4"
const headers = {'Authorization': 'bearer %s' % PRIVATE_API_KEY}


app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://csci-571-hw8-382522.wl.r.appspot.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    })
app.use(express.static(path.join(__dirname, '/build')));


app.get('/search_events', async (req, res) => {
    var geohash = require('ngeohash');
    geo_hashed = geohash.encode(req.query.latitude, req.query.longitude, 7);
    segment_dict = {
        "Default": "",
        "Music": "KZFzniwnSyZfZ7v7nJ",
        "Sports": "KZFzniwnSyZfZ7v7nE",
        "ArtsAndTheatre": "KZFzniwnSyZfZ7v7na",
        "Film": "KZFzniwnSyZfZ7v7nn",
        "Miscellaneous": "KZFzniwnSyZfZ7v7n1"};
    
    _keyword = req.query.keyword;
    _radius = req.query.distance;
    _category = req.query.category;
    const URL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey="+TICKETMASTER_API_KEY+"&size=20&keyword="+_keyword+"&geoPoint="+geo_hashed+"&radius="+_radius+"&unit=miles&segmentId="+segment_dict[_category];
    const table_detail_result = await axios.get(URL, {headers: headers});
    res.json(table_detail_result.data);
});

app.get('/event_details', async (req, res) => {
    const URL = "https://app.ticketmaster.com/discovery/v2/events/"+req.query.event_id+".json?apikey="+TICKETMASTER_API_KEY;
    let event_detail_result = await axios.get(URL, {headers: headers});
    res.json(event_detail_result.data);
});

app.get('/venue_details', async (req, res) => {
    const URL = "https://app.ticketmaster.com/discovery/v2/venues.json?apikey="+TICKETMASTER_API_KEY+"&keyword="+req.query.keyword;
    const venue_detail_result = await axios.get(URL, {headers: headers});
    res.json(venue_detail_result.data);
});

app.get('/suggestions', async (req, res) => {
    const URL = "https://app.ticketmaster.com/discovery/v2/suggest?apikey="+TICKETMASTER_API_KEY+"&keyword="+req.query.keyword;
    const suggestions_result = await axios.get(URL, {headers: headers});
    res.json(suggestions_result.data);
});

app.get('/spotify_details', async (req, res) => {
    const spotify_data = async () => {
        try {
            spotifyAPI.clientCredentialsGrant().then(
                function(data) {
                    spotifyAPI.setAccessToken(data.body['access_token']);
                    spotifyAPI.searchArtists(req.query.keyword).then(
                        function(data) {
                            res.json(data?.body?.artists?.items[0]);
                        },
                        function(err) {
                            console.error(err);
                        }
                    );
                },
                function(err) {
                    console.log('Something went wrong when retrieving an access token', err);
                }
            );
        }
        catch (err) {
            console.log(err);
        }
    };
    spotify_data();
});

app.get('/spotify_album_details', async (req, res) => {
    const spotify_data = async () => {
        try {
            spotifyAPI.clientCredentialsGrant().then(
                function(data) {
                    spotifyAPI.setAccessToken(data.body['access_token']);
                    spotifyAPI.getArtistAlbums(req.query.keyword, {limit: 3}).then(
                        function(data) {
                            res.json(data?.body?.items);
                        },
                        function(err) {
                            console.error(err);
                        }
                    );
                },
                function(err) {
                    console.log('Something went wrong when retrieving an access token', err);
                }
            );
        }
        catch (err) {
            console.log(err);
        }
    };
    spotify_data();
});

app.get('/*', (req, res) => {
    console.log(process.cwd());
    // res.sendFile(path.join(__dirname, '/build/index.html'));
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});  

app.listen(8080, () => {});