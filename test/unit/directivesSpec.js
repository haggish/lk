'use strict';

describe('LK directives', function () {

    beforeEach(module('lk.directives'));

    beforeEach(function () {
        this.addMatchers({
            toHaveClass:function (cls) {
                this.message = function () {
                    return "Expected '" + angular.mock.dump(this.actual) +
                        "' to have class '" + cls + "'.";
                };

                return this.actual.hasClass(cls);
            }
        });
    });


    describe('newsitem', function () {

        var element;

        var scope;

        var elementHTML = '<newsitem name="ni">news here</newsitem>';


        beforeEach(inject(function ($rootScope, $compile) {
            element = angular.element(elementHTML);

            scope = $rootScope;
            $compile(element)(scope);
            scope.$digest();
        }));


        it('should replace newsitem element with a div of newsitem class',
            function () {
                expect(element.parent().children('div')).toEqual(element);
                expect(element).toHaveClass('newsitem');
            });

        describe('with a generic newsitem bound', function () {

            var newsitemContent = function (rawContent) {
                var genericNewsitemContentStructure =
                    /(.*)<a href=\"(.*)\" class=\"ng-binding\">(.*)<\/a>(.*)/;
                if (genericNewsitemContentStructure.exec(rawContent) === null) {
                    return null;
                }
                return {
                    textBeforeLink:genericNewsitemContentStructure
                        .exec(rawContent)[1],
                    hrefValue:genericNewsitemContentStructure
                        .exec(rawContent)[2],
                    linkDescription:genericNewsitemContentStructure
                        .exec(rawContent)[3],
                    textAfterLink:genericNewsitemContentStructure
                        .exec(rawContent)[4]
                };
            };

            var trimmed = function (string) {
                return $.trim(string);
            };

            var genericNewsitemHTML = function () {
                return element.find('div').eq(0).html();
            };

            beforeEach(function () {
                scope.$apply(function () {
                    scope.ni = {
                        "type":"newsitem",
                        "textBeforeLink":"text before",
                        "linkDescription":"link",
                        "textAfterLink":"and after",
                        "link":"http://www.nytimes.com"
                    };
                });
            });

            it('should contain the news text within a subdiv of the ' +
                'newsitem div, the news text link description ' +
                'in an HTML link element', function () {
                expect(trimmed(newsitemContent(
                    genericNewsitemHTML()).textBeforeLink))
                    .toBe('text before');
                expect(trimmed(newsitemContent(
                    genericNewsitemHTML()).linkDescription))
                    .toBe('link');
                expect(trimmed(newsitemContent(
                    genericNewsitemHTML()).textAfterLink))
                    .toBe('and after');
            });

            it('should point the link in news text link description to ' +
                'the newsitem link', function () {
                expect(newsitemContent(genericNewsitemHTML()).hrefValue)
                    .toBe('http://www.nytimes.com');
            });
        });

        describe('with an event newsitem bound', function () {
            var eventElement = function () {
                return element.find('div').eq(1);
            };
            var eventHTML = function () {
                return eventElement().html();
            };
            var locationElement = function () {
                return $(eventElement()).find('span[itemprop=\'location\']');
            };
            var longitudeElementQuery = 'meta[itemprop="longitude"]';
            var longitudeElement = function () {
                return $(locationElement()).find(longitudeElementQuery);
            };
            var latitudeElementQuery = 'meta[itemprop="latitude"]';
            var latitudeElement = function () {
                return $(locationElement()).find(latitudeElementQuery);
            };
            var linkElement = function () {
                return $(eventElement()).find('a');
            };


            beforeEach(inject(function () {
                scope.$apply(function () {
                    scope.ni = {
                        "type":"event",
                        "get":function (prop) {
                            switch (prop) {
                                case 'placeName':
                                    return 'Grand Central Station';
                                case 'eventName':
                                    return 'Gangnam Style Flashmob';
                                case 'description':
                                    return 'A bunch of people dance like horses';
                                default:
                                    return null;
                            }
                        },
                        "location":{
                            "lat":61.3053,
                            "lon":25.0857
                        },
                        "eventLink":"http://www.auttoinen.fi/",
                        "eventStart":"2012-06-16T18:00:00.000+02:00",
                        "eventEnd":"2012-08-05T20:00:00.000+02:00",
                        "eventStartString":function () {
                            return "16.6.2012";
                        },
                        "eventEndString":function () {
                            return "5.8.2012";
                        }
                    };
                });
            }));

            it('should provide a subdiv of newsitem div with itemscope and ' +
                'itemtype Event attributes if the newsitem ' +
                'type is \'event\'', function () {
                expect(eventElement().attr('itemscope')).toBeDefined();
                expect(eventElement().attr('itemtype'))
                    .toBe('http://data-vocabulary.org/Event');
            });

            it('should display location info wrapped with span element having' +
                ' itemprop location, itemscope, and ' +
                'item type \'Organization\'', function () {
                expect(locationElement().length).toBe(1);
                expect(locationElement().attr('itemscope')).toBeDefined();
                expect(locationElement().attr('itemtype'))
                    .toBe('http://data-vocabulary.org/Organization');
            });

            it('should display newsitem place name as location description, ' +
                'wrapped with span element ' +
                'having itemprop name attribute', function () {
                var placeNameElement = $(locationElement())
                    .find('span[itemprop="name"]');
                expect(placeNameElement.length).toBe(1);
                expect(placeNameElement.text()).toBe(scope.ni.get('placeName'));
            });

            it('should have latitude metadata in location info, ' +
                'having itemprop latitude attribute and content ' +
                'matching newsitem location latitude', function () {
                expect(latitudeElement().length).toBe(1);
                expect(parseFloat(latitudeElement().attr('content')))
                    .toBe(scope.ni.location.lat);
            });

            it('should have longitude metadata in location info, ' +
                'having itemprop longitude attribute and content ' +
                'matching newsitem location longitude', function () {
                expect(longitudeElement().length).toBe(1);
                expect(parseFloat(longitudeElement().attr('content')))
                    .toBe(scope.ni.location.lon);
            });

            it('should have latitude/longitude metadata wrapped with ' +
                'span element having itemprop geo, itemscope ' +
                'and item type \'Geo\' attributes', function () {
                var geoElement = $(locationElement())
                    .find('span[itemprop="geo"]');
                expect(geoElement.length).toBe(1);
                expect(geoElement.attr('itemscope')).toBeDefined();
                expect(geoElement.attr('itemtype'))
                    .toBe('http://data-vocabulary.org/Geo');
                expect(geoElement.find(latitudeElementQuery).length).toBe(1);
                expect(geoElement.find(longitudeElementQuery).length).toBe(1);
            });

            it('should show event location name and event name respectively,' +
                ' separated by a colon', function () {
                expect(eventElement().text().indexOf(
                    scope.ni.get('placeName') + ': ' +
                        scope.ni.get('eventName'))).toBe(0);
            });

            it('should make the event name a link, pointing to the ' +
                'address in event newsitem link', function () {
                expect(linkElement().length).toBe(1);
                expect(linkElement().attr('href')).toBe(scope.ni.eventLink);
            });

            it('should bind event name to a respective property in the ' +
                'event newsitem', function () {
                expect(linkElement().text()).toBe(scope.ni.get('eventName'));
            });

            it('should wrap the event name with span element having ' +
                'itemprop summary attribute', function () {
                var eventNameSpanElement = linkElement()
                    .find('span[itemprop="summary"]');
                expect(eventNameSpanElement.length).toBe(1);
                expect(eventNameSpanElement.text())
                    .toBe(scope.ni.get('eventName'));
            });

            describe('having only start time', function () {
                it('should display event start time after the ' +
                    'location and name', function () {
                    expect(eventElement().text().indexOf(
                        scope.ni.get('placeName') + ': ' +
                            scope.ni.get('eventName') + ' ' +
                            scope.ni.eventStartString())).toBe(0);
                });
            });

            it('should wrap the event start time with time element having ' +
                'itemprop startDate and dateTime ' +
                'newsitem eventStart property attributes', function () {
                var startDateElement = $(eventElement())
                    .find('time[itemprop="startDate"]');
                expect(startDateElement.length).toBe(1);
                expect(startDateElement.attr('dateTime'))
                    .toBe(scope.ni.eventStart);
                expect(startDateElement.text()).toBe(scope.ni.eventStartString());
            });

            describe('having both start and end time', function () {
                it('should display event time after the location and name, ' +
                    'from start to end separated by hyphen',
                    function () {
                        expect(eventElement().text().indexOf(
                            scope.ni.get('placeName') + ': ' +
                                scope.ni.get('eventName') + ' ' +
                                scope.ni.eventStartString() + '-' +
                                scope.ni.eventEndString())).toBe(0);
                    });

                it('should wrap the event end time with time element having ' +
                    'itemprop endDate and dateTime ' +
                    'newsitem eventEnd property attributes', function () {
                    var endDateElement = $(eventElement())
                        .find('time[itemprop="endDate"]');
                    expect(endDateElement.length).toBe(1);
                    expect(endDateElement.attr('dateTime'))
                        .toBe(scope.ni.eventEnd);
                    expect(endDateElement.text())
                        .toBe(scope.ni.eventEndString());
                });
            });

            describe('having event description', function () {
                it('should display the event newsitem description at the end',
                    function () {
                        var spacedHyphenAndDescription = ' - ' +
                            scope.ni.get('description');
                        expect(eventElement().text()
                            .indexOf(spacedHyphenAndDescription))
                            .toBe(eventElement().text().length -
                            spacedHyphenAndDescription.length);
                    });
            });
        });
    });

    describe('tollo', function () {

        var element;

        var scope;

        var elementHTML = '<tollo number="4" link="about"></tollo>';

        var linkElement = function () {
            return $(element).children('a');
        };

        var imageElement = function () {
            return linkElement().children('img');
        };

        beforeEach(inject(function ($rootScope, $compile) {
            element = angular.element(elementHTML);

            scope = $rootScope;
            $compile(element)(scope);
            scope.$digest();
        }));


        it('should replace \'tollo\' element with a div named after about ' +
            'parameter prefixed with \'Link\'', function () {
            expect(element.parent().children('div')).toBeDefined();
            expect(element.attr('id')).toBe('aboutLink');
        });

        it('should contain a br element as first child element of generated ' +
            'div', function () {
            expect(element.children()[0].localName).toBe('br');
        });

        it('should contain a link with value hash slash element link ' +
            'parameter value', function () {
            expect(linkElement().length).toBe(1);
            expect(linkElement().attr('href')).toBe('#/about');
        });

        it('should contain an img element within the div link with src ' +
            'value \'img/tollo*.jpg\', asterisk equaling the number element ' +
            'parameter value', function () {
            expect(imageElement().length).toBe(1);
            expect(imageElement().attr('src')).toBe('img/tollo4.jpg');
        });

        it('should have \'img-circle\' as CSS class of div link img element',
            function () {
                expect(imageElement()).toHaveClass('img-circle');
            });
    });

});