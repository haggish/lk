'use strict';

var backendURLFor = function (db) {
    return 'https://api.mongolab.com/api/1/databases/lk/collections/' + db +
        '?apiKey=50e30f30e4b013ed303bbea5';
}

var textBackendURLWithLocale = function (localeString) {
    return 'https://api.mongolab.com/api/1/databases/lk/collections/text?' +
        'apiKey=50e30f30e4b013ed303bbea5&q=%7Blocale:\'' + localeString +
        '\'%7D';
};

function newsitemMatchers() {
    return {
        toEqualData: function (expected) {
            return angular.equals(this.actual, expected);
        },
        toBeEvent: function () {
            return angular.equals(this.actual.type, 'event') &&
                this.actual.get != undefined;
        },
        toBeGenericNewsitem: function () {
            return angular.equals(this.actual.type, 'newsitem') &&
                this.actual.get != undefined &&
                this.actual.textBeforeLink != undefined;
        },
        toHaveNewsData: function (expected) {
            var self = this, sameData = true;
            var checkSingleAndPluralPropsEqual = function (p) {
                if (!angular.equals(self.actual[p], expected[p])) {
                    sameData = false;
                }
                if (!angular.equals(self.actual[p + 's'], expected[p + 's'])) {
                    sameData = false;
                }
            };
            if (checkSingleAndPluralPropsEqual('type') === false) {
                return false;
            }
            if (expected.type === 'event') {
                [ 'eventName', 'placeName', 'location', 'eventLink',
                    'eventStart', 'eventEnd', 'description']
                    .forEach(checkSingleAndPluralPropsEqual);
            } else {
                [ 'text', 'link' ].forEach(checkSingleAndPluralPropsEqual);
            }
            if (sameData === false) {
                return false;
            }
            return true;
        }
    }
}

function indexTestData() {
    var expectedData = {
        "expectedNewsdata": [
            { "type": "event",
                "eventName": "HAPPY HOUR",
                "placeNames": {
                    "fi": "Vuotalon Galleria",
                    "en": "Vuotalo Gallery"
                },
                "location": {
                    "lat": 60.890,
                    "lon": 25.1433
                },
                "eventLink": "http://www.vuotalo.fi/tilat/nayttely/galleria",
                "eventStart": "2012-03-31T18:00:00.000+02:00",
                "eventEnd": "2012-04-28T20:00:00.000+02:00",
                "descriptions": {
                    "fi": "kutsuttuna",
                    "en": "invited"
                }
            },
            {
                "type": "event",
                "eventNames": {
                    "fi": "kesänäyttely",
                    "en": "summer exhibition"
                },
                "placeName": "Ars Auttoinen",
                "location": {
                    "lat": 61.3053,
                    "lon": 25.0857
                },
                "eventLink": "http://www.auttoinen.fi/",
                "eventStart": "2012-06-16T18:00:00.000+02:00",
                "eventEnd": "2012-08-05T20:00:00.000+02:00",
                "descriptions": {
                    "fi": "Olen mukana muutamalla ääni-installaatiolla",
                    "en": "Participating with a few sound installations"
                }
            },
            {
                "type": "newsitem",
                "texts": {
                    "fi": "Lue [[kuvataidekriitikko Veikko Halmetojan " +
                        "kirjoittama taiteilijaesittely]]!",
                    "en": "Read the [[artist presentation written by art critic " +
                        "Veikko Halmetoja]]!"
                },
                "link": "http://laurakarki.blogspot.com/2011/11/" +
                    "kuvataidekriitikko-veikko-halmetojan.html"
            }
        ],
        "expectedTexts": {
            "fi": {
                "subtitle": "Kuvataiteilija, TaM",
                "splashCaption": "Tuotantooni kuuluvat KUTUdesign-korut sekä " +
                    "MUHKUprint-kangasprinttiveistokset.",
                "blog": "Blogi",
                "matricle": "Suomen Taiteilijaseuran kuvataiteilijamatrikkeli",
                "finnishdesigners": "finnishdesigners",
                "contactInfo": "Yhteystiedot",
                "cvWhereAndWhen": "Syntynyt 1978 Lahdessa, asuu ja työskentelee Lahdessa, Berliinissä sekä ulkomaisissa taiteilijaresidensseissä"
            },
            "en": {
                "subtitle": "Visual Artist, M.A",
                "splashCaption": "I produce also KUTUdesign jewelry and MUHKUprint " +
                    "fabric print sculptures.",
                "blog": "Blog",
                "matricle": "Finnish Artists Association Visual Artist Matricle",
                "finnishdesigners": "finnishdesigners",
                "contactInfo": "Contact Information",
                "cvWhereAndWhen": "Born 1978 in Lahti, living and working in Lahti, Berlin and occasionally in foreign artist residencies"
            }
        },
        "expectedSplashPicture": { "value": "img/hhour.jpg" }
    };

    return {
        "fi": {
            "text": expectedData.expectedTexts.fi,
            "news": expectedData.expectedNewsdata,
            "splashPicture": expectedData.expectedSplashPicture
        },
        "en": {
            "text": expectedData.expectedTexts.en,
            "news": expectedData.expectedNewsdata,
            "splashPicture": expectedData.expectedSplashPicture
        }
    };
}

