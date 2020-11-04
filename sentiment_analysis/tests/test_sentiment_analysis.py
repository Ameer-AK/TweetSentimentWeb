import sys, os
sys.path.append(os.path.abspath(''))

import pytest
from sentiment_analysis import *

l = LexiconAnalyzer()
ml = MLAnalyzer()

def test_getTaggedLemmas():
    assert l.getTaggedLemmas("The weather is great today.")==[('the', 'n'), ('weather', 'n'), ('be', 'v'), ('great', 'a'), ('today', 'n'), ('.', 'n')]

def test_getScore1():
    assert l.getScore("piggy", "a")==-0.125

def test_getScore2():
    assert l.getScore("help", "v")==0.03125

def test_lexicon_predict1():
    assert l.predict("nice good love")==1

def test_lexicon_predict2():
    assert l.predict("hate bad ugly")==0

def test_ml_predict1():
    assert ml.predict(["nice good love"])==[1] 

def test_ml_predict2():
    assert ml.predict(["hate bad ugly"])==[0]