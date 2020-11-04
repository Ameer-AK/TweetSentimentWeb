const searchForm = document.querySelector('#search-form');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchInput = searchForm.elements.search;
    const { data } = await axios.post('/search', { q: searchInput.value });
    const body = document.querySelector('main');
    for (let tweet of data) {
        const p = document.createElement('p');
        p.innerText = tweet;
        body.append(p);
        body.append(document.createElement('br'));
    }
})