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

    describe('cvDataService', function () {

        var sut, $httpBackend, dataFromRESTResource;

        var triggerRESTResourceLoad = function () {
            sut.init(/* cb */);
            $httpBackend.flush();
        };

        beforeEach(inject(function (CVData, _$httpBackend_, $locale) {
            sut = CVData;
            $httpBackend = _$httpBackend_;
            dataFromRESTResource = cvTestData();
            $httpBackend.expectGET(backendURLFor('cv'))
                .respond(dataFromRESTResource);
            triggerRESTResourceLoad();
        }));

        describe('when initialized', function () {

            it('generates cv items from first index of queried REST ' +
                'data array', function () {
                // TODO
            });

            it('does not generatecv items if the queried REST data ' +
                'array is undefined', function () {
                // TODO
            });

            it('does not generate cv items if the queried REST ' +
                'data array length is less than one', function () {
                // TODO
            });

            it('does not generate cv item(s) for REST data property _id',
                function () {
                    // TODO
                });

            it('does not generate cv item(s) for REST data properties ' +
                'beginning with \'$\'', function () {
                // TODO
            });

            it('does not generate cv item(s) for REST data property \'title\'',
                function () {
                    // TODO
                });

            it('does not generate cv item(s) for REST data property \'titles\'',
                function () {
                    // TODO
                });

            it('generates a cv item for every datum in property array value ' +
                'of property name \'values\'', function () {
                // TODO
            });

            it('generates cv items as localized objects', function () {
                // TODO
            });

            it('will execute a callback if one is specified', function () {
                // TODO
            });

            describe('with property named otherwise than specific names above',
                function () {
                    it('will create a cv title if property \'_id\' ' +
                        'exists in REST data at same level', function () {
                        // TODO
                    });

                    it('will create a cv subtitle if property \'_id\'' +
                        ' does not exist in REST data at same level', function () {
                        // TODO
                    });

                    it('will create a title or subtitle with properties ' +
                        '\'title\' and \'titles\' valued with REST property ' +
                        'values of same name, respectively', function () {
                        // TODO
                    });

                    it('will add flattened cv data generated from the ' +
                        'properties of the property value', function () {
                        // TODO
                    });
                });
        });
    });
});