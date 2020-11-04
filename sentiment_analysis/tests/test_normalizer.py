import pytest
from normalizer import *

lexicon_n = Normalizer()
ml_n = Normalizer(False)

def test_normalize_repeated_spaces():
    assert lexicon_n.normalize("  ")==" "

def test_normalize_repeated_characters():
    assert lexicon_n.normalize("cooool")=="cool"
    assert lexicon_n.normalize("feeeeeeeet")=="feet"

def test_normalize_laughs():
    assert lexicon_n.normalize("hahahaha")=="haha"
    assert lexicon_n.normalize("jajaja")=="jaja"

def test_normalize_lowercase():
    assert lexicon_n.normalize("ABCD")=="abcd"
    assert lexicon_n.normalize("aBcD")=="abcd"

def test_normalize_emoticons():
    assert lexicon_n.normalize(":)")==""
    assert lexicon_n.normalize(":(")==""
    assert lexicon_n.normalize(":o")==""

def test_normalize_emoticons_ml():
    assert ml_n.normalize(":)")==":)"
    assert ml_n.normalize(":(")==":("
    assert ml_n.normalize(":o")==":o"

def test_normalize_emojis():
    assert lexicon_n.normalize("😳")==""
    assert lexicon_n.normalize("😂")==""

def test_normalize_URLs():
    assert lexicon_n.normalize("https://www.google.com/")==""

def test_normalize_emails():
    assert lexicon_n.normalize("example123@gmail.com")==""

def test_normalize_hashtags():
    assert lexicon_n.normalize("#Hashtag")==""

def test_normalize_hashtags_ml():
    assert ml_n.normalize("#Hashtag")=="hashtag"

def test_normalize_usertags():
    assert lexicon_n.normalize("@Usertag")==""

def test_normalize_usertags_ml():
    assert ml_n.normalize("@Usertag")=="usertag"

def test_normalize_numbers():
    assert lexicon_n.normalize("12")==""

def test_normalize_nt():
    assert lexicon_n.normalize("i dont arent won't")=="i don't aren't won't"

def test_normalize_error_int():
    with pytest.raises(Exception):
        lexicon_n.normalize(12)

def test_normalize_error_list():
    with pytest.raises(Exception):
        lexicon_n.normalize(["hello"])