import re
import emoji

class Normalizer:
    """A class used for processing text before using in sentiment analysis.

    Parameters
    ----------
        lexicon: bool
            True to normalize for use of a lexicon. False to use for a machine learning model.

    Attributes
    ----------
        __url: pattern
            Private pattern for detecting URLs in text
        __email: pattern
            Private pattern for detecting email addresses in text
        __pEmoticon: pattern
            Private pattern for detecting positive emoticons in text
        __nEmoticon: pattern
            Private pattern for detecting negative emoticons in text.
        __emoji: pattern
            Private pattern for detecting emojis in text that uses the emoji library.
        __hashtag: pattern
            Private pattern for detecting Hashtags in text.
        __user: pattern
            Private pattern for detecting Usertags in text.
        __repeated_character: pattern
            Private pattern for detecting characters repeated more than twice in text.
        __repeated_space: pattern
            Private pattern for detecting repeated spaces in text.
        __laugh: pattern
            Private pattern for detecting laughs repeated more than twice in text e.g. "hahahaha" or "jajajaja".
        __number: pattern
            Private pattern for detecting numbers in text.
        __ntDic: dict{str,str}
            Private dictionary used to replace negations written with no apostrophe with correct ones.
        __lexicon: bool
            True to normalize for use of a lexicon. False to use for a machine learning model.
    """
    __url = re.compile("https?://[-_.?&~;+=/#0-9A-Za-z]+")
    __email = re.compile("[-_.0-9A-Za-z]+@[-_0-9A-Za-z]+[-_.0-9A-Za-z]+")
    __pEmoticon = re.compile("[=:;x]-?[)\\]dp3]", 2)
    __nEmoticon = re.compile("[=:;x]-?[()\\[os$\\\\#]", 2)
    __emoji = emoji.get_emoji_regexp()
    __hashtag = re.compile("#[A-Za-z0-9_]*")
    __user = re.compile("@[A-Za-z0-9_]*")
    __repeated_character = re.compile("(.)\\1{2,}", 2)
    __repeated_space = re.compile("\\s{2,}", 2)
    __laugh = re.compile("([hj])+([aieou])+(\\1+\\2+)+", 2)
    __number = re.compile("\\d+")

    __ntDic = {" couldnt ":" couldn't ", " wasnt ":" wasn't ", " didnt ":" didn't ",
            " wouldnt ":" wouldn't ", " shouldnt ":" shouldn't ", " werent ":" weren't ",
            " dont ":" don't ", " doesnt ":" doesn't ", " havent ":" haven't ",
            "hasnt":"hasn't", "wont":"won't", "hadnt":"hadn't",
            " cant ":" can't ", " isnt ":" isn't ", " arent ":" aren't "}

    def __init__(self, lexicon: bool = True):
        self.__lexicon = lexicon

    def normalize(self, intext: str) -> str:
        """Method that return a normalized version of texts that is usable for sentiment analysis.

        Parameters
        ----------
            intext: str
                Text to be normalized.
        
        Returns
        -------
            text: str
                Normalized text.
        """
        text = intext.lower()
        text = re.sub(self.__repeated_character, r'\1\1', text) # reduce repetition to two.
        text = re.sub(self.__laugh, r'\1\2\1\2', text) # reduce repetition to two.
        text = re.sub(self.__emoji, "", text)
        text = re.sub(self.__pEmoticon, "", text) if self.__lexicon else text
        text = re.sub(self.__nEmoticon, "", text) if self.__lexicon else text
        text = re.sub(self.__url, "", text)
        text = re.sub(self.__email, "", text)
        text = re.sub(self.__hashtag, "", text) if self.__lexicon else text.replace("#", "")
        text = re.sub(self.__user, "", text) if self.__lexicon else text.replace("@", "")
        text = re.sub(self.__number, "", text)
        text = re.sub(self.__repeated_space, " ", text)
        for word, replacement in self.__ntDic.items():
            text = text.replace(word, replacement)
        return text
        