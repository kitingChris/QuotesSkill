'use strict';

const LaunchRequestHandler = require('./Handler/LaunchRequest');
const HelloWorldIntentHandler = require('./Handler/HelloWorldIntent');

module.exports = {
    'LaunchRequest': LaunchRequestHandler,
    'HelloWorldIntent': HelloWorldIntentHandler,
};