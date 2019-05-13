const path = require("path");
const hangul = require('./korean/hangeul');
const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(path.join(__dirname, "./ko_50k.txt"))
});

const initialConsonants = ['ᄀ','ᄁ','ᄂ','ᄃ','ᄄ','ᄅ','ᄆ','ᄇ','ᄈ','ᄉ','ᄊ','ᄋ','ᄌ','ᄍ','ᄎ','ᄏ','ᄐ','ᄑ','ᄒ'];
const vowels = ['ᅡ','ᅢ','ᅣ','ᅤ','ᅥ',	'ᅦ','ᅧ','ᅨ','ᅩ',	'ᅪ','ᅫ','ᅬ','ᅭ','ᅮ',	'ᅯ', 'ᅰ','ᅱ',	'ᅲ','ᅳ','ᅴ','ᅵ'];
const finalConsonants = ['ᆨ','ᆩ','ᆪ','ᆫ','ᆬ',	'ᆭ','ᆮ','ᆯ', 'ᆰ',	'ᆱ','ᆲ','ᆳ','ᆴ',	'ᆵ','ᆶ','ᆷ','ᆸ','ᆹ',	'ᆺ','ᆻ','ᆼ','ᆽ','ᆾ',	'ᆿ','ᇀ','ᇁ','ᇂ'];

function generateFrequencies() {
    return new Promise(function(resolve, reject) {
        const WORD_COUNTS = {};
        lineReader.on('line', function (line) {
            //console.log('Line from file:', line);
            let data = line.split(" ");
            WORD_COUNTS[data[0]] = data[1];
        });

        lineReader.on('close', function () {
            console.log('inner: ' + WORD_COUNTS['내가']);
            resolve(WORD_COUNTS);
        });
    });
}

function editDistance1(word) {
    // Go through each syllable in word and break into letters
    let results = [];
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
                results.push(word.substring(0,i) + block + word.substring(i+1));
            }
        }

        // Replace a letter
        // initial constants
        for(let j = 0;j<initialConsonants.length;j++) {
            let block = hangul.join(initialConsonants[j],spread[1],spread[2]);
            results.push(word.substr(0,i) + block + word.substring(i+1))
        }
    }
    return results;
}

generateFrequencies().then(function(data){
    let query = '내가';
    console.log(data[query]);
    console.log(editDistance1(query));
});