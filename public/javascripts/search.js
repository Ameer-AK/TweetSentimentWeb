const searchForm = document.querySelector('#search-form');
const tweetList = document.querySelector('#tweet-list');

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
            const li = document.createElement('li');
            li.classList.add('media');
            li.classList.add('mb-2');
            li.classList.add('border');
            li.classList.add('rounded');
            li.classList.add('shadow-sm');
            li.classList.add('pr-3');
            li.classList.add(tweet.prediction == 1 ? 'pos' : 'neg');
            const img = document.createElement('img');
            img.src = tweet.img;
            img.classList.add('mr-3');
            img.classList.add('rounded-circle');
            const div = document.createElement('div');
            div.classList.add('media-body');
            const h5 = document.createElement('h5');
            h5.classList.add('mt-0');
            h5.classList.add('mb-1');
            h5.innerText = tweet.username;
            const p = document.createElement('p');
            p.classList.add('mt-0');
            p.classList.add('mb-0');
            p.classList.add('text-justify');
            p.innerText = tweet.text;
            const small = document.createElement('small');
            small.classList.add('mt-0');
            small.innerText = tweet.time;
            div.append(h5, p, small);
            li.append(img, div);
            tweetList.append(li);
        }
    }
    delete max_id;
})