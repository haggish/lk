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
                "type": "newsitem",
                "text": textBeforeLink + '[[' + linkDescription + ']]' +
                    textAfterLink
            }
        ], oneNewsitemHavingNewsitemTextWithoutLink = [
            {
                "type": "newsitem",
                "text": "text without link"
            }
        ], oneNewsitemHavingTextsProperty = [
            {
                "type": "newsitem",
                "texts": {
                    "fi": "esimerkkiteksti ennen [[linkkiä]] ja jälkeen",
                    "en": textBeforeLink + '[[' + linkDescription + ']]' +
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

    describe('CV', function () {

        var testData = cvDataWithArtisticActivitySectionAndTwoSubSections();

        beforeEach(function () {
            makeBackendReturnCVData(testData);
        });

        describe('section', function () {
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
                    expect(testData.artisticActivity.selectPrivateExhibitions.title).toBeDefined();
                    expect(cvService.flattened[1].title).toEqual(
                        testData.artisticActivity.selectPrivateExhibitions.title);
                });

            it('has property \'titles\' with value matching same existing cv property',
                function () {
                    expect(testData.artisticActivity.titles).toBeDefined();
                    expect(cvService.flattened[0].titles).toEqualData(testData.artisticActivity.titles);
                });
        });

        describe('item', function () {

            var privateExpos = testData.artisticActivity.selectPrivateExhibitions.values;
            var yearGranularFiniteEvent = privateExpos[0];
            var yearGranularContinuingEvent = privateExpos[1];
            var yearGranularInfiniteEndingEvent = privateExpos[2];
            var groupExpos = testData.artisticActivity.groupExhibitions.values;
            var yearGranularInfiniteContinuingEvent = groupExpos[0];
            var yearGranularInfiniteNotContinuingEvent = groupExpos[1];
            var yearGranularDefiniteContinuingEvent = groupExpos[2];

            it('is of type \'item\'', function () {
                expect(testData.artisticActivity.selectPrivateExhibitions.values[0]).toBeDefined();
                expect(cvService.flattened[2].type).toBe('item');
            });

            it('is a localized object', function () {
                expect(cvService.flattened[2].get).toBeDefined();
            });

            describe('of year granularity', function () {

                it('has date string \'x - y\' if source data has start ' +
                    'and end dates with years x and y, respectively, ' +
                    'and item is not continuing', function () {
                    expect(yearGranularFiniteEvent.start).toBe(year(2012));
                    expect(yearGranularFiniteEvent.end).toBe(year(2013));
                    expect(cvService.flattened[2].dateString()).toBe('2012 - 2013');
                });

                it('has date string \'x -\' if source data has start date with ' +
                    'year x but no end date and the item is continuing',
                    function () {
                        expect(yearGranularContinuingEvent.start).toBe(year(2011));
                        expect(yearGranularContinuingEvent.end).toBeUndefined();
                        expect(cvService.flattened[3].dateString()).toBe('2011 -');
                    });

                it('has date string \'- x\' if source data has no start but ' +
                    'end date with year x and the item is not continuing',
                    function () {
                        expect(yearGranularInfiniteEndingEvent.start).toBeUndefined();
                        expect(yearGranularInfiniteEndingEvent.end).toBe(year(2011));
                        expect(cvService.flattened[4].dateString()).toBe('- 2011');
                    });

                it('has date string of hyphen if there is no start or end date ' +
                    'and the item is continuing', function () {
                    expect(yearGranularInfiniteContinuingEvent.start).toBeUndefined();
                    expect(yearGranularInfiniteContinuingEvent.end).toBeUndefined();
                    expect(cvService.flattened[6].dateString()).toBe('-');
                });

                it('has blank date string if there is no start or end dates ' +
                    'and the item is not continuing', function () {
                    expect(yearGranularInfiniteNotContinuingEvent.start).toBeUndefined();
                    expect(yearGranularInfiniteNotContinuingEvent.end).toBeUndefined();
                    expect(cvService.flattened[7].dateString()).toBe('');
                });

                it('has date string \'- x\' if there is no start but end date x and ' +
                    'the item is continuing', function () {
                    expect(yearGranularDefiniteContinuingEvent.start).toBeUndefined();
                    expect(yearGranularDefiniteContinuingEvent.end).toBeDefined();
                    expect(cvService.flattened[8].dateString()).toBe('- 2011');
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
    });
})