function cfgTestData() {
    return {
        "splashPicture": "img/hhour.jpg"
    };
}

function year(year) {
    return year + '-01-01T00:00:00.000Z';
}

function zeroPadded(number) {
    return ((number < 10) ? '0' : '') + number.toString();
}

function month(month, year) {
    return year + '-' + zeroPadded(month) + '-01T00:00:00.000Z';
}

function date(day, month, year) {
    return year + '-' + zeroPadded(month) + '-' + zeroPadded(day) +
        'T00:00:00.000Z';
}

function cvTestData() {
    /*
     {
     "start" : 'startTimeISO', (optional)
     "end" : 'endTimeISO', (optional)
     "granularity" : 'year' (default)|'month'|'day',
     "continuing" : false (default),
     "type" : 'education'|'artistic activity'|'job experience'|etc,
     "subtype" : 'select private exhibitions'|'group exhibitions'|
     'works in collections'|'commissioned works, public art'|
     'grants'|'prizes'|'articles'|'in publications'|'memberships'|
     'residences'|'other'|etc, (optional)
     "description" : 'your description here'
     }
     */

    return {
        "education": {
            "titles": {
                "fi": 'Koulutus',
                "en": 'Education'
            },
            "values": [
                {
                    "start": year(2011),
                    "end": year(2012),
                    "descriptions": {
                        "fi": 'Lyriikan verkkokurssi, KVS, Orivesi',
                        "en": 'Lyrics remote course, KVS, Orivesi'
                    }
                },
                {
                    "start": year(2011),
                    "descriptions": {
                        "fi": 'Suomen Taiteilijaseuran managerointihanke, projektipäällikkö Kira Sjöberg',
                        "en": 'Finnish Artists Association management project, project manager Kira Sjöberg'
                    }
                },
                {
                    "start": year(2006),
                    "descriptions": {
                        "fi": 'Taiteen maisteri, Taideteollinen korkeakoulu, Helsinki',
                        "en": 'Master of Arts, UIAH, Helsinki'
                    }
                },
                {
                    "start": year(2002),
                    "descriptions": {
                        "fi": 'Tekstiilisuunnitteluartenomi, EVTEK Muotoiluinstituutti, Vantaa',
                        "en": 'Textile design artesan, EVTEK Institute of Design, Vantaa'
                    }
                },
                {
                    "start": year(1998),
                    "descriptions": {
                        "fi": 'Keramiikka-alan artesaani, Tammelan käsi- ja taideteollisuusoppilaitos, Tammela',
                        "en": 'Artesan of Ceramics, Tammela Institute of Arts and Crafts'
                    }
                }
            ]
        },
        "artisticActivity": {
            "titles": {
                "fi": 'Taiteellinen toiminta',
                "en": 'Artistic activity'
            },
            "selectPrivateExhibitions": {
                "titles": {
                    "fi": 'Valikoidut yksityisnäyttelyt',
                    "en": 'Select private exhibitions'
                },
                "values": [
                    {
                        "start": year(2012),
                        "descriptions": {
                            "fi": 'Vuotalon galleria, Helsinki (kutsuttuna)',
                            "en": 'Vuotalon galleria (invited)'
                        }
                    },
                    {
                        "start": year(2011),
                        "descriptions": {
                            "fi": 'Galleria Jangva, Helsinki',
                            "en": 'Jangva Gallery, Helsinki'
                        }
                    },
                    {
                        "start": year(2011),
                        "descriptions": {
                            "fi": 'Taidekeskus Mältinrannan Galleria, Tampere',
                            "en": 'Art Centre Mältinranta Gallery, Tampere'
                        }
                    }
                ]},
            "groupExhibitions": {
                "titles": {
                    "fi": 'Yhteisnäyttelyt',
                    "en": 'Group exhibitions'
                },
                "values": [
                    {
                        "start": year(2011),
                        "descriptions": {
                            "fi": 'Vesi - tunteita ja aistimuksia, Wäinö Aaltosen taidemuseo, Turku',
                            "en": 'Water - feelings and senses, Wäinö Aaltonen art museum, Turku'
                        }
                    },
                    {
                        "start": year(2011),
                        "descriptions": {
                            "fi": 'NYT2011 - Together, Raision Taidemuseo Harkko, Raisio',
                            "en": 'NYT2011 - Together, Harkko Art museum of Raisio, Raisio'
                        }
                    },
                    {
                        "start": year(2011),
                        "descriptions": {
                            "fi": 'ArteGround Art Festival, Viljandi, Viro',
                            "en": 'ArteGround Art Festival, Viljandi, Estonia'
                        }
                    },
                    {
                        "start": year(2011),
                        "descriptions": {
                            "fi": 'Factory Superstars, Helsingin Kaapelitehdas',
                            "en": 'Factory Superstars, Cable Factory, Helsinki'
                        }
                    }
                ]},
            "worksInCollections": {
                "titles": {
                    "fi": 'Teoksia kokoelmissa',
                    "en": 'Works in collections'
                },
                "values": [
                    {
                        "start": year(2008),
                        "descriptions": {
                            "fi": 'Suomen käsityön museo, Yksin - matkalaukkulamput, Jyväskylä',
                            "en": 'Finnish arts & crafts museum, Alone - luggage lamps, Jyväskylä'
                        }
                    },
                    {
                        "start": year(2004),
                        "descriptions": {
                            "fi": 'Borenius & Kemppisen taidekokoelmat, \'New Story\', Helsinki',
                            "en": 'Borenius & Kemppinen collection, \'New Story\', Helsinki'
                        }
                    }
                ]},
            "commissionedWorksPublicArt": {
                "titles": {
                    "fi": 'Tilaustyöt, julkinen taide',
                    "en": 'Commissioned works, public art'
                },
                "values": [
                    {
                        "start": year(2004),
                        "descriptions": {
                            "fi": 'Hotelli Hilton, keramiikkatyö \'Ei valmis koskaan\', Helsinki',
                            "en": 'Hotel Hilton, ceramics work \'Never Finished\', Helsinki'
                        }
                    },
                    {
                        "start": year(2001),
                        "descriptions": {
                            "fi": 'Helsingin messukeskus, Kipinä ja Ponnistus',
                            "en": 'Helsinki Fair Centre, Spark and Effort'
                        }
                    },
                    {
                        "start": year(2000),
                        "descriptions": {
                            "fi": 'Helsingin Messukeskus, Mahdollisuuksia',
                            "en": 'Helsinki Fair Centre, Possibilities'
                        }
                    }
                ]},
            "grants": {
                "titles": {
                    "fi": 'Apurahat',
                    "en": 'Grants'
                },
                "values": [
                    {
                        "start": year(2008),
                        "description": 'Oskar Öflunds Stiftelse'
                    },
                    {
                        "start": year(2006),
                        "descriptions": {
                            "fi": 'Valtion muotoilutoimikunta',
                            "en": 'National Design Committee'
                        }
                    }
                ]},
            "prizes": {
                "titles": {
                    "fi": 'Palkinnot',
                    "en": 'Prizes'
                },
                "values": [
                    {
                        "start": year(2005),
                        "descriptions": {
                            "fi": '1. sija, Life Science Center-taideteoskilpailu',
                            "en": '1st place, Life Science Center artwork competition'
                        }
                    }
                ]},
            "articles": {
                "titles": {
                    "fi": 'Lehtiartikkelit',
                    "en": 'Articles'
                },
                "values": [
                    {
                        "start": year(2009),
                        "description": 'Etelä-Suomen Sanomat, Uuden Kipinän näyttelyissä herää monia syviä tunteita, Jaana Parikka'
                    },
                    {
                        "start": year(2009),
                        "description": 'Uusi-Lahti, Kaipuu ja lohtu kietoutuvat yhteen, Heta Hassinen'
                    },
                    {
                        "start": year(2009),
                        "description": 'Etelä-Suomen Sanomat, Kuolema ja elämä on läsnä Kipinässä, Anne Siilahti'
                    },
                    {
                        "start": date(5, 8, 2009),
                        "description": 'Vihdin Uutiset, Vielä elämä on läsnä Kipinässä'
                    },
                    {
                        "start": date(18, 7, 2009),
                        "description": 'Karjalainen, Lähikuvia ja puhuva viherkasvi, Olli Sorjonen'
                    },
                    {
                        "start": month(7, 2009),
                        "description": 'Karjalan Heili, Öljytynnyri taivasta vasten'
                    },
                    {
                        "start": date(12, 6, 2009),
                        "description": 'Rannikkoseutu, Setelipaaleja ja koira kassissa, Susanna Palm'
                    }
                ]},
            "inPublications": {
                "titles": {
                    "fi": 'Julkaisuissa',
                    "en": 'In publications'
                },
                "values": [
                    {
                        "start": year(2008),
                        "descriptions": {
                            "fi": 'OTTO, Taiteilijat O, esittäytyminen Vantaan taidemuseossa 19.9.-3.1.2009',
                            "en": 'OTTO, Artists O, presentation at Vantaa Art Museum 19.9.-3.1.2009'
                        }
                    },
                    {
                        "start": year(2007),
                        "descriptions": {
                            "fi": 'Mäntän kulttuurin vuosikirja 2007, Gösta Serlachiuksen taidesäätiö, Mäntän kulttuuritoimisto ja Mäntän kuvataiteen ystävät Ry',
                            "en": 'Mänttä culture yearbook 2007, Gösta Serlachius art trust, Mänttä bureau of culture and Mänttä friends of visual art Ry'
                        }
                    },
                    {
                        "start": year(2005),
                        "descriptions": {
                            "fi": 'Voimat, Fiskarsin kesänäyttely',
                            "en": 'Voimat, Fiskars summer exhibition'
                        }
                    },
                    {
                        "start": year(2008),
                        "descriptions": {
                            "fi": 'Public Art, Taideteollinen korkeakoulu',
                            "en": 'Public Art, UIAH'
                        }
                    }
                ]},
            "memberships": {
                "titles": {
                    "fi": 'Jäsenyydet',
                    "en": 'Memberships'
                },
                "values": [
                    {
                        "description": 'Muu Ry'
                    },
                    {
                        "descriptions": {
                            "fi": 'Taiteilijat O Ry, varsinainen jäsen',
                            "en": 'Artists O Ry, full member'
                        }
                    },
                    {
                        "description": 'Kuvasto Ry'
                    },
                    {
                        "descriptions": {
                            "fi": 'Helsingin taiteilijaseura',
                            "en": 'Artist Society of Helsinki'
                        }
                    }
                ]},
            "residences": {
                "titles": {
                    "fi": 'Residenssit',
                    "en": 'Residences'
                },
                "values": [
                    {
                        "start": month(8, 2011),
                        "descriptions": {
                            "fi": 'Suomen ateljeesäätiö, Italia, Firenze',
                            "en": 'Finnish Atelier Foundation, Italy, Florence'
                        }
                    },
                    {
                        "start": month(1, 2010),
                        "end": month(2, 2010),
                        "descriptions": {
                            "fi": 'Suomen ateljeesäätiö, Italia, Firenze',
                            "en": 'Finnish Atelier Foundation, Italy, Florence'
                        }
                    },
                    {
                        "start": month(3, 2009),
                        "descriptions": {
                            "fi": 'Pohjois-Karjalan taidetoimikunta, Intia, Kochi',
                            "en": 'North Carelian art foundation, India, Kochi'
                        }
                    },
                    {
                        "start": year(2008),
                        "descriptions": {
                            "fi": 'Uudenmaan taidetoimikunta, Saksa, Berliini',
                            "en": 'Uusimaa art foundation, Germany, Berlin'
                        }
                    },
                    {
                        "start": year(2007),
                        "descriptions": {
                            "fi": 'Taiteilijat O, Meksiko, Oaxaca',
                            "en": 'Artists O, Mexico, Oaxaca'
                        }
                    }
                ]},
            "other": {
                "titles": {
                    "fi": 'Muut',
                    "en": 'Other'
                },
                "values": [
                    {
                        "start": year(2007),
                        "descriptions": {
                            "fi": 'Taiteilijat O, marraskuun kuukauden taiteilija',
                            "en": 'Artists O, November artist of the month'
                        }
                    },
                    {
                        "start": year(2005),
                        "descriptions": {
                            "fi": 'YLE1, Lauantaivekkari, viikon taiteilija',
                            "en": 'YLE1, Lauantaivekkari, artist of the week'
                        }
                    }
                ]}
        },
        "jobExperience": {
            "titles": {
                "fi": 'Työkokemus',
                "en": 'Job experience'
            },
            "values": [
                {
                    "start": year(2007),
                    "continuing": true,
                    "descriptions": {
                        "fi": 'Freelancer-kuvataideopettaja, mm. Espoon kuvataidekoulu, Tuusulan kunnan lasten kulttuurin taidepajoja, Helsingin kaupungin opetusvirasto Sininen verstas, Vantaan taidemuseon työpajoja',
                        "en": 'Freelancer visual arts teacher, Espoo school of visual arts, Tuusula county art workshops for children, Helsinki education bureau Sininen Verstas, Vantaa art museum workshops, and others'
                    }
                },
                {
                    "start": year(2007),
                    "end": year(2008),
                    "descriptions": {
                        "fi": 'Kurssisihteeri, Espoon kuvataidekoulu',
                        "en": 'Course secretary, Espoo school of visual arts'
                    }
                },
                {
                    "start": year(2004),
                    "end": year(2006),
                    "descriptions": {
                        "fi": 'Iltapäiväkerhon ohjaaja, Kaisaniemen ala-aste, Helsinki',
                        "en": 'Afternoon kids club counsellor, Kaisaniemi Grade School, Helsinki'
                    }
                },
                {
                    "start": year(2002),
                    "end": year(2007),
                    "description": 'Marimekko Oyj, Helsinki'
                },
                {
                    "start": year(2001),
                    "end": year(2002),
                    "descriptions": {
                        "fi": 'Kuvataideopettaja, Soukan taideseura, kuvataidekoulu Tatavuu, Espoo',
                        "en": 'Visual arts teacher, Soukka art society, visual arts school Tatavuu, Espoo'
                    }
                }
            ]}
    };
}

