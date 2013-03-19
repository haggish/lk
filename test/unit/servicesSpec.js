'use strict';

describe('LK services', function () {

    beforeEach(function () {
        this.addMatchers(newsitemMatchers());
    });

    beforeEach(module('lk.services'));

    // TODO utils tests

    describe('newsDataService', function () {

        var sut, locale, $httpBackend, dataFromRESTResource;

        var triggerRESTResourceLoad = function () {
            sut.init();
            $httpBackend.flush();
        };

        beforeEach(inject(function (NewsData, _$httpBackend_, $locale) {
            sut = NewsData;
            locale = $locale;
            $httpBackend = _$httpBackend_;
        }));

        describe('in any locale', function () {
            beforeEach(inject(function () {
                // expecting anything but finnish, tests don't depend on it
                // but the mock behavior specification does
                dataFromRESTResource = indexTestData().en.news;
                $httpBackend.expectGET(backendURLFor('news'))
                    .respond(dataFromRESTResource);
                triggerRESTResourceLoad();
            }));

            it('returns news from the REST resource data', function () {
                sut.data.forEach(function (receivedNewsitem, idx) {
                    expect(receivedNewsitem)
                        .toHaveNewsData(dataFromRESTResource[idx]);
                });
            });

            it('returns an event for every JSON newsitem of type \'event\'',
                function () {
                    sut.data.forEach(function (receivedNewsitem, idx) {
                        if (receivedNewsitem.type === 'event') {
                            expect(receivedNewsitem).toBeEvent();
                        }
                    });
                });

            it('returns a generic newsitem for every JSON newsitem ' +
                'any other type than \'event\'', function () {
                sut.data.forEach(function (receivedNewsitem, idx) {
                    if (receivedNewsitem.type !== 'event') {
                        expect(receivedNewsitem).toBeGenericNewsitem();
                    }
                });
            });
        });
    });

    describe('textDataService', function () {

        var sut, locale, $httpBackend, dataFromRESTResource;

        var triggerRESTResourceLoad = function () {
            sut.init();
            $httpBackend.flush();
        };

        beforeEach(inject(function (TextData, _$httpBackend_, $locale) {
            sut = TextData;
            locale = $locale;
            $httpBackend = _$httpBackend_;
        }));

        describe('in Finnish locale', function () {
            beforeEach(inject(function () {
                locale.id = 'fi';
                dataFromRESTResource = indexTestData().fi.news;
                $httpBackend.expectGET(textBackendURLWithLocale('fi'))
                    .respond(dataFromRESTResource);
                triggerRESTResourceLoad();
            }));

            it('makes request for data localized for Finland if ' +
                'current locale ID has \'fi\'', function () {
                expect(sut.text).toEqual(dataFromRESTResource.text);
            });
        });

        describe('in anything else than Finnish locale', function () {
            beforeEach(inject(function () {
                locale.id = 'ch';
                dataFromRESTResource = indexTestData().en.news;
                $httpBackend.expectGET(textBackendURLWithLocale('en'))
                    .respond(dataFromRESTResource);
                triggerRESTResourceLoad();
            }));

            it('makes request for data localized for English if ' +
                'current locale ID hasn\'t got \'fi\'',
                function () {
                    expect(sut.text).toEqual(dataFromRESTResource.text);
                });
        });
    });

    describe('cfgDataService', function () {

        var sut, $httpBackend, dataFromRESTResource;

        var triggerRESTResourceLoad = function () {
            sut.init();
            $httpBackend.flush();
        };

        beforeEach(inject(function (CfgData, _$httpBackend_, $locale) {
            sut = CfgData;
            $httpBackend = _$httpBackend_;
            dataFromRESTResource = cfgTestData();
            $httpBackend.expectGET(backendURLFor('cfg'))
                .respond(dataFromRESTResource);
            triggerRESTResourceLoad();
        }));

        it('returns splash picture from the REST resource data',
            function () {
                expect(sut.splashPicture)
                    .toEqual(dataFromRESTResource.splashPicture.value);
            });
    });

    // TODO CVData tests
});