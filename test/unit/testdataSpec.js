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
            it('has artistic activity as first-level section', function () {
                // TODO
            });
            it('has select private exhibitions as first second-level section',
                function () {
                    // TODO
                });
            it('has group exhibitions as second second-level section',
                function () {
                    // TODO
                });
        });
    // TODO more ...
});
