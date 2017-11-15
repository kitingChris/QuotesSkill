'use strict';

const WikiQuotesClient = require('../Client/WikiQuotes');

const RandomQuoteIntentHandler = function () {

    //const wqClient = new WikiQuotesClient();

    //console.log(this);

    const self = this;

    const wq = new WikiQuotesClient('https://de.wikiquote.org/w/api.php', {quotesSection:"2"});

    wq.getRandomQuote('Albert Einstein', function (quote) {
        const speechOutput = 'Zitat von '+quote.author+': '+quote.text;
        const cardTitle = 'Zitat von '+quote.author;
        const cardContent = quote.text;
        self.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
    });



};

module.exports = RandomQuoteIntentHandler;