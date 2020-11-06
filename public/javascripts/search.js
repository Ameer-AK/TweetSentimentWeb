const searchForm = document.querySelector('#search-form');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const {
        q: { value: q },
        count: { value: count },
        model: { value: model },
        retweets: { checked: retweets },
        replies: { checked: replies },
        type: { value: type }
    } = searchForm.elements;
    searchForm.elements.q.value = '';

    var max_id;
    const options = { q, model, retweets, replies, type }
    for (let i = 0; i < count / 100; i++) {
        if (max_id) options.max_id = max_id;
        const { data } = await axios.post('/search', options);
        const { tweets } = data;
        max_id = data.max_id;

        const body = document.querySelector('main');
        for (let tweet of tweets) {
            const p = document.createElement('p');
            p.innerText = `${tweets.indexOf(tweet) + i * 5 + 1}\nUser: ${tweet.username}\nText:\n${tweet.text}\nCreated on: ${tweet.time}`;
            p.style.color = tweet.prediction == 1 ? 'green' : 'red';
            p.style.border = '1px solid black';
            p.style.fontSize = '16px';
            p.style.margin = '0px 3px';
            body.append(p);
        }
    }
    delete max_id;
})