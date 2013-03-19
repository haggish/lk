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

        it('should have ten items per page if it is page one', function () {
            // TODO
        });

        it('should have twenty items per page if it is anything but page one',
            function () {
                // TODO
            });

        it('should change the current cv item section to the encountered ' +
            'item if the line type is \'section\'', function () {
            // TODO
        });

        it('should wipe out the current cv item subsection if the ' +
            'encountered line type is \'section\'', function () {
            // TODO
        });

        it('should change the current cv item subsection to the encountered ' +
            'item if the line type is \'subsection\'', function () {
            // TODO
        });

        it('should include the item to the page if the item length of page ' +
            'is less or equal to maximum page length', function () {
            // TODO
        });

        it('should exclude the last item of the page if the encountered ' +
            'item does not fit to page and the last item is of type ' +
            '\'subsection\'', function () {
            // TODO
        });

        it('should exclude the last item of the page if the encountered ' +
            'item does not fit to page and the last item is of type ' +
            '\'section\'', function () {
            // TODO
        });

        it('should exclude the last two items of the page if the encountered ' +
            'item does not fit to page and the last two items are of types ' +
            '\'section\' and \'subsection\', respectively', function () {
            // TODO
        });

        it('should store the current items to scope property page plus ' +
            'current page number if the encountered item does not fit to page',
            function () {
                // TODO
            });

        it('should add the encountered item to a new page if the encountered ' +
            'item does not fit the current page', function () {
            // TODO
        });

        it('should add the current cv item section to start of a new page if ' +
            'the encountered item does not fit the current page', function () {
            // TODO
        });

        it('should add the current cv item subsection after the current item ' +
            'section if the encountered item does not fit the current page ' +
            'and a current cv item subsection exists', function () {
            // TODO
        });

        it('should set noOfPages scope property to number of pages',
            function () {
                // TODO
            });

        it('should initially set the current page to one', function () {
            // TODO
        });

        it('should count the cv item as taking two items of space if ' +
            'the item type is other than \'item\'', function () {
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
