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
    const { q, model, retweets, replies, type } = req.body;
    const result = await client.get('search/tweets', {
        q: `"${q}" ${retweets ? '' : '-filter:retweets'} ${replies ? '' : '-filter:replies'}`,
        tweet_mode: 'extended',
        count: 5,
        result_type: type,
        lang: 'en'
    })
    const nextResultsParams = new URLSearchParams(result.search_metadata.next_results);
    const max_id = nextResultsParams.get('max_id');
    const texts = result.statuses.map(status => status.full_text)
    const { data } = await axios.post('http://localhost:5000/analyze_sentiment', { texts, model })
    const out = result.statuses.map((s, i) => {
        return {
            username: s.user.screen_name,
            text: s.full_text,
            time: s.created_at,
            prediction: data[i],
            max_id
        }
    })
    res.send(out)
})


app.get('/analyze', (req, res) => {
    res.render('analyze');
})

app.post('/analyze', async (req, res) => {
    const { texts, model } = req.body;
    const { data } = await axios.post('http://localhost:5000/analyze_sentiment', { texts, model })
    res.send({ result: data })
})

app.listen(3000, () => {
    console.log('listening on port 3000...');
})

