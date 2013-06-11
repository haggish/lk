'use strict';

describe('LK controller', function () {

    function mockResource() {
        return {
            called: false,
            init: function () {
                this.called = true;
            }
        };
    }

    var cvInitCalled = false, textMockData = mockResource(),
        newsMockData = mockResource(), cfgMockData = mockResource(),
        cvMockData = {
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
    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });


    describe('IndexCtrl', function () {
        var scope = {}, locale = { "id": "en-us" }, newsService, cfgService,
            textService, sut;

        beforeEach(inject(
            function ($rootScope, $controller, CfgData, TextData, NewsData) {
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
            expect(newsMockData.called).toBe(true);
        });

        it('should initialize the text object', function () {
            expect(scope.text).toEqualData(textMockData);
            expect(textMockData.called).toBe(true);
        });

        it('should initialize the cfg object', function () {
            expect(scope.cfg).toEqualData(cfgMockData);
            expect(cfgMockData.called).toBe(true);
        });
    });

    describe('CVCtrl', function () {
        var scope = {}, locale = { "id": "en-us" }, textService, cvService,
            sut,
            injectDependencies = function (flattened) {
                return inject(
                    function ($rootScope, $controller, TextData, CVData) {
                        scope = $rootScope.$new();
                        cvService = CVData;
                        if (flattened) {
                            CVData.flattened = flattened;
                        }
                        sut = $controller('CVCtrl', {$scope: scope});
                        textService = TextData;
                    });
            };

        describe('with any CV data', function () {
            var testdata = cvItemTestData().sectionSubsectionAnd28Items;
            var testdataWhichHasItemsThatWontFitIntoOnePage = testdata;
            var itemsInPageIfTwoSectionsAndRestAreItems = 8;
            var pagesInTestData = 3;

            beforeEach(injectDependencies());

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
                expect(textMockData.called).toBe(true);
            });

            it('should set scope property currentPage to given number ' +
                'when setPage is called in scope', function () {
                var givenPageNumber = 43;
                scope.setPage(givenPageNumber);
                expect(scope.currentPage).toBe(givenPageNumber);
            });

            it('should set scope property cvPage to scope property page ' +
                'plus given number when setPage is called in scope',
                function () {
                    var givenPageNumber = 43;
                    var givenPage = { "foo": 'bar' };
                    scope['page' + givenPageNumber] = givenPage;
                    scope.setPage(givenPageNumber);
                    expect(scope.cvPage).toEqual(givenPage);
                });

            it('should set scope property cvPage to scope property page ' +
                'plus given number when selectPageHandler is called',
                function () {
                    var givenPageNumber = 43;
                    var givenPage = { "foo": 'bar' };
                    scope['page' + givenPageNumber] = givenPage;
                    scope.selectPageHandler(givenPageNumber);
                    expect(scope.cvPage).toEqual(givenPage);
                });

            it('should add the current cv item section to start of a new page',
                function () {
                    expect(scope.page1.length).toBe(
                        itemsInPageIfTwoSectionsAndRestAreItems);
                    expect(scope.page2[0]).toEqualData(
                        testdataWhichHasItemsThatWontFitIntoOnePage
                            .sectionItem);
                });

            it('should add the current cv item subsection after ' +
                'the current item section if it exists', function () {
                expect(scope.page1.length).toBe(
                    itemsInPageIfTwoSectionsAndRestAreItems);
                expect(scope.page2[1]).toEqualData(
                    testdata.subsectionItem);
            });

            it('should set noOfPages scope property to number of pages',
                function () {
                    expect(scope.noOfPages).toBe(pagesInTestData);
                });

            it('should initially set the current page to one', function () {
                expect(scope.currentPage).toBe(1);
            });
        });

        describe('with cv data that has section item that is ' +
            'bumped to the second page', function () {
            var testdataWithSectionThatIsBumpedToSecondPage =
                cvItemTestData().sectionSubsection5ItemsSectionAndAnItem;
            var expectedItemAmountInPageOne = 7;

            beforeEach(injectDependencies(
                testdataWithSectionThatIsBumpedToSecondPage));

            it('should exclude the last fitting item of the page ' +
                'if the encountered item is of type \'section\'', function () {
                expect(scope.page1.length).toBe(expectedItemAmountInPageOne);
            });
        });

        describe('with cv data that has subsection item in ' +
            'the first page that is bumped to the second page', function () {
            var expectedItemAmountInPageOne = 7;

            beforeEach(injectDependencies(
                cvItemTestData().sectionSubsection5ItemsSubsectionAndAnItem));

            it('should exclude the last fitting item of ' +
                'the page if the encountered item is of type \'subsection\'',
                function () {
                    expect(scope.page1.length).toBe(
                        expectedItemAmountInPageOne);
                });
        });

        describe('with cv data that has section and subsection items in ' +
            'the first page that are bumped to the second', function () {
            var expectedItemAmountInPageOne = 6;

            beforeEach(injectDependencies(
                cvItemTestData()
                    .sectionSubsection4ItemsSectionSubsectionAndAnItem));

            it('should exclude the last two fitting items of the page ' +
                'if they are of types \'section\' and \'subsection\', ' +
                'respectively', function () {
                expect(scope.page1.length).toBe(expectedItemAmountInPageOne);
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