function cvDataWithArtisticActivitySectionAndTwoSubSections() {
    return {
        "_id" : {
            "$oid" : "04395495945"
        },
        "artisticActivity": {
            "titles": {
                "fi": 'Taiteellinen toiminta',
                "en": 'Artistic activity'
            },
            "selectPrivateExhibitions": {
                "title": 'Select private exhibitions',
                "values": [
                    {
                        "start": year(2012),
                        "end": year(2013),
                        "descriptions": {
                            "fi": 'Vuotalon galleria, Helsinki (kutsuttuna)',
                            "en": 'Vuotalon galleria (invited)'
                        }
                    },
                    {
                        "start": year(2011),
                        "granularity": 'year',
                        "continuing": true,
                        "descriptions": {
                            "fi": 'Galleria Jangva, Helsinki',
                            "en": 'Jangva Gallery, Helsinki'
                        }
                    },
                    {
                        "end": year(2011),
                        "granularity": 'year',
                        "descriptions": {
                            "fi": 'Taidekeskus Mältinrannan Galleria, Tampere',
                            "en": 'Art Centre Mältinranta Gallery, Tampere'
                        }
                    }
                ]},
            "groupExhibitions": {
                "titles": {
                    "fi": 'Yhteisnäyttelyt',
                    "en": 'Group exhibitions'
                },
                "values": [
                    {
                        "continuing": true,
                        "granularity": 'year',
                        "descriptions": {
                            "fi": 'Vesi - tunteita ja aistimuksia, Wäinö Aaltosen taidemuseo, Turku',
                            "en": 'Water - feelings and senses, Wäinö Aaltonen art museum, Turku'
                        }
                    },
                    {
                        "granularity": 'year',
                        "descriptions": {
                            "fi": 'NYT2011 - Together, Raision Taidemuseo Harkko, Raisio',
                            "en": 'NYT2011 - Together, Harkko Art museum of Raisio, Raisio'
                        }
                    },
                    {
                        "end": year(2011),
                        "granularity": 'year',
                        "continuing": true,
                        "descriptions": {
                            "fi": 'ArteGround Art Festival, Viljandi, Viro',
                            "en": 'ArteGround Art Festival, Viljandi, Estonia'
                        }
                    },
                    {
                        "start": month(6, 2011),
                        "granularity": 'month',
                        "continuing": false,
                        "descriptions": {
                            "fi": 'Factory Superstars, Helsingin Kaapelitehdas',
                            "en": 'Factory Superstars, Cable Factory, Helsinki'
                        }
                    },
                    {
                        "start": month(3, 2011),
                        "granularity": 'month',
                        "continuing": true,
                        "descriptions": {
                            "fi": 'Factory Superstars, Helsingin Kaapelitehdas',
                            "en": 'Factory Superstars, Cable Factory, Helsinki'
                        }
                    },
                    {
                        "start": month(3, 2011),
                        "end": month(6, 2011),
                        "granularity": 'month',
                        "continuing": true,
                        "descriptions": {
                            "fi": 'Factory Superczars, Helsingin Kaapelitehdas',
                            "en": 'Factory Superczars, Cable Factory, Helsinki'
                        }
                    },
                    {
                        "start": month(4, 2012),
                        "end": month(7, 2014),
                        "granularity": 'month',
                        "continuing": true,
                        "descriptions": {
                            "fi": 'Factory Barbapapas, Helsingin Kaapelitehdas',
                            "en": 'Factory Barbapapas, Cable Factory, Helsinki'
                        }
                    },
                    {
                        "start": date(24, 12, 2012),
                        "granularity": 'day',
                        "continuing": false,
                        "descriptions": {
                            "fi": 'Huppeli',
                            "en": 'Drunkenness'
                        }
                    },
                ]}
        }
    };
}

function cvItemTestData() {
    return {
        sectionSubsectionAnd28Items: [
            { type: "section" },
            { type: "subsection" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" }
        ],
        sectionSubsection5ItemsSectionAndAnItem: [
            { type: "section" },
            { type: "subsection" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "section" },
            { type: "item" }
        ],
        sectionSubsection5ItemsSubsectionAndAnItem: [
            { type: "section" },
            { type: "subsection" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "subsection" },
            { type: "item" }
        ],
        sectionSubsection4ItemsSectionSubsectionAndAnItem: [
            { type: "section" },
            { type: "subsection" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "item" },
            { type: "section" },
            { type: "subsection" },
            { type: "item" }
        ]
    };
}
