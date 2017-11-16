'use strict';

const LaunchRequestHandler = require('./Handler/LaunchRequest');
const RandomQuoteIntentHandler = require('./Handler/RandomQuoteIntent');
const QuoteIntentHandler = require('./Handler/QuoteIntent');

module.exports = {
    'LaunchRequest': LaunchRequestHandler,
    'RandomQuoteIntent': RandomQuoteIntentHandler,
    'QuoteIntent': QuoteIntentHandler,
    'Unhandled': function () {
        this.emit(':tell', 'Leider habe ich deine Anfrage nicht verstanden.');
    }
};