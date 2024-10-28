## English Word Chain Generator

This project implements a simple statistical language model to generate random word-like sequences that resemble English words (not entire sentences, but individual words and names).

### Project Structure

* `build-model.mjs`: This script builds a model of letter transitions using an English word dictionary file. It outputs the model as a JSON file.
* `create-words.mjs`: This script utilizes the generated model to generate random sequences of letters that resemble English words.
* `english_words_alpha.txt` (**Not Included**):  A dictionary (dataset) of English words (non-hyphenated, non-accentuated words). This dataset is not included in the repository in order to save space. It should be a plain text file containing English words, separated by CRLF newlines. You can find it here (you can also use whatever dictionary file you want, given it uses the aforementioned format): [https://github.com/dwyl/english-words/blob/master/words_alpha.txt](https://github.com/dwyl/english-words/blob/master/words_alpha.txt)

### Instructions

1. Download or create a file named `english_words_alpha.txt` containing English words separated by CRLF newlines.
2. Run `build-model.mjs` to generate the letter-chain model:

```bash
node build-model.mjs
```

This will create a file named `letter-chain.json` containing the model data.

3. Run `create-words.mjs` to generate random word-like sequences:

```bash
node create-words.mjs
```

The script will print the generated words to the console.

### Technical Details

* The `build-model.mjs` script builds a statistical model based on the frequency of letter transitions in the provided dictionary.
* The model considers both single-letter and two-letter sequences to capture longer-range dependencies.
* The `create-words.mjs` script uses the model to generate random sequences by probabilistically selecting the next letter based on the current context.
* This is a simple example of Natural Language Processing (NLP) using a statistical approach.

**Note:** The generated words are not necessarily real English words, but they may sound similar or resemble real words due to the statistical nature of the model. 

### Future ideas
The following list annotates possible ideas for this project. They may or may not be implemented one day. You're free to PR them if you want.
- Improve the modelling, accounting for other patterns as well, such as syllables and consonant-vowel subpatterns (CVC, CVVC, CCV, VCV, etc...). 
- ~~Convey a mechanism for weighted random choice, instead of relying on top N most-frequent letters.~~ Done.
