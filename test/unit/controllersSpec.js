'use strict';

describe('LK controllers', function () {

    beforeEach(function () {
        this.addMatchers({
            toEqualData:function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    var newsInitCalled = false, cfgInitCalled = false, textInitCalled = false,
        cvInitCalled,
        textMockData = {
            init:function () {
                textInitCalled = true;
            }
        }, newsMockData = {
            init:function () {
                newsInitCalled = true;
            }
        }, cfgMockData = {
            init:function () {
                cfgInitCalled = true;
            }
        }, cvMockData = {
            init:function (data) {
                cvInitCalled = true;
            }
        };

    angular.module('lk.mockData', ['ngResource'])
        .factory('NewsData', function () {
            return newsMockData;
        })
        .factory('CfgData', function () {
            return cfgMockData;
        })
        .factory('TextData', function () {
            return textMockData;
        })
        .factory('CVData', function () {
            return cvMockData;
        })
        .factory('WorksData', function () {
            return {
                "data":'works'
            };
        });

    beforeEach(module('lk.mockData'));
    beforeEach(module('lk.controllers'));

    describe('IndexCtrl', function () {
        var scope = {}, locale = { "id":"en-us" }, newsService, cfgService,
            textService, sut;

        beforeEach(
            inject(function ($rootScope, $controller, CfgData, TextData, NewsData) {
                scope = $rootScope.$new();
                sut = $controller('IndexCtrl', {$scope:scope});
                newsService = NewsData;
                textService = TextData;
                cfgService = CfgData;
            }));

        it('should have an injected news object in scope', function () {
            expect(scope.news).toEqualData(newsService);
        });

        it('should have an injected cfg object in scope', function () {
            expect(scope.cfg).toEqualData(cfgService);
        });

        it('should have an injected text object in scope', function () {
            expect(scope.text).toEqualData(textService);
        });

        it('should initialize the news object', function () {
            expect(scope.news).toEqualData(newsMockData);
            expect(newsInitCalled).toBe(true);
        });

        it('should initialize the text object', function () {
            expect(scope.text).toEqualData(textMockData);
            expect(textInitCalled).toBe(true);
        });

        it('should initialize the cfg object', function () {
            expect(scope.cfg).toEqualData(cfgMockData);
            expect(cfgInitCalled).toBe(true);
        });
    });

    describe('CVCtrl', function () {
        var scope = {}, locale = { "id":"en-us" }, textService, cvService, sut;

        beforeEach(
            inject(function ($rootScope, $controller, TextData, CVData) {
                scope = $rootScope.$new();
                sut = $controller('CVCtrl', {$scope:scope});
                cvService = CVData;
                textService = TextData;
            }));

        it('should have an injected text object in scope', function () {
            expect(scope.text).toEqualData(textService);
        });

        it('should have an injected cv object in scope', function () {
            expect(scope.cv).toEqualData(cvService);
        })

        it('should initialize the cv object', function () {
            expect(scope.cv).toEqualData(cvMockData);
            expect(cvInitCalled).toBe(true);
        });

        it('should initialize the text object', function () {
            expect(scope.text).toEqualData(textMockData);
            expect(textInitCalled).toBe(true);
        });

        it('should set scope property currentPage to given number ' +
            'when setPage is called in scope', function () {
            scope.setPage(43);
            expect(scope.currentPage).toBe(43);
        });

        it('should set scope property cvPage to scope property page ' +
            'plus given number ' +
            'when setPage is called in scope', function () {
            var page43 = { "page":43 };
            scope.page43 = page43;
            scope.setPage(43);
            expect(scope.cvPage).toEqual(page43);
        });

        it('should set scope property cvPage to scope property page ' +
            'plus given number when selectPageHandler is called', function () {
            var page43 = { "page":43 };
            scope.page43 = page43;
            scope.selectPageHandler(43);
            expect(scope.cvPage).toEqual(page43);
        });

        it('should paginate the data after the initialization call if ' +
            'there is no object of property page and current page number ' +
            'in scope and flattened data exists in the received data',
            function () {
                // TODO
            });

        it('should have ten lines per page if it is page one', function () {
            // TODO
        });

        it('should have twenty lines per page if it is anything but page one',
            function () {
                // TODO
            });

        it('should change the current cv line type to the encountered line ' +
            'if the line type is \'type\'', function () {
            // TODO
        });

        it('should wipe out the current cv line subtype if the encountered ' +
            'line type is \'type\'', function () {
            // TODO
        });

        it('should change the current cv line subtype to the encountered ' +
            'line if the line type is \'subtype\'', function () {
            // TODO
        });

        it('should include the line to the page if the line length of page ' +
            'is less or equal to maximum page length', function () {
            // TODO
        });

        it('should exclude the last line of the page if the encountered ' +
            'line does not fit to page and the last line is of type ' +
            '\'subtype\'', function () {
            // TODO
        });

        it('should exclude the last line of the page if the encountered ' +
            'line does not fit to page and the last line is of type ' +
            '\'type\'', function () {
            // TODO
        });

        it('should exclude the last two lines of the page if the encountered ' +
            'line does not fit to page and the last two lines are of types ' +
            '\'type\' and \'subtype\', respectively', function () {
            // TODO
        });

        it('should store the current lines to scope property page plus ' +
            'current page number if the encountered line does not fit to page',
            function () {
                // TODO
            });

        it('should add the encountered line to a new page if the encountered ' +
            'line does not fit the current page', function () {
            // TODO
        });

        it('should add the current cv line type to start of a new page if ' +
            'the encountered line does not fit the current page', function () {
            // TODO
        });

        it('should add the current cv line subtype after the current line ' +
            'type if the encountered line does not fit the current page and ' +
            'a current cv line subtype exists', function () {
            // TODO
        });

        it('should set noOfPages scope property to number of pages',
            function () {
                // TODO
            });

        it('should initially set the current page to one', function () {
            // TODO
        });

        it('should count the cv line as taking two lines of space if ' +
            'the line type is other than \'line\'', function () {
            // TODO
        });
    });

    describe('WorksCtrl', function () {
        var scope = {}, locale = { "id":"en-us" },
            textService, worksService, sut;

        beforeEach(
            inject(function ($rootScope, $controller, TextData, WorksData) {
                scope = $rootScope.$new();
                sut = $controller('WorksCtrl', {$scope:scope});
                worksService = WorksData;
                textService = TextData;
            }));


        it('should have an injected cv object in scope', function () {
            expect(scope.works).toEqualData(worksService);
        });
    });
});
