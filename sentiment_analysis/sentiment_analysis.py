from typing import Tuple
import os
import sys
import pickle
from normalizer import Normalizer
from nltk import word_tokenize, pos_tag, data
from nltk.stem import WordNetLemmatizer
data.path.append(os.path.join(os.path.dirname(__file__), 'nltk_data'))


def resource_path(relative_path):
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(
        os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)


class LexiconAnalyzer:
    """Class for lexicon-based sentiment analysis of text.

    Attributes
    ----------
        __norm: Normalizer 
            The normalizer used to preprocess text.
        __negations: [str]
            A private list of strings that contains negations.
        __POSdic: { str:str }
            A dictionary that maps Penn Treebank POS tags to tags usable by the SentiWordNet lexicon.
    """
    __norm = Normalizer()
    __negations = ["no", "not", "rather", "hardly", "none", "n't"]
    __POSdic = {
        "NN": "n", "NNS": "n", "NNP": "n", "NNPS": "n",
        "JJ": "a", "JJR": "a", "JJS": "a",
        "RB": "r", "RBR": "r", "RBS": "r",
        "VB": "v", "VBD": "v", "VBG": "v", "VBN": "v", "VBP": "v", "VBZ": "v"
    }

    def __init__(self):
        """Contructor for Lexicon class

        Loads the dictionary generated from SentiWordNet into a dict object
        """

        with open(resource_path("models/lexiconmodel.pkl"), "rb") as f:
            self.__dic = pickle.load(f)

    def predict(self, texts: [str]) -> [int]:
        """Method that predicts the sentiment of a given text.

        Parameters
        ----------
            text: [str]
                The texts to be analyzed for sentiment

        Returns
        -------
            sent: [int]
                 Sentiment of the given texts.
                 1 is positive and 0 is negative.
        """
        result = []
        for text in texts:
            negate = 1
            sum = 0
            for t in self.getTaggedLemmas(text):
                score = self.getScore(t[0], t[1])
                # If the word is a negation the score of the next word with sentiment will be negated.
                if t[0] in self.__negations:
                    negate = -1
                if score != 0:
                    sum += score * negate
                    negate = 1
            result.append(1 if sum >= 0 else 0)
        return result

    def getScore(self, word: str, tag: str) -> float:
        """Private method that gets the sentiment score of a word from the SWN dict using the word and its POS tag.

        Parameters
        ----------
            word: str
                The word
            tag: str
                The POS tag of the word.

        Returns
        -------
            score: float
                The sentiment score of the word. If the score of a word is not found in the SWN dictionary 0.0 is returned.
        """

        return self.__dic.get(word+";"+tag, 0.0)

    def getTaggedLemmas(self, text: str) -> [Tuple[str, str]]:
        """Private method that takes in a sentence and returns a list of tuples of lemmas and their POS tags.
        this method uses the tokenizer, POStagger, and Lemmatizer form NLTK library.

        Parameters
        ----------
            text: str
                Text to be tokenized, tagged, and lemmatized.

        Returns
        -------
            taggedLemmas: [tuple(str,str)]
                A list of tuples each containing a lemma and its POS tag. If the tag is not usable in SWN dictionarry
                it is replaced with "n" by default.
        """

        text = self.__norm.normalize(text)
        tokens = word_tokenize(text)
        tags = pos_tag(tokens)
        lemm = WordNetLemmatizer()
        taggedLemmas = [(lemm.lemmatize(t[0], self.__POSdic.get(
            t[1], "n")), self.__POSdic.get(t[1], "n")) for t in tags]
        return taggedLemmas


class MLAnalyzer:
    """Class for sentiment analysis using a trained logistic regression classifer

    """

    def __init__(self):
        with open(resource_path("models/mlmodel.pkl"), "rb") as f:
            self.__model = pickle.load(f)

    def predict(self, texts: [str]) -> [int]:
        """Method that predicts the sentiment of a given text.

        Parameters
        ----------
            texts: [str]
                The list of texts to be analyzed for sentiment

        Returns
        -------
            sent: [int]
                 Sentiments of the given texts.
                 1 is positive and 0 is negative.
        """
        return self.__model.predict(texts)
