'use strict';

describe('LK domain object', function () {

    beforeEach(function () {
        this.addMatchers(newsitemMatchers());
    });

    beforeEach(module('lk.services'));


    var newsService, cvService, $httpBackend, locale;

    function triggerResourceLoadOf(service) {
        service.init();
        $httpBackend.flush();
    }

    function firstNewsObject() {
        return newsService.data[0];
    }

    function makeBackendReturnNews(json) {
        $httpBackend.expectGET(backendURLFor('news')).respond(json);
        triggerResourceLoadOf(newsService);
    }

    function makeBackendReturnCVData(json) {
        $httpBackend.expectGET(backendURLFor('cv')).respond([json]);
        triggerResourceLoadOf(cvService);
    }

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


    beforeEach(inject(function (NewsData, CVData, _$httpBackend_, $locale) {
        newsService = NewsData;
        cvService = CVData;
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

    describe('CV section', function () {

        var testData = cvDataWithArtisticActivitySectionAndTwoSubSections();

        beforeEach(function () {
            makeBackendReturnCVData(testData);
        });

        describe('of top level', function () {
            it('is of type \'section\'', function () {
                expect(testData.artisticActivity).toBeDefined();
                expect(cvService.flattened[0].type).toBe('section');
            });
        });

        describe('of second level', function () {
            it('is of type \'subsection\'', function () {
                expect(testData.artisticActivity.selectPrivateExhibitions).toBeDefined();
                expect(testData.artisticActivity.values).toBeUndefined();
                expect(cvService.flattened[1].type).toBe('subsection');
            });
        });

        it('is a localized object', function () {
            expect(cvService.flattened[0].get).toBeDefined();
        });

        it('has property \'title\' with value matching same existing cv property',
            function () {
                // TODO
            });

        it('has property \'titles\' with value matching same existing cv property',
            function () {
                // TODO
            });
    });


    describe('cv item', function () {

        it('is of type \'item\'', function () {
            // TODO
        });

        it('is a localized object', function () {
            // TODO
        });

        describe('of year granularity', function () {

            it('has date string \'x - y\' if source data has start ' +
                'and end dates with years x and y, respectively, ' +
                'and item is not continuing', function () {
                // TODO
            });

            it('has date string \'x -\' if source data has start date with ' +
                'year x but no end date and the item is continuing',
                function () {
                    // TODO
                });

            it('has date string \'- x\' if source data has no start but ' +
                'end date with year x and the item is not continuing',
                function () {
                    // TODO
                });

            it('has date string of hyphen if there is no start or end date ' +
                'and the item is continuing', function () {
                // TODO
            });

            it('has blank date string if there is no start or end dates ' +
                'and the item is not continuing', function () {
                // TODO
            });

            it('has blank date string if there is no start but end date and ' +
                'the item is continuing', function () {
                // TODO
            });
        });

        describe('of month granularity', function () {
            it('has date string \'x / y\' if source data has start date with ' +
                'month x and year y but no end date, and not continuing',
                function () {
                    // TODO
                });

            it('has date string \'x / y -\' if source data has start date ' +
                'with month x and year y but no end date, and continuing',
                function () {
                    // TODO
                });

            it('has date string \'x - y / z\' if source data has start and ' +
                'end dates with months x and y, respectively; and both dates ' +
                'have year z', function () {
                // TODO
            });

            it('has date string \'x / y - z / å\' if source data has start ' +
                'and end dates with months x and z, and years z and å, ' +
                'respectively; and the years are not equal', function () {
                // TODO
            });
        });

        describe('of day granularity', function () {
            it('has date string \'x.y.z\' where x, y and z are start date ' +
                'day, month and year, respectively', function () {
                // TODO
            });
        });

        describe('of missing granularity', function () {
            it('has date string matching year granularity', function () {
                // TODO
            });
        });
    });
})
