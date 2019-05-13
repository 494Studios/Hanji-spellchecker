const path = require("path");
const hangul = require('./korean/hangeul');
const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(path.join(__dirname, "./ko_50k.txt"))
});

const constants = ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','ㄲ','ㄸ','ㅃ','ㅆ','ㅉ'];
const vowels = ['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ','ㅐ','ㅒ','ㅔ','ㅖ','ㅘ','ㅙ','ㅚ','ㅝ','ㅞ','ㅟ','ㅢ'];

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

generateFrequencies().then(function(data){
    let query = '내가';
    console.log(data[query]);

    let spreaded = hangul.spread(query);
    console.log(spreaded);
    console.log(hangul.split(query[0]));

});