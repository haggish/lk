'use strict';

angular.module('lk.directives', []).
    directive('newsitem', function () {
        return {
            scope : {
                newsitem : "=name"
            },
            restrict : 'E',
            // templateUrl : 'partials/newsitem.html', <-- unused to make local fs testing work on chrome
            template :
                '<div class="newsitem">' +
                    '<div ng-show="newsitem.type == \'newsitem\'">' +
                        '{{newsitem.textBeforeLink}} <a href="{{newsitem.link}}">{{newsitem.linkDescription}}</a> {{newsitem.textAfterLink}}' +
                    '</div>' +
                    '<div ng-show="newsitem.type == \'event\'" itemscope itemtype="http://data-vocabulary.org/Event">' +
                    '<span itemprop="location" itemscope itemtype="http://data-vocabulary.org/Organization">' +
                        '<span itemprop="name">{{newsitem.get(\'placeName\')}}</span>' +
                        '<span itemprop="geo" itemscope itemtype="http://data-vocabulary.org/Geo">' +
                            '<meta itemprop="latitude" content="{{newsitem.location.lat}}"/>' +
                            '<meta itemprop="longitude" content="{{newsitem.location.lon}}"/>' +
                        '</span>' +
                    '</span>: ' +
                        '<a href="{{newsitem.eventLink}}">' +
                            '<span itemprop="summary">{{newsitem.get(\'eventName\')}}</span>' +
                        '</a>' +
                        ' <time itemprop="startDate" datetime="{{newsitem.eventStart}}">{{newsitem.eventStartString()}}</time>' +
                    '<span ng-hide="newsitem.eventEnd == undefined">' +
                        '-<time itemprop="endDate" datetime="{{newsitem.eventEnd}}">{{newsitem.eventEndString()}}</time>' +
                    '</span>' +
                    '<span ng-hide="newsitem.get(\'description\') == undefined && newsitem.get(\'descriptions\') == undefined">' +
                        ' - <span itemprop="description">{{newsitem.get(\'description\')}}</span>' +
                    '</span>' +
                    '</div>' +
                '</div>',
            replace : true
        }
    })
    .directive('tollo', function () {
        return {
            restrict : 'E',
            scope : {
                number : '@',
                link : '@'
            },
            template :
                '<div id="{{link}}Link">' +
                    '<br/>' +
                    '<a href="#/{{link}}">' +
                        '<img ng-src="img/tollo{{number}}.jpg" class="img-circle">' +
                    '</a>'+
                '</div>',
            replace : true
        };
    });
