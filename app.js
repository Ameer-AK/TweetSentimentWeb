if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const { response } = require('express');
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const Twitter = require('twitter');
const axios = require('axios');

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
})


app.set('view engine', 'ejs')
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/search', (req, res) => {
    res.render('search')
})

app.post('/search', async (req, res) => {
    const result = await client.get('search/tweets', { q: 'hello -filter:retweets', tweet_mode: 'extended', count: 100 }, (err, tweets, response) => {
        for (let tweet of tweets.statuses) console.log(`User: ${tweet.user.screen_name}\n text: ${tweet.full_text}\n created on: ${tweet.created_at}`);
    })
    res.redirect('/search');
})

app.get('/analyze', (req, res) => {
    res.render('analyze');
})

app.post('/analyze', async (req, res) => {
    console.log(`ANALYZING: ${req.body.analyze}`);
    const result = await axios.post('http://localhost:5000/analyze', { text: req.body.analyze })
    console.log(`Analysis result from Python: ${result.data}`);
    res.redirect('/analyze');
})

app.listen(8080, () => {
    console.log('listening on port 8080...');
})

