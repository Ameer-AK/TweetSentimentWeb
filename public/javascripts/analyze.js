const analyzeForm = document.querySelector('#analyze-form');
const resultH2 = document.querySelector('#analyze-result');
analyzeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const texts = [analyzeForm.elements.analyze_text.value];
    const model = analyzeForm.elements.model.value;
    const res = await axios.post('/analyze', { texts, model })
    resultH2.innerHTML = res.data.result == 1 ? 'Positive &#128516;' : 'Negative &#9785;';
})