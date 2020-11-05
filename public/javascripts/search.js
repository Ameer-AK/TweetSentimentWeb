const searchForm = document.querySelector('#search-form');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { q: { value: q }, model: { value: model }, retweets: { checked: retweets }, replies: { checked: replies }, type: { value: type } } = searchForm.elements;
    searchForm.elements.q.value = '';
    // console.log(q);
    // console.log(model);
    // console.log(retweets);
    // console.log(replies);
    // console.log(type);
    const { data } = await axios.post('/search', { q, model, retweets, replies, type });
    const body = document.querySelector('main');
    for (let tweet of data) {
        const p = document.createElement('p');
        p.innerText = `User: ${tweet.username}\nText:\n${tweet.text}\nCreated on: ${tweet.time}`;
        p.style.color = tweet.prediction == 1 ? 'green' : 'red';
        body.append(p);
        body.append(document.createElement('br'));
    }
})