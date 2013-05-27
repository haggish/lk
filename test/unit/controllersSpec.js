'use strict';

describe('LK controller', function () {

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    var newsInitCalled = false, cfgInitCalled = false, textInitCalled = false,
        cvInitCalled, sectionSubsectionAnd28Items =
        [{ type: "section" },{ type: "subsection" },{ type: "item" },
         { type: "item" }, { type: "item" }, { type: "item" }, { type: "item" },
         { type: "item" }, { type: "item" }, { type: "item" }, { type: "item" },
         { type: "item" }, { type: "item" }, { type: "item" }, { type: "item" },
         { type: "item" }, { type: "item" }, { type: "item" }, { type: "item" },
         { type: "item" }, { type: "item" }, { type: "item" }, { type: "item" },
         { type: "item" }, { type: "item" }, { type: "item" }, { type: "item" },
         { type: "item" }, { type: "item" }, { type: "item" }],
        textMockData = {
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
        }, cvMockWithData = function (data) {
            return {
                init: function (cb) {
                    cvInitCalled = true;
                    cb(this);
                },
                "flattened": data
            };
        }, cvMockData = cvMockWithData(sectionSubsectionAnd28Items);

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
        .factory('WorksData', function () {
            return {
                "data": 'works'
            };
        });

    beforeEach(module('lk.mockData'));

    describe('IndexCtrl', function () {
        var scope = {}, locale = { "id": "en-us" }, newsService, cfgService,
            textService, sut;

        beforeEach(module('lk.controllers'));
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
            reconfigureCVDataTo = function (_data) {
                var modname = 'lk.mockCVData' + new Date().getMilliseconds();
                var data = _data;
                angular.module(modname, [])
                    .factory('CVData', function () {
                        return cvMockWithData(data);
                    });
                beforeEach(module(modname));
            }, makeInjectDeps = function () {
                return inject(function ($rootScope, $controller, TextData, CVData) {
                    scope = $rootScope.$new();
                    sut = $controller('CVCtrl', {$scope: scope});
                    cvService = CVData;
                    var types = '';
                    CVData.flattened.forEach(function (e) {
                        types += e.type + '/';
                    });
                    console.log(types);
                    textService = TextData;
                });
            };

        describe('with any CV data', function () {
            reconfigureCVDataTo(sectionSubsectionAnd28Items);
            beforeEach(module('lk.controllers'));
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
                    expect(scope.page2[0]).toEqualData(sectionSubsectionAnd28Items[0]);
                });

            it('should add the current cv item subsection after the current item ' +
                'section if it exists', function () {
                expect(scope.page1.length).toBe(8);
                expect(scope.page2[1]).toEqualData(sectionSubsectionAnd28Items[1]);
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

            beforeEach(module('lk.controllers'));
            reconfigureCVDataTo([
                { type: "section" },
                { type: "subsection" },
                { type: "item" },
                { type: "item" },
                { type: "item" },
                { type: "item" },
                { type: "item" },
                { type: "section" },
                { type: "item" }
            ]);
            beforeEach(makeInjectDeps());

            it('should exclude the last fitting item of the page if the encountered ' +
                'item is of type \'section\'', function () {
                expect(scope.page1.length).toBe(7);
            });
        });

        describe('with cv data that has subsection item in the first page that is ' +
            'bumped to the second page', function () {

            reconfigureCVDataTo([
                { type: "section" },
                { type: "subsection" },
                { type: "item" },
                { type: "item" },
                { type: "item" },
                { type: "item" },
                { type: "item" },
                { type: "subsection" },
                { type: "item" }
            ]);
            beforeEach(module('lk.controllers'));
            beforeEach(makeInjectDeps());

            it('should exclude the last fitting item of the page if the encountered ' +
                'item is of type \'subsection\'', function () {
                expect(scope.page1.length).toBe(7);
            });
        });

        describe('with cv data that has section and subsection items in the first ' +
            'page that are bumped to the second', function () {

            reconfigureCVDataTo([
                { type: "section" },
                { type: "subsection" },
                { type: "item" },
                { type: "item" },
                { type: "item" },
                { type: "item" },
                { type: "section" },
                { type: "subsection" },
                { type: "item" }
            ]);
            beforeEach(module('lk.controllers'));
            beforeEach(makeInjectDeps());

            it('should exclude the last two fitting items of the page if they are of ' +
                'types \'section\' and \'subsection\', respectively', function () {
                expect(scope.page1.length).toBe(6);
            });
        });
    });

    describe('WorksCtrl', function () {
        var scope = {}, locale = { "id": "en-us" },
            textService, worksService, sut;

        beforeEach(module('lk.controllers'));
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
