const path = require("path");
const hangul = require('./korean/hangeul');
const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(path.join(__dirname, "./ko_50k.txt"))
});

const initialConsonants = ['ᄀ','ᄁ','ᄂ','ᄃ','ᄄ','ᄅ','ᄆ','ᄇ','ᄈ','ᄉ','ᄊ','ᄋ','ᄌ','ᄍ','ᄎ','ᄏ','ᄐ','ᄑ','ᄒ'];
const vowels = ['ㅏ','ㅓ','ㅐ','ㅔ','ㅒ','ㅖ','ㅑ','ㅕ','ㅜ','ㅗ','ㅘ','ㅝ','ㅙ','ㅞ','ㅛ','ㅠ','ㅚ','ㅟ','ㅢ','ㅡ','ㅣ'];
const finalConsonants = ['ᆨ','ᆩ','ᆪ','ᆫ','ᆬ','ᆭ','ᆮ','ᆯ', 'ᆰ','ᆱ','ᆲ','ᆳ','ᆴ',	'ᆵ','ᆶ','ᆷ','ᆸ','ᆹ',	'ᆺ','ᆻ','ᆼ','ᆽ','ᆾ',	'ᆿ','ᇀ','ᇁ','ᇂ'];

function generateFrequencies() {
    return new Promise(function(resolve, reject) {
        const WORD_COUNTS = {};
        lineReader.on('line', function (line) {
            //console.log('Line from file:', line);
            let data = line.split(" ");
            WORD_COUNTS[data[0]] = parseInt(data[1]);
        });

        lineReader.on('close', function () {
            console.log('inner: ' + WORD_COUNTS['내가']);
            resolve(WORD_COUNTS);
        });
    });
}

function editDistance1(word, corpus) {
    // Go through each syllable in word and break into letters
    let results = {};
    for(let i = 0;i<word.length;i++) {
        if(!hangul.is_hangeul(word[i])) {
            console.log(word[i] + " is not hangul");
            continue;
        }

        let spread = hangul.split(word[i]);
        console.log(spread);

        // Add a letter, if possible
        if(spread[2] == null) {
            for(let j = 0;j<finalConsonants.length;j++) {
                let block = hangul.join(spread[0],spread[1],finalConsonants[j]);
                let correction = word.substring(0,i) + block + word.substring(i+1);
                results[correction] = corpus[correction];
            }
        }

        // Replace a letter
        // initial constants
        for(let j = 0;j<initialConsonants.length;j++) {
            let block = hangul.join(initialConsonants[j],spread[1],spread[2]);
            let correction = word.substr(0,i) + block + word.substring(i+1);
            results[correction] = corpus[correction];

            if(Math.abs(initialConsonants.indexOf(initialConsonants[j]) - initialConsonants.indexOf(spread[0])) === 1) {
                results[correction] *= 10;
            }
        }
        // middle vowel
        for(let j = 0;j<vowels.length;j++) {
            let block = hangul.join(spread[0],vowels[j],spread[2]);
            let correction = word.substr(0,i) + block + word.substring(i+1);
            results[correction] = corpus[correction];

            if(Math.abs(vowels.indexOf(vowels[j]) - vowels.indexOf(spread[1])) === 1) {
                results[correction] *= 200;
            }
        }
    }
    return results;
}

generateFrequencies().then(function(data){
    let query = '선셍님';
    console.log(data[query]);

    let results = editDistance1(query,data);
    console.log(results);

    /*let maxFreq = 0;
    let correction = '';
    for(let i = 0;i<results.length;i++) {
        let freq = data[results[i]];
        if(freq > maxFreq) {
            maxFreq = freq;
            correction = results[i];
        }
    }
    console.log(correction + ': ' + maxFreq);*/
});