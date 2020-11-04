if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

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
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/search', (req, res) => {
    res.render('search')
})

app.post('/search', async (req, res) => {
    const result = await client.get('search/tweets', { q: 'hello -filter:retweets', tweet_mode: 'extended', count: 5, lang: 'en' })
    console.log(result);
    const tweets = result.statuses.map(status => status.full_text)
    res.send(tweets)
})


app.get('/analyze', (req, res) => {
    res.render('analyze');
})

app.post('/analyze', async (req, res) => {
    const { text } = req.body;
    console.log(`ANALYZING: ${text}`);
    const response = await axios.post('http://localhost:5000/analyze', { text })
    const { data } = response;
    console.log(`Result from Python: ${data.result}`);
    res.send({ result: data.result })
})

app.listen(8080, () => {
    console.log('listening on port 8080...');
})

