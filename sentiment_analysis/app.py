from sentiment_analysis import *
from flask import Flask, request, jsonify, make_response
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)

ml = MLAnalyzer()
l = LexiconAnalyzer()


@app.route('/analyze', methods=['POST'])
def analyze():
    inp = request.get_json()
    texts = inp['texts']
    model = inp['model']
    result = ml.predict(texts).tolist() if model == 'ml' else l.predict(
        texts) if model == 'l' else ['XXXX']
    return jsonify(result)
