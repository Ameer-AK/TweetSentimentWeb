const analyzeForm = document.querySelector('#analyze-form');

analyzeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const analyzeInput = analyzeForm.elements.analyze_text;
    const modelInput = analyzeForm.elements.model;
    const res = await axios.post('/analyze', { texts: [analyzeInput.value], model: modelInput.value })
    const h2 = document.createElement('h2');
    h2.innerText = res.data.result;
    document.querySelector('body').append(h2);
})