from flask import Flask, request, jsonify, make_response
from sentiment_analysis import *
app = Flask(__name__)

ml = MLAnalyzer()
l = LexiconAnalyzer()


@app.route('/analyze', methods=['POST'])
def analyze():
    inp = request.get_json()['text']
    result = str(ml.predict([inp])[0])
    return {"result": result}
