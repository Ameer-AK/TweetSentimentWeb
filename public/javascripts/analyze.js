const analyzeForm = document.querySelector('#analyze-form');

analyzeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const analyzeInput = analyzeForm.elements.analyze;
    console.dir(analyzeInput.value);
    const res = await axios.post('/analyze', { text: analyzeInput.value })
    const h2 = document.createElement('h2');
    h2.innerText = res.data.result;
    document.querySelector('body').append(h2);
})