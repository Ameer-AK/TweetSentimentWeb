const searchForm = document.querySelector('#search-form');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchInput = searchForm.elements.search_text;
    const modelInput = searchForm.elements.model;
    const { data } = await axios.post('/search', { q: searchInput.value, model: modelInput.value });
    const body = document.querySelector('main');
    for (let tweet of data) {
        const p = document.createElement('p');
        p.innerText = `User: ${tweet.username}\nText:\n${tweet.text}\nCreated on: ${tweet.time}`;
        p.style.color = tweet.prediction == 1 ? 'green' : 'red';
        body.append(p);
        body.append(document.createElement('br'));
    }
})