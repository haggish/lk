'use strict';

describe('LK controller', function () {

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    function printTypesFor(data) {
        var types = '';
        data.forEach(function (e) {
            types += e.type + '/';
        });
        return types;
    }

    var newsInitCalled = false, cfgInitCalled = false, textInitCalled = false,
        cvInitCalled, textMockData = {
            init: function () {
                textInitCalled = true;
            }
        }, newsMockData = {
            init: function () {
                newsInitCalled = true;
            }
        }, cfgMockData = {
            init: function () {
                cfgInitCalled = true;
            }
        }, cvMockData = {
            init: function (cb) {
                cvInitCalled = true;
                cb(this);
            },
            "flattened": cvItemTestData().sectionSubsectionAnd28Items
        };

    angular.module('lk.mockData', [])
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
                "data": 'works'
            };
        });

    beforeEach(module('lk.mockData'));
    beforeEach(module('lk.controllers'));

    describe('IndexCtrl', function () {
        var scope = {}, locale = { "id": "en-us" }, newsService, cfgService,
            textService, sut;

        beforeEach(
            inject(function ($rootScope, $controller, CfgData, TextData, NewsData) {
                scope = $rootScope.$new();
                sut = $controller('IndexCtrl', {$scope: scope});
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
        var scope = {}, locale = { "id": "en-us" }, textService, cvService, sut,
            makeInjectDeps = function (flattened) {
                return inject(function ($rootScope, $controller, TextData, CVData) {
                    scope = $rootScope.$new();
                    cvService = CVData;
                    if (flattened) {
                        CVData.flattened = flattened;
                    }
                    sut = $controller('CVCtrl', {$scope: scope});
                    //console.log(printTypesFor(CVData.flattened));
                    textService = TextData;
                });
            };

        describe('with any CV data', function () {
            beforeEach(makeInjectDeps());

            it('should have an injected text object in scope', function () {
                expect(scope.text).toEqualData(textService);
            });

            it('should have an injected cv object in scope', function () {
                expect(scope.cv).toEqualData(cvService);
            });

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
                var page43 = { "page": 43 };
                scope.page43 = page43;
                scope.setPage(43);
                expect(scope.cvPage).toEqual(page43);
            });

            it('should set scope property cvPage to scope property page ' +
                'plus given number when selectPageHandler is called', function () {
                var page43 = { "page": 43 };
                scope.page43 = page43;
                scope.selectPageHandler(43);
                expect(scope.cvPage).toEqual(page43);
            });

            it('should add the current cv item section to start of a new page',
                function () {
                    expect(scope.page1.length).toBe(8);
                    expect(scope.page2[0]).toEqualData(cvItemTestData().sectionSubsectionAnd28Items[0]);
                });

            it('should add the current cv item subsection after the current item ' +
                'section if it exists', function () {
                expect(scope.page1.length).toBe(8);
                expect(scope.page2[1]).toEqualData(cvItemTestData().sectionSubsectionAnd28Items[1]);
            });

            it('should set noOfPages scope property to number of pages',
                function () {
                    expect(scope.noOfPages).toBe(3);
                });

            it('should initially set the current page to one', function () {
                expect(scope.currentPage).toBe(1);
            });
        });

        describe('with cv data that has section item that is ' +
            'bumped to the second page', function () {
            beforeEach(makeInjectDeps(cvItemTestData().sectionSubsection5ItemsSectionAndAnItem));

            it('should exclude the last fitting item of the page if the encountered ' +
                'item is of type \'section\'', function () {
                expect(scope.page1.length).toBe(7);
            });
        });

        describe('with cv data that has subsection item in the first page that is ' +
            'bumped to the second page', function () {
            beforeEach(makeInjectDeps(cvItemTestData().sectionSubsection5ItemsSubsectionAndAnItem));

            it('should exclude the last fitting item of the page if the encountered ' +
                'item is of type \'subsection\'', function () {
                expect(scope.page1.length).toBe(7);
            });
        });

        describe('with cv data that has section and subsection items in the first ' +
            'page that are bumped to the second', function () {
            beforeEach(makeInjectDeps(cvItemTestData().sectionSubsection4ItemsSectionSubsectionAndAnItem));

            it('should exclude the last two fitting items of the page if they are of ' +
                'types \'section\' and \'subsection\', respectively', function () {
                expect(scope.page1.length).toBe(6);
            });
        });
    });

    describe('WorksCtrl', function () {
        var scope = {}, locale = { "id": "en-us" },
            textService, worksService, sut;

        beforeEach(
            inject(function ($rootScope, $controller, TextData, WorksData) {
                scope = $rootScope.$new();
                sut = $controller('WorksCtrl', {$scope: scope});
                worksService = WorksData;
                textService = TextData;
            }));


        it('should have an injected cv object in scope', function () {
            expect(scope.works).toEqualData(worksService);
        });
    });
});
