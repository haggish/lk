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

    function theOneReturnedNews() {
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
        ], oneEvent = [ indexTestData().en.news[0] ],
        eventStartIn = function (event) {
            return event[0].eventStart;
        }, eventEndIn = function (event) {
            return event[0].eventEnd;
        };


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
            expect(theOneReturnedNews().get('text')).toBe(theOneReturnedNews().text);
        });

        it('returns \'fi\' subproperty of pluralized version of ' +
            'requested property with \'get\' if ' +
            'it exists, property of requested property doesn\'t, ' +
            'and locale ID contains \'fi\'', function () {
            locale.id = 'fi';
            makeBackendReturnNews(oneNewsitemHavingTextsProperty);
            expect(theOneReturnedNews().get('text'))
                .toBe(theOneReturnedNews().texts.fi);
        });

        it('returns \'en\' subproperty of pluralized version of ' +
            'requested property with \'get\' if ' +
            'it exists, property of requested property doesn\'t, ' +
            'and locale ID doesn\'t contain \'fi\'',
            function () {
                locale.id = 'cn';
                makeBackendReturnNews(oneNewsitemHavingTextsProperty);
                expect(theOneReturnedNews().get('text'))
                    .toBe(theOneReturnedNews().texts.en);
            });
    });

    describe('genericNewsitem', function () {
        it('is of type \'newsitem\'', function () {
            makeBackendReturnNews(oneNewsitemHavingTextProperty);
            expect(theOneReturnedNews().type).toBe('newsitem');
        });

        it('is a localized object', function () {
            makeBackendReturnNews(oneNewsitemHavingTextProperty);
            expect(theOneReturnedNews()).toBeLocalizedObject();
        });

        it('has text before link that equals text before text wrapped in ' +
            'square braces, if there is such wrapped text',
            function () {
                makeBackendReturnNews(oneNewsitemHavingTextProperty);
                expect(theOneReturnedNews().textBeforeLink).toBe(textBeforeLink);
            });

        it('has text before link that equals the whole text if there is ' +
            'no text wrapped in square braces', function () {
            makeBackendReturnNews(oneNewsitemHavingNewsitemTextWithoutLink);
            expect(theOneReturnedNews().textBeforeLink)
                .toBe(theOneReturnedNews().text);
        });

        it('has link description that equals text wrapped in square braces, ' +
            'if there is such wrapped text',
            function () {
                makeBackendReturnNews(oneNewsitemHavingTextProperty);
                expect(theOneReturnedNews().linkDescription).toBe(linkDescription);
            });

        it('has text after link that equals text after text wrapped in ' +
            'square braces, if there is such wrapped text, ' +
            'and text after that', function () {
            makeBackendReturnNews(oneNewsitemHavingTextProperty);
            expect(theOneReturnedNews().textAfterLink).toBe(textAfterLink);
        });
    });

    describe('event', function () {
        it('is of type \'event\'', function () {
            makeBackendReturnNews(oneEvent);
            expect(theOneReturnedNews().type).toBe('event');
        });

        it('is a localized object', function () {
            makeBackendReturnNews(oneEvent);
            expect(theOneReturnedNews()).toBeLocalizedObject();
        });

        it('should display start time string in format ' +
            'day-dot-month-dot-year from event start date', function () {
            makeBackendReturnNews(oneEvent);
            expect(theOneReturnedNews().eventStartString()).toBe(
                dayDotMonthDotYearFrom(eventStartIn(oneEvent)));
        });

        it('should display end time string in format ' +
            'day-dot-month-dot-year from event end date', function () {
            makeBackendReturnNews(oneEvent);
            expect(theOneReturnedNews().eventEndString()).toBe(
                dayDotMonthDotYearFrom(eventEndIn(oneEvent)));
        });
    });

    describe('CV', function () {

        var testData = cvDataWithArtisticActivitySectionAndTwoSubSections(),
            artisticActivitySourceData = testData.raw.artisticActivity;

        var artisticActivityDO, selectPrivateExhibitionsDO;

        beforeEach(function () {
            makeBackendReturnCVData(testData.raw);
            artisticActivityDO = cvService.flattened[0];
            selectPrivateExhibitionsDO = cvService.flattened[1];
        });

        describe('section', function () {
            describe('from a top level property', function () {
                it('is of type \'section\'', function () {
                    expect(artisticActivitySourceData).toBeDefined();
                    expect(artisticActivityDO.type).toBe('section');
                });
            });

            describe('from a second level property', function () {
                it('is of type \'subsection\'', function () {
                    expect(
                        artisticActivitySourceData.selectPrivateExhibitions)
                        .toBeDefined();
                    expect(artisticActivitySourceData.values)
                        .toBeUndefined();
                    expect(selectPrivateExhibitionsDO.type).toBe('subsection');
                });
            });

            it('is a localized object', function () {
                expect(artisticActivityDO).toBeLocalizedObject();
                expect(selectPrivateExhibitionsDO).toBeLocalizedObject();
            });

            it('has property \'title\' with ' +
                'value matching same existing cv property',
                function () {
                    expect(artisticActivitySourceData
                        .selectPrivateExhibitions.title)
                        .toBeDefined();
                    expect(selectPrivateExhibitionsDO.title).toEqual(
                        artisticActivitySourceData
                            .selectPrivateExhibitions.title);
                });

            it('has property \'titles\' with ' +
                'value matching same existing cv property',
                function () {
                    expect(artisticActivitySourceData.titles).toBeDefined();
                    expect(artisticActivityDO.titles).toEqualData(
                        artisticActivitySourceData.titles);
                });
        });

        describe('item', function () {

            var firstItemSourceData =
                artisticActivitySourceData.selectPrivateExhibitions.values[0];
            var firstItemDO = function () {
                return cvService.flattened.filter(
                    domainObjectFor(firstItemSourceData))[0];
            };

            it('is of type \'item\'', function () {
                expect(firstItemSourceData).toBeDefined();
                expect(firstItemDO().type).toBe('item');
            });

            it('is a localized object', function () {
                expect(firstItemDO()).toBeLocalizedObject();
            });

            describe('of year granularity', function () {

                it('has date string \'x - y\' if source data has start ' +
                    'and end dates with years x and y, respectively, ' +
                    'and item is not continuing', function () {
                    var eventRangeDO = cvService.flattened.filter(
                        domainObjectFor(testData.eventRange))[0];
                    expect(eventRangeDO.dateString())
                        .toBe(yearFrom(testData.eventRange.start) + ' - '
                            + yearFrom(testData.eventRange.end));
                });

                it('has date string \'x -\' if source data has start date ' +
                    'with year x but no end date and the item is continuing',
                    function () {
                        var startedAndContinuingEventDO =
                            cvService.flattened.filter(
                                domainObjectFor(
                                    testData.startedAndContinuingEvent))[0];
                        expect(startedAndContinuingEventDO.dateString())
                            .toBe(yearFrom(
                                testData.startedAndContinuingEvent.start) +
                                ' -');
                    });

                it('has date string \'- x\' if source data has no start but ' +
                    'end date with year x and the item is not continuing',
                    function () {
                        var endedEventWithoutStartDO = cvService.flattened
                            .filter(domainObjectFor(
                                testData.endedEventWithoutStart))[0];
                        expect(endedEventWithoutStartDO.dateString())
                            .toBe('- ' +
                                yearFrom(testData.endedEventWithoutStart.end));
                    });

                it('has date string of hyphen if there is ' +
                    'no start or end date and the item is continuing',
                    function () {
                        var continuingEventWithoutDatesDO = cvService.flattened
                            .filter(domainObjectFor(
                                testData.continuingEventWithoutDates))[0];
                        expect(continuingEventWithoutDatesDO.dateString())
                            .toBe('-');
                    });

                it('has blank date string if there is no start or end dates ' +
                    'and the item is not continuing', function () {
                    var nonContinuingEventWithoutDatesDO = cvService.flattened
                        .filter(domainObjectFor(
                            testData.nonContinuingEventWithoutDates))[0];
                    expect(nonContinuingEventWithoutDatesDO.dateString())
                        .toBe('');
                });

                it('has date string \'- x\' if there is no start ' +
                    'but end date x and the item is continuing', function () {
                    var continuingEventWithOnlyEndDO = cvService.flattened
                        .filter(domainObjectFor(
                            testData.continuingEventWithOnlyEnd))[0];
                    expect(continuingEventWithOnlyEndDO.dateString())
                        .toBe('- ' +
                            yearFrom(testData.continuingEventWithOnlyEnd.end));
                });
            });

            describe('of month granularity', function () {

                it('has date string \'x / y\' if source data has ' +
                    'start date with month x and year y but no end date, ' +
                    'and not continuing', function () {
                    var nonContinuingEventWithOnlyStartDO = cvService.flattened
                        .filter(domainObjectFor(
                            testData.nonContinuingEventWithOnlyStart))[0];
                    expect(nonContinuingEventWithOnlyStartDO.dateString())
                        .toBe(monthFrom(
                            testData.nonContinuingEventWithOnlyStart.start) + ' / ' +
                            yearFrom(testData.nonContinuingEventWithOnlyStart
                                .start));
                });

                it('has date string \'x / y -\' if source data has ' +
                    'start date with month x and year y but no end date, ' +
                    'and continuing', function () {
                    var continuingEventWithOnlyStartDO = cvService.flattened
                        .filter(domainObjectFor(
                            testData.continuingEventWithOnlyStart))[0];
                    expect(continuingEventWithOnlyStartDO.dateString())
                        .toBe(monthFrom(
                            testData.continuingEventWithOnlyStart.start) +
                            ' / ' + yearFrom(
                            testData.continuingEventWithOnlyStart.start) +
                            ' -');
                });

                it('has date string \'x - y / z\' if source data has ' +
                    'start and end dates with months x and y, respectively; ' +
                    'and both dates have year z', function () {
                    var eventRangeWithSameStartAndEndYearDO =
                        cvService.flattened.filter(domainObjectFor(
                            testData.eventRangeWithSameStartAndEndYear))[0];
                    expect(eventRangeWithSameStartAndEndYearDO.dateString())
                        .toBe(monthFrom(
                            testData.eventRangeWithSameStartAndEndYear.start) +
                            ' - ' + monthFrom(
                            testData.eventRangeWithSameStartAndEndYear.end) +
                            ' / ' + yearFrom(
                            testData.eventRangeWithSameStartAndEndYear.start));
                });

                it('has date string \'x / y - z / å\' if ' +
                    'source data has start and end dates with ' +
                    'months x and z, and years z and å, ' +
                    'respectively; and the years are not equal', function () {
                    var eventRangeWithDifferentStartAndEndYearDO =
                        cvService.flattened.filter(domainObjectFor(
                            testData
                                .eventRangeWithDifferentStartAndEndYear))[0];
                    expect(eventRangeWithDifferentStartAndEndYearDO
                        .dateString())
                        .toBe(monthFrom(
                            testData.eventRangeWithDifferentStartAndEndYear
                                .start) + ' / ' +
                            yearFrom(testData
                                .eventRangeWithDifferentStartAndEndYear.start) +
                            ' - ' + monthFrom(
                            testData.eventRangeWithDifferentStartAndEndYear
                                .end) + ' / ' + yearFrom(
                            testData.eventRangeWithDifferentStartAndEndYear
                                .end));
                });
            });

            describe('of day granularity', function () {
                it('has date string \'x.y.z\' where x, y and z are ' +
                    'start date, day, month and year, respectively',
                    function () {
                        var dateGranularEventDO = cvService.flattened.filter(
                            domainObjectFor(testData.dateGranularEvent))[0];
                        expect(dateGranularEventDO.dateString())
                            .toBe(dayDotMonthDotYearFrom(
                                testData.dateGranularEvent.start));
                    });
            });

            describe('of missing granularity', function () {
                it('has date string matching year granularity', function () {
                    var defaultGranularEventDO =
                        cvService.flattened.filter(
                            domainObjectFor(testData.eventRange))[0];
                    expect(defaultGranularEventDO.dateString())
                        .toBe(yearFrom(testData.eventRange.start) + ' - ' +
                            yearFrom(testData.eventRange.end));
                });
            });
        });
    });
});