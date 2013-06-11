'use strict';

describe('backendURLFor database', function () {
    it('returns fixed url with database part replaced with given db name',
        function () {
            // TODO
        });
});

describe('textBackendURLWith locale', function () {
    it('returns text db url with locale parameter appended with given ' +
        'locale', function () {
        // TODO
    });
});

describe('newsitem matcher', function () {
    describe('toEqualData', function () {
        it('matches like angular.equals', function () {
            // TODO
        });
    });
    describe('toBeEvent', function () {
        it('matches iff the item type angular-equals \'event\' and ' +
            'is a local object', function () {
            // TODO
        });
    });
    describe('toBeGenericNewsitem', function () {
        it('matches iff the item type angular-equals \'newsitem\', is ' +
            'a local object, and property \'textBeforeLink\' is defined',
            function () {
                // TODO
            });
    });
    describe('toBeLocalizedObject', function () {
        it('matches iff the \'get\' method is defined', function () {
            // TODO
        });
    });
    describe('toHaveNewsData', function () {
        it('does not match if matched types differ', function () {
            // TODO
        });
        describe('matching events', function () {
            it('matches iff properties \'eventName\', \'placeName\', ' +
                '\'location\', \'eventLink\', \'eventStart\', \'eventEnd\',' +
                ' and \'description\' all match', function () {
                // TODO
            });
        });
        describe('matching other than events', function () {
            it('matches iff properties \'text\' and \'link\' match',
                function () {
                    // TODO
                });
        });
    });
});
describe('index test data', function () {
    it('has event as a first newsdata item', function () {
        // TODO
    });
    describe('event at the item array start', function () {
        it('has a start date', function () {
            // TODO
        });
        it('has an end date', function () {
            // TODO
        });
    })
});
describe('yearFrom ISO Date string', function () {
    it('returns the UTC full year', function () {
        // TODO
    });
});
describe('dayDotMonthDotYearFrom ISO Date string', function () {
    it('returns the UTC date, dot, UTC month (starting from one), dot, ' +
        'and UTC full year, concatenated', function () {
        // TODO
    });
});
describe('year for given year', function () {
    it('returns ISO Date string of exactly given year, all ' +
        'other values being initial', function () {
        // TODO
    });
});
describe('zero padding a number', function () {
    it('returns the number as string if ten or more', function () {
        // TODO
    });
    it('returns zero and the number as string if less than ten',
        function () {
            // TODO
        });
});
describe('month for given month and year', function () {
    it('returns ISO Date string of given year and month, all other ' +
        'values being initial', function () {
        // TODO
    });
});
describe('date for given day, month and year', function () {
    it('returns ISO Date string of given year, month, and day, other ' +
        'values being initial', function () {
        // TODO
    });
});
describe('CV data with artistic activity section and two subsections',
    function () {
        describe('artistic activity', function () {
            it('is a first-level section', function () {

            });
            describe('select private exhibitions', function () {
                it('is a first second-level section', function () {

                });
                describe('ranged event', function () {
                    it('is the first item', function () {

                    });
                    it('has a start date', function () {

                    });
                    it('has an end date', function () {

                    });
                    it('has the default granularity', function () {

                    });
                });
                describe('started and continuing event', function () {
                    it('is the second item', function () {

                    });
                    it('has a start date', function () {

                    });
                    it('has no end date', function () {

                    });
                    it('is year-granular', function () {

                    });
                    it('is continuing', function () {

                    });
                });
                describe('ended event without start', function () {
                    it('is the third item', function () {

                    });
                    it('has no start date', function () {

                    });
                    it('has an end date', function () {

                    });
                    it('is year-granular', function () {

                    });
                })
            });
            describe('group exhibitions', function () {
                it('is a second second-level section', function () {
                    describe('continuing event without dates', function () {
                        it('is the first item', function () {

                        });
                        it('is continuing', function () {

                        });
                        it('has no start date', function () {

                        });
                        it('has no end date', function () {

                        });
                    });
                    describe('non-continuing event without dates',
                        function () {
                            it('is the second item', function () {

                            });
                            it('has default continuity', function () {

                            });
                            it('has no start date', function () {

                            });
                            it('has no end date', function () {

                            });
                        });
                    describe('continuing event with only end', function () {
                        it('is the third item', function () {

                        });
                        it('has no start date', function () {

                        });
                        it('has an end date', function () {

                        });
                        it('is continuing', function () {

                        });
                    });
                    describe('non-continuing event with only start',
                        function () {
                            it('is the fourth item', function () {

                            });
                            it('has an start date', function () {

                            });
                            it('is month-granular', function () {

                            });
                            it('has no end date', function () {

                            });
                            it('is continuing', function () {

                            });
                        });
                    describe('continuing event with only start',
                        function () {
                            it('is the fifth item', function () {

                            });
                            it('has a start date', function () {

                            });
                            it('is month-granular', function () {

                            });
                            it('has no end date', function () {

                            });
                            it('is continuing', function () {

                            });
                        });
                    describe('event range with same start end end year',
                        function () {
                            it('is the sixth item', function () {

                            });
                            it('is month-granular', function () {

                            });
                            it('has a start date', function () {

                            });
                            it('has an end date', function () {

                            });
                            it('has the same year in start and end dates',
                                function () {

                                });
                            it('is continuing', function () {

                            });
                        });
                    describe('event range with different ' +
                        'start and end year', function () {
                        it('is the seventh item', function () {

                        });
                        it('is month-granular', function () {

                        });
                        it('has a start date', function () {

                        });
                        it('has an end date', function () {

                        });
                        it('has a different year in start and end dates',
                            function () {

                            });
                        it('is continuing', function () {

                        });
                    });
                    describe('date-granular event', function () {
                        it('is the eighth item', function () {

                        });
                        it('has a start date', function () {

                        });
                        it('has no end date', function () {

                        });
                        it('is date-granular', function () {

                        });
                        it('is not continuing', function () {

                        });
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
