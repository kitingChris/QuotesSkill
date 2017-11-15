'use strict';

const LaunchRequestHandler = require('./Handler/LaunchRequest');
const RandomQuoteIntentHandler = require('./Handler/RandomQuoteIntent');

module.exports = {
    'LaunchRequest': LaunchRequestHandler,
    'RandomQuoteIntent': RandomQuoteIntentHandler,
};