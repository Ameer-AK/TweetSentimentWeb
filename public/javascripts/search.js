const searchForm = document.querySelector('#search-form');
const tweetList = document.querySelector('#tweet-list');
const chartNode = document.querySelector('#chart');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress-bar');
const searchButton = document.querySelector('.btn');

const chartData = {
    datasets: [{
        data: [0, 0],
        backgroundColor: ['#66BB6A', '#ef5350']
    }],

    labels: [
        'Positive Tweets',
        'Negative Tweets',
    ]
};

const chart = new Chart(chartNode, {
    type: 'doughnut',
    data: chartData,
    options: {
        maintainAspectRatio: false,
        layout: {
            padding: 30
        },
        animation: {
            duration: 500,
        },
        plugins: {
            labels: {
                fontColor: 'black'
            }
        },
        legend: {
            labels: {
                padding: 0
            },
            align: 'start'
        }
    }
});

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.dir(searchButton);
    searchButton.disabled = true;
    const {
        q: { value: q },
        count: { value: count },
        model: { value: model },
        retweets: { checked: retweets },
        replies: { checked: replies },
        type: { value: type }
    } = searchForm.elements;
    searchForm.elements.q.value = '';
    tweetList.innerHTML = '';
    chartData.datasets[0].data = [0, 0];
    chart.update();
    const options = { q, model, retweets, replies, type }

    progress.style.visibility = 'visible';

    var max_id;
    window.progressCount = 0;
    for (let i = 0; i < count / 100; i++) {
        if (max_id) options.max_id = max_id;
        const { data } = await axios.post('/search', options);
        const { tweets } = data;
        max_id = data.max_id;
        addTweets(tweetList, tweets, count);
    }
    progressBar.style.width = '100%';
    delete max_id;
    delete window.progressCount;

    searchButton.disabled = false;

    window.setTimeout(() => {
        progress.style.visibility = 'hidden';
        progressBar.style.width = '0';
    }, 1000);
    return false;
})

const addTweets = (tweetList, tweets, count) => {
    for (let tweet of tweets) {
        if (tweet.prediction == 1) chartData.datasets[0].data[0] += 1;
        else chartData.datasets[0].data[1] += 1;
        chart.update()
        const li = document.createElement('li');
        li.classList.add('media');
        li.classList.add('mb-2');
        li.classList.add('border');
        li.classList.add('rounded');
        li.classList.add('shadow-sm');
        li.classList.add('pr-3');
        li.classList.add('text-wrap');
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

        window.progressCount += 1;
        progressBar.style.width = window.progressCount / count * 100 + '%';

    }
}