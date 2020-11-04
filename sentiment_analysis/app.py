from flask import Flask, request
from sentiment_analysis import *
app = Flask(__name__)

ml = MLAnalyzer()
l = LexiconAnalyzer()


@app.route('/analyze', methods=['POST'])
def analyze():
    return str(ml.predict([request.get_json()['text']])[0])
