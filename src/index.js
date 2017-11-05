'use strict';

const Alexa = require('alexa-sdk');
const config = require('./config.json');
const handlers = require('./handlers');

exports.handler = function(event, context, callback){
    const alexa = Alexa.handler(event, context, callback);

    alexa.appId = config.APP_ID;
    alexa.registerHandlers(handlers);

    console.log(`Beginning execution for skill with APP_ID=${alexa.appId}`);
    alexa.execute();
    console.log(`Ending execution  for skill with APP_ID=${alexa.appId}`);
};