"use strict";
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Querystring = require('querystring');
const { JSDOM } = require("jsdom");

class WikiQuotes {
    constructor(apiEndpoint, options) {
        this.apiEndpoint = apiEndpoint || 'https://en.wikiquote.org/w/api.php';

        this.options = Object.assign({
            sectionsRegexFilter: "^[1](\\.?[0-9])*$"
        }, options || {});
    }

    getRandomQuote(author, successHandler, errorHandler) {
        const self = this;


        const selectRandomQuote = function() {
            const randomQuoteNum = Math.floor(Math.random()*quotes.quotes.length);
            successHandler({ titles: quotes.titles, quote: quotes.quotes[randomQuoteNum] });
        };

        const getQuotesFromRandomSection = function(pageId, sections) {
            const randomSectionNum = Math.floor(Math.random()*sections.sections.length);
            self.getQuotesForSection(pageId, sections.sections[randomSectionNum], selectRandomQuote, errorHandler);
        };

        const getSectionsForPage = function(pageid) {
            self.getSections(
                pageid,
                self.options.sectionsRegexFilter,
                function(sections) {
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
                let sections = [];
                let title;
                try {
                    const result = JSON.parse(responseText);
                    const quotes = result.parse.text["*"];

                    console.log(quotes);

                    //const dom = new JSDOM(quotes);
                    //console.log(dom.window.document.querySelector("li").textContent);



                    /*const dom = (new DomParser()).parseFromString(quotes);

                    let $li = dom.getElementsByTagName('li');

                    for(let i in $li) {
                        if($li.hasOwnProperty(i)) {
                            console.log($li[i].innerHTML);
                        }
                    }*/




                } catch (e) {
                    _handleError(e);
                }
                /*
                                if(sections.length === 0) {
                                    _handleError('No quotes found on page '+(title||'with id: '+pageid));
                                    return;
                                }

                                //successHandler({ title: title, sections: sections });*/
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
            successHandler: function(responseText) {

                let pageid = null;

                try {
                    const result = JSON.parse(responseText);
                    for (let p in result.query.pages) {
                        if(result.query.pages.hasOwnProperty(p)) {
                            if(!result.query.pages[p].hasOwnProperty('missing')) {
                                pageid = result.query.pages[Object.keys(result.query.pages)[0]].pageid;
                                break;
                            }
                        }
                    }
                } catch (e) {
                    _handleError(e);
                }

                if(pageid === null) {
                    _handleError('No quotes found for '+titles);
                    return;
                }

                successHandler(pageid);
            },
            errorHandler: errorHandler,
        });
    };

    getSections(pageid, sectionsFilter, successHandler, errorHandler) {
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
                    title = result.parse.title;
                    for(let s in result.parse.sections) {
                        if(result.parse.sections.hasOwnProperty(s)) {
                            if(typeof sectionsFilter !== "undefined") {
                                const regExp = new RegExp(sectionsFilter);
                                if(regExp.exec(result.parse.sections[s].number) === null) {
                                    continue
                                }
                            }
                            sections.push(result.parse.sections[s].index);
                        }
                    }
                } catch (e) {
                    _handleError(e);
                }

                if(sections.length === 0) {
                    _handleError('No quotes found on page '+(title||'with id: '+pageid));
                    return;
                }

                successHandler({ title: title, sections: sections });
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

    if(options.method === "GET" && Object.keys(options.data).length > 0) {
        options.url = options.url + '?' + Querystring.stringify(options.data);
    }

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = options.withCredentials;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 300) {
                options.successHandler(this.responseText);
            } else {
                options.errorHandler(this.responseText || this.statusText || 'Error: '+this.status);
            }
        }
    });

    xhr.open(options.method, options.url);

    xhr.send();
}

module.exports = WikiQuotes;