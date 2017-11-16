'use strict';

const WikiQuotesClient = require('../Client/WikiQuotes');

const RandomQuoteIntentHandler = function () {

    const self = this;

    const wq = new WikiQuotesClient('https://de.wikiquote.org/w/api.php', {quotesSection:"2"});

    wq.getRandomQuote(
        author,
        function (quote) {
            const speechOutput = 'Zitat von '+quote.author+': '+quote.text;
            const cardTitle = 'Zitat von '+quote.author;
            const cardContent = quote.text;
            self.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
        },
        function (error) {
            const speechOutput = 'Es tut mir leid aber ich konnte bei WikiQuotes kein Zitat finden.';
            console.error(error);
            self.emit(':tell', speechOutput);
        }
    );

};

module.exports = RandomQuoteIntentHandler;