'use strict';

const Alexa = require('alexa-sdk');
const Handlers = require('./Handlers');


const APP_ID = 'amzn1.ask.skill.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

exports.handler = function(event, context, callback){
    const alexa = Alexa.handler(event, context, callback);

    alexa.appId = APP_ID;
    alexa.registerHandlers(Handlers);

    console.log(`Beginning execution for skill with APP_ID=${alexa.appId}`);
    alexa.execute();
    console.log(`Ending execution  for skill with APP_ID=${alexa.appId}`);
};