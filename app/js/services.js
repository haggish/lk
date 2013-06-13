'use strict';

angular.module('lk.services', ['ngResource'])
    .constant('dbURL',
        'https://api.mongolab.com/api/1/databases/lk/collections')
    .constant('apiKey', '50e30f30e4b013ed303bbea5')
    .service('Utils', function ($locale) {
        var self = this;

        this.finnish = function (locale) {
            return (locale.id.indexOf('fi') === 0);
        };

        this.localeIDFrom = function (localeString) {
            if (self.finnish(localeString)) {
                return 'fi';
            } else {
                return 'en';
            }
        };

        this.localizedObject = function (props) {
            var ret = props || {};

            ret.get = function (property) {
                if (ret[property]) {
                    return ret[property];
                } else if (ret[property + 's']) {
                    if (self.finnish($locale)) {
                        return ret[property + 's'].fi;
                    } else {
                        return ret[property + 's'].en;
                    }
                } else {
                    return null;
                }
            };

            return ret;
        };
    })

    .service('WorksData', function (Utils) {
        this.data = [
            {
                image: 'img/yhtaJuhlaa.jpg',
                titles: {
                    fi: 'Yhtä juhlaa-ääni-installaatio, 2012',
                    en: 'Happy Hour sound installation, 2012'
                },
                descriptions: {
                    fi: 'Yhtä juhlaa-ääni-installaatio vuodelta 2012. ' +
                        'Äänimaailma Bileet mahassa 3:34 min yhdessä ' +
                        'Mika Salmisen kanssa. Sekatekniikka.',
                    en: 'Happy Hour sound installation, year 2012. ' +
                        'Soundscape Party in the stomach 3:34 min together ' +
                        'with Mika Salminen. Mixed media.'
                }
            },
            {
                image: 'img/yhtaJuhlaa2.jpg',
                titles: {
                    fi: 'Yhtä juhlaa-ääni-installaatio, 2012',
                    en: 'Happy Hour sound installation, 2012'
                },
                descriptions: {
                    fi: 'Yhtä juhlaa-ääni-installaatio vuodelta 2012. ' +
                        'Äänimaailma Bileet mahassa 3:34 min yhdessä ' +
                        'Mika Salmisen kanssa. Sekatekniikka.',
                    en: 'Happy Hour sound installation, year 2012. ' +
                        'Soundscape Party in the stomach 3:34 min together ' +
                        'with Mika Salminen. Mixed media.'
                }
            },
            {
                image: 'img/yhtaJuhlaa3.jpg',
                titles: {
                    fi: 'Yhtä juhlaa-ääni-installaatio, 2012',
                    en: 'Happy Hour sound installation, 2012'
                },
                descriptions: {
                    fi: 'Yhtä juhlaa-ääni-installaatio vuodelta 2012. ' +
                        'Äänimaailma Bileet mahassa 3:34 min yhdessä ' +
                        'Mika Salmisen kanssa. Sekatekniikka.',
                    en: 'Happy Hour sound installation, year 2012. ' +
                        'Soundscape Party in the stomach 3:34 min together ' +
                        'with Mika Salminen. Mixed media.'
                }
            },
            {
                image: 'img/atppthp.jpg',
                titles: {
                    fi: 'Älä tule paha päivä, tule hyvä päivä 1/4, 2012',
                    en: 'Don\'t come bad day, come good day 1/4, 2012'
                }
            },
            {
                image: 'img/maksanapanuorasuomi.jpg',
                titles: {
                    fi: 'Sarjasta: Maksa, napanuora ja Suomi, 2010',
                    en: 'From series: Liver, umbilical cord and Finland, 2010'
                }
            },
            {
                image: 'img/stressipallo.jpg',
                titles: {
                    fi: 'Stressipallo, 2011',
                    en: 'Stress ball, 2011'
                },
                descriptions: {
                    fi: 'Esittelin Stressipallot-nimisen installaation ' +
                        'Galleria Mältinrannassa Tampereella kevätkesällä ' +
                        '2011. Teosten materiaalina on kangas ja ' +
                        'täytemateriaali. Kolmen Stressipallon pituudet ja ' +
                        'paksuudet vaihtelivat puolestatoista metristä aina' +
                        ' kolmeen metriin saakka.',
                    en: 'I presented the Stress balls installation at Gallery ' +
                        'Mältinranta in Tampere in spring-summer 2011. ' +
                        'Material is fabric and stuffing material. ' +
                        'The dimensions of three stress balls vary from ' +
                        'one and a half to three meters.'
                }
            },
            {
                image: 'img/pilleripaivat.jpg',
                titles: {
                    fi: 'Pilleripäivät, 2010',
                    en: 'Pill days, 2010'
                },
                descriptions: {
                    fi: 'Teoksen materiaalina ovat keramiikasta valetut ' +
                        'e-pillerirasiat, jotka ovat raakapolton jälkeen ' +
                        'savustettu mustasavustusmenetelmällä.',
                    en: 'Work material is contraception pill casings molded ' +
                        'from ceramics, that are black-smoked after firing'
                }
            },
            {
                image: 'img/torkkuvatMustatorvisienet.jpg',
                titles: {
                    fi: 'Torkkuvat mustatorvisienet, ääni-installaatio, ' +
                        '2010-2011',
                    en: 'Snoring Black Trumpet Mushrooms, sound installation, ' +
                        '2010-2011'
                },
                descriptions: {
                    fi: 'Ääni-installaatio Torkkuvat Mustatorvisienet oli ' +
                        'esillä koko kesän vuonna 2011 Kumpulan ' +
                        'kasvitieteellisessä puutarhassa osana ' +
                        'Oon kaupungissa-kaupunkitaidetapahtumaa ' +
                        '(ORMAMO 100v). Torvisienistä kuului hengittämisen' +
                        ' ja nukkumisen äänimaailmaa. Teoksen tematiikka ' +
                        'liittyy läsnäolon kokemuksiin. Torkkuvien ' +
                        'mustatorvisienten musta väri on saatu aikaan ' +
                        'mustasavustusmenetelmällä.',
                    en: 'Sound installation Snoring Black Trumpet Mushrooms ' +
                        'was presented the whole summer of 2011 in ' +
                        'Kumpula Botanical Gardens as a part of ' +
                        'Oon Kaupungissa (ORNAMO 100v) city art event. ' +
                        'Trumpet mushrooms\' soundscape relates to breathing ' +
                        'and sleeping. The thematics are related to ' +
                        'experience of presence. The black color is produced ' +
                        'by the black-smoking method.'
                }
            }
        ].map(function (json) {
                return Utils.localizedObject(json);
            });
    })

    .factory('TextData', function ($locale, $resource, Utils, dbURL, apiKey) {
        var fetchedData;

        var data = {
            init: function () {
                if (fetchedData !== undefined) {
                    return;
                }
                fetchedData = $resource(
                    dbURL + '/text',
                    {
                        q: '{locale:\'' + Utils.localeIDFrom($locale) + '\'}',
                        "apiKey": apiKey
                    }, {}).query(function () {
                        if (fetchedData && fetchedData.length === 1) {
                            fetchedData = fetchedData[0];
                            data.data = fetchedData;
                        }
                    });
            }
        };

        return data;
    })

    .factory('CfgData', function ($resource, dbURL, apiKey) {
        var fetchedData;

        var data = {
            init: function () {
                if (fetchedData !== undefined) {
                    return;
                }
                fetchedData = $resource(dbURL + '/cfg',
                    {
                        "apiKey": apiKey
                    }, {}).query(function () {
                        if (fetchedData && fetchedData.length === 1) {
                            fetchedData = fetchedData[0];
                            data.splashPicture =
                                fetchedData.splashPicture;
                        }
                    });
            }
        };

        return data;
    })

    .factory('NewsData',function ($locale, $resource, Utils, dbURL, apiKey) {

        var fetchedData;

        var data = {
            init: function () {
                if (fetchedData !== undefined) {
                    return;
                }
                fetchedData = $resource(dbURL + '/news',
                    {
                        "apiKey": apiKey
                    }, {}).query(function () {
                        if (fetchedData && fetchedData.length > 0) {
                            data.data = fetchedData.map(
                                function (newsitem) {
                                    if (newsitem.type === 'event') {
                                        return event(newsitem);
                                    } else {
                                        return genericNewsitem(newsitem);
                                    }
                                });
                        }
                    });
            }
        };

        var event = function (props) {
            var ret = Utils.localizedObject(props), dateStringFrom =
                function (isoDateString) {
                    var date = new Date(isoDateString);
                    return date.getDate() + '.' +
                        (date.getMonth() + 1) + '.' + date.getFullYear();
                };
            ret.type = 'event';
            ret.eventStartString = function () {
                return dateStringFrom(ret.eventStart);
            };
            ret.eventEndString = function () {
                return dateStringFrom(ret.eventEnd);
            };
            return ret;
        };

        var genericNewsitem = function (props) {

            var ret = Utils.localizedObject(props);
            var linkRegexp = /\[\[(.*?)\]\]/;
            var text = ret.get('text');
            var startIndexOfLink = text.search(linkRegexp);

            var endIndexOfLink = function () {
                return ret.textBeforeLink.length +
                    ret.linkDescription.length + 4;
            };

            var thereIsTextAfterLink = function () {
                return endIndexOfLink() < text.length;
            };


            if (startIndexOfLink >= 0) {
                ret.textBeforeLink = text.substring(0, startIndexOfLink);
                ret.linkDescription = text.match(linkRegexp)[1];
                if (thereIsTextAfterLink()) {
                    ret.textAfterLink = text.substring(endIndexOfLink());
                }
            } else {
                ret.textBeforeLink = text;
            }

            ret.type = 'newsitem';

            return ret;
        };

        return data;

    }).factory('CVData', function ($locale, $resource, Utils, dbURL, apiKey) {
        var fetchedData;

        function cvItem(data) {
            var ret = Utils.localizedObject(data);
            ret.dateString = function () {
                var start = data.start ? new Date(data.start) : undefined;
                var end = data.end ? new Date(data.end) : undefined;
                var continuing = data.continuing ? true : false;
                var ret;
                var yearString = function () {
                    var ret = start ? start.getUTCFullYear().toString() : '';
                    if (end) {
                        if (start == undefined) {
                            ret += ('- ' + end.getUTCFullYear());
                        } else if (end.getUTCFullYear() !=
                            start.getUTCFullYear()) {
                            ret += (' - ' + end.getUTCFullYear());
                        }
                    } else if (continuing) {
                        if (ret.length > 0) {
                            ret += ' ';
                        }
                        ret += '-';
                    }
                    return ret;
                };
                switch (data.granularity) {
                    case 'year' :
                        ret = yearString();
                        break;
                    case 'month' :
                        ret = start ? (start.getUTCMonth() + 1).toString() : '';
                        if (!end) {
                            ret += (' / ' + start.getUTCFullYear());
                            if (continuing) {
                                ret += ' -';
                            }
                        } else if (end &&
                            end.getUTCFullYear() == start.getUTCFullYear() &&
                            end.getUTCMonth() != start.getUTCMonth()) {
                            ret += (' - ' + (end.getUTCMonth() + 1) +
                                ' / ' + start.getUTCFullYear());
                        } else {
                            ret += (' / ' + start.getUTCFullYear() + ' - ' +
                                (end.getUTCMonth() + 1) + ' / ' +
                                end.getUTCFullYear());
                        }
                        break;
                    case 'day':
                        ret = start.getUTCDate() + '.' +
                            (start.getUTCMonth() + 1) +
                            '.' + start.getUTCFullYear();
                        // assume for now there is no end
                        break;
                    default:
                        ret = yearString();
                        break;
                }
                return ret;
            };
            return ret;
        }

        var data = {
            init: function (cb) {
                if (fetchedData !== undefined) {
                    return;
                }
                fetchedData = $resource(dbURL + '/cv',
                    {
                        "apiKey": apiKey
                    }, {}).query(function () {
                        if (fetchedData && fetchedData.length > 0) {
                            data.data = fetchedData[0];
                            data.flattened = [];
                            (function flatten(cv) {
                                if (cv) {
                                    for (var property in cv) {
                                        if (property !== '_id' &&
                                            property.indexOf('$') != 0) {
                                            if (property === 'values') {
                                                cv[property].forEach(
                                                    function (line) {
                                                        line.type = 'item';
                                                        data.flattened.push(
                                                            cvItem(line));
                                                    });
                                            } else if (property !== 'title' &&
                                                property !== 'titles') {
                                                data.flattened.push(
                                                    Utils.localizedObject({
                                                        "type": cv._id ?
                                                            'section' :
                                                            'subsection',
                                                        "title": cv[property]
                                                            .title,
                                                        "titles": cv[property]
                                                            .titles
                                                    }));
                                                flatten(cv[property]);
                                            }
                                        }
                                    }
                                }
                            })(data.data);
                            if (cb) {
                                cb(data);
                            }
                        }
                    });
            }
        };

        return data;
    });