"use strict";
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Querystring = require('querystring');
const DOMParser = require('xmldom').DOMParser;

const QUOTE_LENGTH_LIMIT = 25;

class WikiQuotes {
    constructor(apiEndpoint, options) {
        this.apiEndpoint = apiEndpoint || 'https://en.wikiquote.org/w/api.php';

        this.options = Object.assign({
            quotesSection: "1",
        }, options || {});
    }

    getRandomQuote(author, successHandler, errorHandler) {

        errorHandler = errorHandler || _handleError;
        successHandler = successHandler || console.log;

        const self = this;


        const selectRandomQuote = function (quotes) {
            const randomQuoteNum = Math.floor(Math.random() * quotes.quotes.length);
            successHandler({author: quotes.title, text: quotes.quotes[randomQuoteNum]});
        };

        const getQuotesFromRandomSection = function (pageId, sections) {
            const randomSectionNum = Math.floor(Math.random() * sections.sections.length);
            self.getQuotesForSection(
                pageId,
                sections.sections[randomSectionNum],
                selectRandomQuote,
                errorHandler
            );
        };

        const getSectionsForPage = function (pageid) {
            self.getSections(
                pageid,
                self.options.quotesSection,
                function (sections) {
                    getQuotesFromRandomSection(pageid, sections);
                },
                errorHandler);
        };

        this.queryTitles(
            author,
            getSectionsForPage,
            errorHandler
        );
    };


    getQuotesForSection(pageid, sectionIndex, successHandler, errorHandler) {
        _sendXMLHttpRequest({
            url: this.apiEndpoint,
            data: {
                format: "json",
                action: "parse",
                noimages: "",
                pageid: pageid,
                section: sectionIndex,
            },
            successHandler: function (responseText) {

                let quotes = [];
                let title;
                try {
                    const result = JSON.parse(responseText);

                    title = result.parse.title;

                    const quotesHtml = result.parse.text["*"];

                    const doc = new DOMParser().parseFromString(quotesHtml);


                    const lis = _findFirstLevelLi(doc.documentElement);

                    for (let i in lis) {
                        if (lis.hasOwnProperty(i)) {

                            let quote = _findText(lis[i]);

                            quote = _reformatQuote(quote);

                            quotes.push(quote);
                        }
                    }

                } catch (e) {
                    errorHandler(e);
                }

                if (quotes.length === 0) {
                    errorHandler('No quotes found in section ' + sectionIndex + ' on page ' + (title || 'with id: ' + pageid));
                    return;
                }

                successHandler({title: title, quotes: quotes});
            },
            errorHandler: errorHandler,
        });
    };


    queryTitles(titles, successHandler, errorHandler) {
        _sendXMLHttpRequest({
            url: this.apiEndpoint,
            data: {
                format: "json",
                action: "query",
                redirects: "",
                titles: titles,
            },
            successHandler: function (responseText) {

                let pageid = null;

                try {
                    const result = JSON.parse(responseText);
                    for (let p in result.query.pages) {
                        if (result.query.pages.hasOwnProperty(p)) {
                            if (!result.query.pages[p].hasOwnProperty('missing')) {
                                pageid = result.query.pages[Object.keys(result.query.pages)[0]].pageid;
                                break;
                            }
                        }
                    }
                } catch (e) {
                    errorHandler(e);
                }

                if (pageid === null) {
                    errorHandler('No quotes found for ' + titles);
                    return;
                }

                successHandler(pageid);
            },
            errorHandler: errorHandler,
        });
    };

    getSections(pageid, quotesSection, successHandler, errorHandler) {
        _sendXMLHttpRequest({
            url: this.apiEndpoint,
            data: {
                format: "json",
                action: "parse",
                prop: "sections",
                pageid: pageid,
            },
            successHandler: function (responseText) {
                let sections = [];
                let title;
                try {
                    const result = JSON.parse(responseText);
                    //console.log(responseText);
                    title = result.parse.title;

                    let primarySectionIndex;

                    // Getting only subsections that matches the configured quotes section
                    for (let s in result.parse.sections) {
                        if (result.parse.sections.hasOwnProperty(s)) {
                            let splitNum = result.parse.sections[s].number.split('.');
                            if (splitNum.length > 1 && splitNum[0] === quotesSection) {
                                sections.push(result.parse.sections[s].index);
                            } else if (splitNum.length === 1 && splitNum[0] === quotesSection) {
                                primarySectionIndex = result.parse.sections[s].index;
                            }
                        }
                    }

                    // If the main section has no subsection we use the main section instead
                    if (sections.length === 0) {
                        sections.push(primarySectionIndex);
                    }

                } catch (e) {
                    errorHandler(e);
                }

                if (sections.length === 0) {
                    errorHandler('No quotes found on page ' + (title || 'with id: ' + pageid));
                    return;
                }

                successHandler({title: title, sections: sections});
            },
            errorHandler: errorHandler,
        });
    };
}


function _handleError(errorMessage) {
    console.error(errorMessage);
}

function _sendXMLHttpRequest(options) {
    options.method = options.method || "GET";
    options.withCredentials = options.withCredentials || true;
    options.data = options.data || {};

    if (options.method === "GET" && Object.keys(options.data).length > 0) {
        options.url = options.url + '?' + Querystring.stringify(options.data);
    }

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = options.withCredentials;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 300) {
                options.successHandler(this.responseText);
            } else {
                options.errorHandler(this.responseText || this.statusText || 'Error: ' + this.status);
            }
        }
    });

    xhr.open(options.method, options.url);

    xhr.send();
}


function _findFirstLevelLi(element) {
    let lis = [];

    if(element.nodeName === 'dl') {
        return lis;
    }

    if(element.nodeName === 'li') {
        lis.push(element);
    } else {
        for(let i in element.childNodes) {
            if(element.childNodes.hasOwnProperty(i)) {
                lis = lis.concat(_findFirstLevelLi(element.childNodes[i]));
            }
        }
    }

    return lis;
}

function _reformatQuote(quote) {

    let start = quote.indexOf('"');

    if(start >= 0) {
        let end = quote.indexOf('"', start+1);
        quote = quote.substring(start, end-start+1);
    }

    quote = quote.replace('"', '');

    if(quote.length > QUOTE_LENGTH_LIMIT) {
        return quote.substring(0, quote.indexOf('.', QUOTE_LENGTH_LIMIT)+1);
    }
}

function _findText(element) {
    let text = '';

    for(let i in element.childNodes) {
        if(element.childNodes.hasOwnProperty(i)) {
            text += element.childNodes[i].data || '';
            if (element.childNodes[i].nodeName !== 'li') {
                text += _findText(element.childNodes[i]);
            }
        }
    }

    return text;
    //return element.toString();
}

module.exports = WikiQuotes;