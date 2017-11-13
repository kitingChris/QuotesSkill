const WikiQuotes = require('./Client/WikiQuotes');


const wq1 = new WikiQuotes('https://en.wikiquote.org/w/api.php', {quotesSection:"1", querySelectorAll: "div > ul > li"});
//wq1.getRandomQuote('Albert');
wq1.getRandomQuote('Albert Einstein', function (quote) {
    console.log("-".repeat(40))
    console.log(quote.text);
    console.log("\t\t- ", quote.author);
    console.log("-".repeat(40))
});

const wq2 = new WikiQuotes('https://de.wikiquote.org/w/api.php', {quotesSection:"2", querySelectorAll: "div > ul > li"});
//wq2.getRandomQuote('Albert');

wq2.getRandomQuote('Albert Einstein');