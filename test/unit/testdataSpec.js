'use strict';

var DB_URL = 'https://api.mongolab.com/api/1/databases/lk/collections';
var API_KEY = '50e30f30e4b013ed303bbea5';

beforeEach(function () {
    this.addMatchers(newsitemMatchers());
});

describe('backendURLFor database', function () {
    it('returns fixed url with database part replaced with given db name',
        function () {
            expect(backendURLFor('testdb'))
                .toBe(DB_URL + '/testdb?apiKey=' + API_KEY);
        });
});

describe('textBackendURLWith locale', function () {
    it('returns text db url with locale parameter appended with given ' +
        'locale', function () {
        expect(textBackendURLWithLocale('ch')).toBe(DB_URL +
            '/text?apiKey=' + API_KEY + '&q=%7Blocale:\'ch\'%7D');
    });
});

describe('newsitem matcher', function () {
    describe('toEqualData', function () {
        it('matches like angular.equals', function () {
            var a = { x: 1 }, b = { x: 2 }, c = { x: 2 };
            expect(angular.equals(a, b)).toBe(false);
            expect(a).not.toEqualData(b);
            expect(angular.equals(b, c)).toBe(true);
            expect(b).toEqualData(c);
        });
    });
    describe('toBeEvent', function () {
        it('matches iff the item type angular-equals \'event\' and ' +
            'is a local object', function () {
            var o = {};
            expect(o).not.toBeEvent();
            o.type = 'event';
            expect(o).not.toBeEvent();
            o.get = function () {
            };
            expect(o).toBeEvent();
            o.type = 'steven';
            expect(o).not.toBeEvent();
        });
    });
    describe('toBeGenericNewsitem', function () {
        it('matches iff the item type angular-equals \'newsitem\', is ' +
            'a local object, and property \'textBeforeLink\' is defined',
            function () {
                var o = {};
                expect(o).not.toBeGenericNewsitem();
                o.type = 'newsitem';
                expect(o).not.toBeGenericNewsitem();
                o.get = function () {
                };
                expect(o).not.toBeGenericNewsitem();
                o.textBeforeLink = '';
                expect(o).toBeGenericNewsitem();
                o.type = 'otheritem';
                expect(o).not.toBeGenericNewsitem();
            });
    });
    describe('toBeLocalizedObject', function () {
        it('matches iff the \'get\' method is defined', function () {
            var o = {};
            expect(o).not.toBeLocalizedObject();
            o.get = function () {
            };
            expect(o).toBeLocalizedObject();
        });
    });
    describe('toHaveNewsData', function () {
        var eventA = {
            eventName: 'a', placeName: 'b', location: 'c',
            eventLink: 'd', eventStart: 'e', eventEnd: 'f',
            description: 'g', type: 'event'
        };
        var eventB = {
            eventName: 'a', placeName: 'b', location: 'c',
            eventLink: 'd', eventStart: 'e', eventEnd: 'f',
            description: 'g', type: 'event'
        };
        var otherThanEventA = {
            type: 'otherThanEvent', text: 'foo', link: 'bar'
        };
        var otherThanEventB = {
            type: 'otherThanEvent', text: 'foo', link: 'bar'
        };
        describe('matching events', function () {
            it('matches iff properties \'eventName\', \'placeName\', ' +
                '\'location\', \'eventLink\', \'eventStart\', \'eventEnd\',' +
                ' and \'description\' all match', function () {
                expect(eventA).toHaveNewsData(eventB);
                eventB.description = undefined;
                expect(eventA).not.toHaveNewsData(eventB);
                eventB.description = 'notG';
                expect(eventA).not.toHaveNewsData(eventB);
                eventB.description = 'g';
                expect(eventA).toHaveNewsData(eventB);
            });
        });
        describe('matching other than events', function () {
            it('matches iff properties \'text\' and \'link\' match',
                function () {
                    expect(otherThanEventA).toHaveNewsData(otherThanEventB);
                    otherThanEventB.link = undefined;
                    expect(otherThanEventA).not.toHaveNewsData(otherThanEventB);
                    otherThanEventB.link = 'notBar';
                    expect(otherThanEventA).not.toHaveNewsData(otherThanEventB);
                    otherThanEventB.link = 'bar';
                    expect(otherThanEventA).toHaveNewsData(otherThanEventB);
                });
        });
        it('does not match if matched types differ', function () {
            eventB.type = 'bobo';
            expect(eventA).not.toHaveNewsData(eventB);
        });
    });
});
describe('index test data', function () {
    var firstNewsdataItem = indexTestData().fi.news[0];
    it('has event as a first newsdata item', function () {
        expect(firstNewsdataItem.type).toBe('event');
    });
    describe('event at the item array start', function () {
        it('has a start date', function () {
            expect(firstNewsdataItem.eventStart).toBeDefined();
        });
        it('has an end date', function () {
            expect(firstNewsdataItem.eventEnd).toBeDefined();
        });
    })
});
describe('yearFrom ISO Date string', function () {
    it('returns the UTC full year', function () {
        var _24_12_1989 = new Date('1989-12-24T00:00:00.000Z');
        expect(yearFrom(_24_12_1989)).toBe(1989);
    });
});
describe('dayDotMonthDotYearFrom ISO Date string', function () {
    it('returns the UTC date, dot, UTC month (starting from one), dot, ' +
        'and UTC full year, concatenated', function () {
        var _24_12_1989 = new Date('1989-12-24T00:00:00.000Z');
        expect(dayDotMonthDotYearFrom(_24_12_1989)).toBe('24.12.1989');
    });
});
describe('year for given year', function () {
    it('returns ISO Date string of exactly given year, all ' +
        'other values being initial', function () {
        expect(year(2009)).toBe('2009-01-01T00:00:00.000Z');
    });
});
describe('zero padding a number', function () {
    it('returns the number as string if ten or more', function () {
        expect(zeroPadded(11)).toBe('11');
    });
    it('returns zero and the number as string if less than ten',
        function () {
            expect(zeroPadded(9)).toBe('09');
        });
});
describe('month for given month and year', function () {
    it('returns ISO Date string of given year and month, all other ' +
        'values being initial', function () {
        expect(month(11, 2009)).toBe('2009-11-01T00:00:00.000Z');
    });
});
describe('date for given day, month and year', function () {
    it('returns ISO Date string of given year, month, and day, other ' +
        'values being initial', function () {
        expect(date(24, 12, 2012)).toBe('2012-12-24T00:00:00.000Z');
    });
});
describe('CV data with artistic activity section and two subsections',
    function () {
        var data = cvDataWithArtisticActivitySectionAndTwoSubSections();
        var rawData = data.raw;
        describe('artistic activity', function () {
            it('is a first-level section', function () {
                expect(rawData.artisticActivity).toBeDefined();
            });
            describe('select private exhibitions', function () {
                var selectPrivateExhibitions =
                    rawData.artisticActivity.selectPrivateExhibitions;
                it('is a first second-level section', function () {
                    expect(selectPrivateExhibitions).toBeDefined();
                });
                it('has ranged event as the first item', function () {
                    expect(data.eventRange).toEqualData(selectPrivateExhibitions
                        .values[0]);
                });
                it('has started and continuing event as second item',
                    function () {
                        expect(data.startedAndContinuingEvent).toEqualData(
                            selectPrivateExhibitions.values[1]);
                    });
                it('has ended item without start as third item', function () {
                    expect(data.endedEventWithoutStart).toEqualData(
                        selectPrivateExhibitions.values[2]);
                });
                describe('the first item', function () {
                    var firstItem = selectPrivateExhibitions.values[0];
                    it('has a start date', function () {
                        expect(firstItem.start).toBeDefined();
                    });
                    it('has an end date', function () {
                        expect(firstItem.end).toBeDefined();
                    });
                    it('has the default granularity', function () {
                        expect(firstItem.granularity).toBeUndefined();
                    });
                });
                describe('the second item', function () {
                    var secondItem = selectPrivateExhibitions.values[1];
                    it('has a start date', function () {
                        expect(secondItem.start).toBeDefined();
                    });
                    it('has no end date', function () {
                        expect(secondItem.end).toBeUndefined();
                    });
                    it('is year-granular', function () {
                        expect(secondItem.granularity).toBe('year');
                    });
                    it('is continuing', function () {
                        expect(secondItem.continuing).toBeTruthy();
                    });
                });
                describe('the third item', function () {
                    var thirdItem = selectPrivateExhibitions.values[2];
                    it('has no start date', function () {
                        expect(thirdItem.start).toBeUndefined();
                    });
                    it('has an end date', function () {
                        expect(thirdItem.end).toBeDefined();
                    });
                    it('is year-granular', function () {
                        expect(thirdItem.granularity).toBe('year');
                    });
                })
            });
            describe('group exhibitions', function () {
                var groupExhibitions =
                    rawData.artisticActivity.groupExhibitions;
                it('is a second second-level section', function () {
                    expect(groupExhibitions).toBeDefined();
                });
                it('has continuing event without dates as its first item',
                    function () {
                        expect(data.continuingEventWithoutDates)
                            .toEqualData(groupExhibitions.values[0]);
                    });
                it('has non-continuing event without dates as its second item',
                    function () {
                        expect(data.nonContinuingEventWithoutDates)
                            .toEqualData(groupExhibitions.values[1]);
                    });
                it('has continuing event with end only as its third item',
                    function () {
                        expect(data.continuingEventWithOnlyEnd)
                            .toEqualData(groupExhibitions.values[2]);
                    });
                it('has non-continuing event with start only as its fourth ' +
                    'item', function () {
                    expect(data.nonContinuingEventWithOnlyStart)
                        .toEqualData(groupExhibitions.values[3]);
                });
                it('has continuing event with start only as its fifth item',
                    function () {
                        expect(data.continuingEventWithOnlyStart)
                            .toEqualData(groupExhibitions.values[4]);
                    });
                it('has event range with same start and end year as its ' +
                    'sixth item', function () {
                    expect(data.eventRangeWithSameStartAndEndYear)
                        .toEqualData(groupExhibitions.values[5]);
                });
                it('has event range with different start and end year as its' +
                    'seventh item', function () {
                    expect(data.eventRangeWithDifferentStartAndEndYear)
                        .toEqualData(groupExhibitions.values[6]);
                });
                it('has date-granular event as its eighth item', function () {
                    expect(data.dateGranularEvent)
                        .toEqualData(groupExhibitions.values[7]);
                });
                describe('the first item', function () {
                    var item = groupExhibitions.values[0];
                    it('is continuing', function () {
                        expect(item.continuing).toBeTruthy();
                    });
                    it('has no start date', function () {
                        expect(item.start).toBeUndefined();
                    });
                    it('has no end date', function () {
                        expect(item.end).toBeUndefined();
                    });
                });
                describe('the second item', function () {
                    var item = groupExhibitions.values[1];
                    it('has default continuity', function () {
                        expect(item.continuing).toBeUndefined();
                    });
                    it('has no start date', function () {
                        expect(item.start).toBeUndefined();
                    });
                    it('has no end date', function () {
                        expect(item.end).toBeUndefined();
                    });
                });
                describe('the third item', function () {
                    var item = groupExhibitions.values[2];
                    it('has no start date', function () {
                        expect(item.start).toBeUndefined();
                    });
                    it('has an end date', function () {
                        expect(item.end).toBeDefined();
                    });
                    it('is continuing', function () {
                        expect(item.continuing).toBeTruthy();
                    });
                });
                describe('the fourth item', function () {
                    var item = groupExhibitions.values[3];
                    it('has an start date', function () {
                        expect(item.start).toBeDefined();
                    });
                    it('is month-granular', function () {
                        expect(item.granularity).toBe('month');
                    });
                    it('has no end date', function () {
                        expect(item.end).toBeUndefined();
                    });
                    it('is non-continuing', function () {
                        expect(item.continuing).toBeFalsy();
                    });
                });
                describe('the fifth item', function () {
                    var item = groupExhibitions.values[4];
                    it('has a start date', function () {
                        expect(item.start).toBeDefined();
                    });
                    it('is month-granular', function () {
                        expect(item.granularity).toBe('month');
                    });
                    it('has no end date', function () {
                        expect(item.end).toBeUndefined();
                    });
                    it('is continuing', function () {
                        expect(item.continuing).toBeTruthy();
                    });
                });
                describe('the sixth item', function () {
                    var item = groupExhibitions.values[5];
                    it('is month-granular', function () {
                        expect(item.granularity).toBe('month');
                    });
                    it('has a start date', function () {
                        expect(item.start).toBeDefined();
                    });
                    it('has an end date', function () {
                        expect(item.end).toBeDefined();
                    });
                    it('has the same year in start and end dates',
                        function () {
                            expect(item.start.indexOf(item.end.substr(0,4)))
                                .toBe(0);
                        });
                    it('is continuing', function () {
                        expect(item.continuing).toBeTruthy();
                    });
                });
                describe('the seventh item', function () {
                    var item = groupExhibitions.values[6];
                    it('is month-granular', function () {
                        expect(item.granularity).toBe('month');
                    });
                    it('has a start date', function () {
                        expect(item.start).toBeDefined();
                    });
                    it('has an end date', function () {
                        expect(item.end).toBeDefined();
                    });
                    it('has a different year in start and end dates',
                        function () {
                            expect(item.start.substr(0,4)).not.toEqual(
                                item.end.substr(0,4));
                        });
                    it('is continuing', function () {
                        expect(item.continuing).toBeTruthy();
                    });
                });
                describe('the eighth item', function () {
                    var item = groupExhibitions.values[7];
                    it('has a start date', function () {
                        expect(item.start).toBeDefined();
                    });
                    it('has no end date', function () {
                        expect(item.end).toBeUndefined();
                    });
                    it('is date-granular', function () {
                        expect(item.granularity).toBe('day');
                    });
                    it('is not continuing', function () {
                        expect(item.continuing).toBeFalsy();
                    });
                });
            });
        });
    });

