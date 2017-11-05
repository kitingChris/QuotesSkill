'use strict';

const HelloWorldIntentHandler = function () {
    this.emit(':tell', 'Hello World!');
};

module.exports = HelloWorldIntentHandler;