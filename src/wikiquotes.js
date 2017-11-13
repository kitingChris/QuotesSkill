const WikiQuotes = require('./Client/WikiQuotes');


const wq1 = new WikiQuotes('https://en.wikiquote.org/w/api.php', {sectionsRegexFilter:"^1(\\.[0-9])*$"});
//wq1.getRandomQuote('Albert');
wq1.getRandomQuote('Albert Einstein');

const wq2 = new WikiQuotes('https://de.wikiquote.org/w/api.php', {sectionsRegexFilter:"^2(\\.[0-9])*$"});
//wq2.getRandomQuote('Albert');
wq2.getRandomQuote('Albert Einstein');