describe('cv item test data', function () {
    describe('section, subsection and 28 items', function () {
        var data = cvItemTestData().sectionSubsectionAnd28Items;
        it('has section as a first item', function () {
            expect(data[0].type).toBe('section');
        });
        it('has subsection as a second item', function () {
            expect(data[1].type).toBe('subsection');
        });
        it('has items as third to 31st next items', function () {
            for (var idx = 2; idx <= 29; idx++) {
                expect(data[idx].type).toBe('item');
            }
        });
    });
    describe('section, subsection, 5 items, section and an item', function () {
        var data = cvItemTestData().sectionSubsection5ItemsSectionAndAnItem;
        it('has a section as a first item', function () {
            expect(data[0].type).toBe('section');
        });
        it('has a subsection as a second item', function () {
            expect(data[1].type).toBe('subsection');
        });
        it('has items as third to seventh next items', function () {
            for (var idx = 2; idx <= 6; idx++) {
                expect(data[idx].type).toBe('item');
            }
        });
        it('has a section as an eighth item', function () {
            expect(data[7].type).toBe('section');
        });
        it('has an item as a ninth item', function () {
            expect(data[8].type).toBe('item');
        });
    });
    describe('section, subsection, 5 items, subsection and an item',
        function () {
            var data = cvItemTestData()
                .sectionSubsection5ItemsSubsectionAndAnItem;
            it('has a section as a first item', function () {
                expect(data[0].type).toBe('section');
            });
            it('has a subsection as a second item', function () {
                expect(data[1].type).toBe('subsection');
            });
            it('has items as third to seventh next items', function () {
                for (var idx = 2; idx <= 6; idx++) {
                    expect(data[idx].type).toBe('item');
                }
            });
            it('has a subsection as an eighth item', function () {
                expect(data[7].type).toBe('subsection');
            });
            it('has an item as a ninth item', function () {
                expect(data[8].type).toBe('item');
            });
        });
    describe('section, subsection, 4 items, section , subsection, and an item',
        function () {
            var data = cvItemTestData()
                .sectionSubsection4ItemsSectionSubsectionAndAnItem;
            it('has section as a first item', function () {
                expect(data[0].type).toBe('section');
            });
            it('has subsection as a second item', function () {
                expect(data[1].type).toBe('subsection');
            });
            it('has items as third to sixth next items', function () {
                for (var idx = 2; idx <= 5; idx++) {
                    expect(data[idx].type).toBe('item');
                }
            });
            it('has section as an seventh item', function () {
                expect(data[6].type).toBe('section');
            });
            it('has subsection as an eighth item', function () {
                expect(data[7].type).toBe('subsection');
            });
            it('has an item as a ninth item', function () {
                expect(data[8].type).toBe('item');
            });
        });
});
