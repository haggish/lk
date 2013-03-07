'use strict';

describe('LK domain objects', function () {

    beforeEach(function () {
        this.addMatchers(newsitemMatchers());
    });

    beforeEach(module('lk.services'));


    var newsService, $httpBackend, locale;

    var triggerRESTResourceLoad = function () {
        newsService.init();
        $httpBackend.flush();
    };

    var firstNewsObject = function () {
        return newsService.data[0];
    };

    var makeBackendReturnNews = function (json) {
        $httpBackend.expectGET(backendURLFor('news')).respond(json);
        triggerRESTResourceLoad();
    };

    var textBeforeLink = 'example text before ',
        linkDescription = 'link', textAfterLink = ' and after',
        oneNewsitemHavingTextProperty = [
            {
                "type":"newsitem",
                "text":textBeforeLink + '[[' + linkDescription + ']]' +
                    textAfterLink
            }
        ], oneNewsitemHavingNewsitemTextWithoutLink = [
            {
                "type":"newsitem",
                "text":"text without link"
            }
        ], oneNewsitemHavingTextsProperty = [
            {
                "type":"newsitem",
                "texts":{
                    "fi":"esimerkkiteksti ennen [[linkkiä]] ja jälkeen",
                    "en":textBeforeLink + '[[' + linkDescription + ']]' +
                        textAfterLink
                }
            }
        ], oneEvent = [ indexTestData().en.news[0] ];


    beforeEach(inject(function (NewsData, _$httpBackend_, $locale) {
        newsService = NewsData;
        $httpBackend = _$httpBackend_;
        locale = $locale;
    }));


    describe('localizedObject', function () {

        it('returns property of requested name with \'get\' ' +
            'if the property exists', function () {
            makeBackendReturnNews(oneNewsitemHavingTextProperty);
            expect(firstNewsObject().get('text')).toBe(firstNewsObject().text);
        });

        it('returns \'fi\' subproperty of pluralized version of ' +
            'requested property with \'get\' if ' +
            'it exists, property of requested property doesn\'t, ' +
            'and locale ID contains \'fi\'', function () {
            locale.id = 'fi';
            makeBackendReturnNews(oneNewsitemHavingTextsProperty);
            expect(firstNewsObject().get('text'))
                .toBe(firstNewsObject().texts.fi);
        });

        it('returns \'en\' subproperty of pluralized version of ' +
            'requested property with \'get\' if ' +
            'it exists, property of requested property doesn\'t, ' +
            'and locale ID doesn\'t contain \'fi\'',
            function () {
                locale.id = 'cn';
                makeBackendReturnNews(oneNewsitemHavingTextsProperty);
                expect(firstNewsObject().get('text'))
                    .toBe(firstNewsObject().texts.en);
            });
    });

    describe('genericNewsitem', function () {
        it('is of type \'newsitem\'', function () {
            makeBackendReturnNews(oneNewsitemHavingTextProperty);
            expect(firstNewsObject().type).toBe('newsitem');
        });

        it('is a localized object', function () {
            makeBackendReturnNews(oneNewsitemHavingTextProperty);
            expect(firstNewsObject().get).toBeDefined();
        });

        it('has text before link that equals text before text wrapped in ' +
            'square braces, if there is such wrapped text',
            function () {
                makeBackendReturnNews(oneNewsitemHavingTextProperty);
                expect(firstNewsObject().textBeforeLink).toBe(textBeforeLink);
            });

        it('has text before link that equals the whole text if there is ' +
            'no text wrapped in square braces', function () {
            makeBackendReturnNews(oneNewsitemHavingNewsitemTextWithoutLink);
            expect(firstNewsObject().textBeforeLink)
                .toBe(firstNewsObject().text);
        });

        it('has link description that equals text wrapped in square braces, ' +
            'if there is such wrapped text',
            function () {
                makeBackendReturnNews(oneNewsitemHavingTextProperty);
                expect(firstNewsObject().linkDescription).toBe(linkDescription);
            });

        it('has text after link that equals text after text wrapped in ' +
            'square braces, if there is such wrapped text, ' +
            'and text after that', function () {
            makeBackendReturnNews(oneNewsitemHavingTextProperty);
            expect(firstNewsObject().textAfterLink).toBe(textAfterLink);
        });
    });

    describe('event', function () {
        it('is of type \'event\'', function () {
            makeBackendReturnNews(oneEvent);
            expect(firstNewsObject().type).toBe('event');
        });

        it('is a localized object', function () {
            makeBackendReturnNews(oneEvent);
            expect(firstNewsObject().get).toBeDefined();
        });

        it('should display start time string in format ' +
            'day-dot-month-dot-year from event start date', function () {
            makeBackendReturnNews(oneEvent);
            expect(firstNewsObject().eventStartString()).toBe('31.3.2012');
        });

        it('should display end time string in format ' +
            'day-dot-month-dot-year from event end date', function () {
            makeBackendReturnNews(oneEvent);
            expect(firstNewsObject().eventEndString()).toBe('28.4.2012');
        });
    });
})
