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
        });

    beforeEach(module('lk.mockData'));
    beforeEach(module('lk.controllers'));

    describe('IndexCtrl', function () {
        var scope = {}, locale = { "id":"en-us" }, newsService, cfgService,
            textService, sut;

        beforeEach(
            inject(function ($rootScope, $controller,
                             CfgData, TextData, NewsData) {
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
});
