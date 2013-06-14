'use strict';

describe('LK services', function () {

    beforeEach(function () {
        this.addMatchers(newsitemMatchers());
    });

    beforeEach(module('lk.services'));

    describe('Utils', function () {
        var sut, locale;

        beforeEach(inject(function (Utils, $locale) {
            sut = Utils;
            locale = $locale;
        }));

        it('tells that given locale is finnish if its id begins with \'fi\'',
            function () {
                locale.id = 'fifi';
                expect(sut.finnish(locale)).toBeTruthy();
            });

        it('tells that given locale is not finnish if ' +
            'its id doesn\'t begin with \'fi\'',
            function () {
                locale.id = 'dodo';
                expect(sut.finnish(locale)).toBeFalsy();
            });

        it('returns localeID \'fi\' from locale string if ' +
            'the locale is finnish', function () {
            locale.id = 'fi';
            expect(sut.localeIDFrom(locale)).toBe('fi');
        });

        it('returns localeID \'en\' from locale string if ' +
            'the locale is not finnish', function () {
            locale.id = 'dodo';
            expect(sut.localeIDFrom(locale)).toBe('en');
        });

        it('creates a localized object with given properties', function () {
            var props = {
                "a": 'foo',
                "b": 42
            };
            var localizedObjectWithProperties = sut.localizedObject(props);
            expect(localizedObjectWithProperties.a).toBe(props.a);
            expect(localizedObjectWithProperties.b).toBe(props.b);
            expect(localizedObjectWithProperties).toBeLocalizedObject();
        });

        it('creates an empty localized object if no properties is given',
            function () {
                var emptyLOB = sut.localizedObject();
                expect(emptyLOB).toBeLocalizedObject();
            });
    });

    describe('NewsData', function () {

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

    describe('TextData', function () {

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

    describe('CVGData', function () {

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

    describe('CVData', function () {

        var sut, $httpBackend, dataFromRESTResource;

        var triggerRESTResourceLoad = function (cb) {
            sut.init(cb);
            $httpBackend.flush();
        };

        beforeEach(inject(function (CVData, _$httpBackend_, $locale) {
            sut = CVData;
            $httpBackend = _$httpBackend_;
        }));

        function makeDataResourceReturn(data, cb) {
            dataFromRESTResource = data;
            $httpBackend.expectGET(backendURLFor('cv'))
                .respond(dataFromRESTResource);
            triggerRESTResourceLoad(cb);
        }

        describe('when initialized', function () {

            describe('with a callback', function () {

                var callbackCalled = false;
                var callCallback = function () {
                    callbackCalled = true;
                };

                beforeEach(function () {
                    makeDataResourceReturn([cvTestData()], callCallback);
                });

                it('will execute a callback if one is specified', function () {
                    expect(callbackCalled).toBeTruthy();
                });
            });

            describe('with proper cv resource data', function () {

                var dataNotRead = {
                    "somethingThatShouldNotBeRead": {
                        "titles": {
                            "fi": "Dada",
                            "en": "Dadada"
                        },
                        "values": []
                    }
                };

                function dataRead() {
                    return dataFromRESTResource[0];
                }

                beforeEach(function () {
                    makeDataResourceReturn([
                        cvTestData(),
                        dataNotRead
                    ]);
                });

                it('generates cv items from first index of queried REST ' +
                    'data array', function () {
                    expect(sut.flattened[0].titles).toEqualData(
                        dataFromRESTResource[0].education.titles);
                    sut.flattened.filter(function (e) {
                        return e.titles !== undefined;
                    }).forEach(function (e) {
                            expect(e.titles).not.toEqual(dataNotRead.titles);
                        });
                });

                it('does not generate cv item(s) for REST data property _id',
                    function () {
                        expect(sut.flattened.filter(function (e) {
                            return e.title === dataRead().education._id.title;
                        }).length).toBe(0);
                    });

                it('does not generate cv item(s) for REST data properties ' +
                    'beginning with \'$\'', function () {
                    expect(sut.flattened.filter(function (e) {
                        return e.title === dataRead().education.$omitted.title;
                    }).length).toBe(0);
                });

                it('does not generate cv item(s) for REST data property \'title\'',
                    function () {
                        expect(sut.flattened.filter(function (e) {
                            return e.title === dataRead().education.title.title;
                        }).length).toBe(0);
                    });

                it('does not generate cv item(s) for REST data property \'titles\'',
                    function () {
                        expect(sut.flattened.filter(function (e) {
                            return e.title === dataRead().education.titles.title;
                        }).length).toBe(0);
                    });

                it('generates a cv item for every datum in property array value ' +
                    'of property name \'values\'', function () {
                    dataRead().education.values.forEach(function (v) {
                        expect(sut.flattened.filter(function (f) {
                            return f.descriptions && v.descriptions &&
                                f.descriptions.fi == v.descriptions.fi;
                        }).length).toBe(1);
                    });
                });

                it('generates cv items as localized objects', function () {
                    sut.flattened.forEach(function (e) {
                        expect(e).toBeLocalizedObject();
                    })
                });

                describe('with property named otherwise than specific names above',
                    function () {
                        it('will create a cv section if property \'_id\' ' +
                            'exists in REST data at same level', function () {
                            expect(dataRead()._id).toBeDefined();
                            expect(sut.flattened.filter(function (e) {
                                return e.titles &&
                                    dataRead().education.titles.fi ===
                                        e.titles.fi;
                            })[0].type).toBe('section');
                        });

                        it('will create a cv subsection if property \'_id\'' +
                            ' does not exist in REST data at same level', function () {
                            expect(dataRead().artisticActivity._id)
                                .toBeUndefined();
                            expect(sut.flattened.filter(function (e) {
                                return e.titles &&
                                    dataRead().artisticActivity.
                                        selectPrivateExhibitions.titles.fi ===
                                        e.titles.fi;
                            })[0].type).toBe('subsection');
                        });

                        it('will create a section or subsection with properties ' +
                            '\'title\' and \'titles\' valued with REST property ' +
                            'values of same name, respectively', function () {
                            expect(sut.flattened[0].titles).toEqualData(
                                dataRead().education.titles);
                        });

                        it('will add flattened cv data generated from the ' +
                            'properties of the property value', function () {
                            expect(sut.flattened.filter(function (e) {
                                return e.title === 'Group exhibitions';
                            })[0].title).toBe(dataRead().artisticActivity
                                    .groupExhibitions.title);
                        });
                    });
            });

            describe('with undefined cv resource data', function () {
                beforeEach(function () {
                    makeDataResourceReturn(undefined);
                });

                it('does not generate cv items if the queried REST data ' +
                    'array is undefined', function () {
                    expect(sut.flattened).toBeUndefined();
                });
            });

            describe('with empty cv resource data', function () {
                beforeEach(function () {
                    makeDataResourceReturn([]);
                });

                it('does not generate cv items if the queried REST ' +
                    'data array length is less than one', function () {
                    expect(sut.flattened).toBeUndefined();
                });
            });
        });
    });
});