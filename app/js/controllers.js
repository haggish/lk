'use strict';

angular.module('lk.controllers', [])

    .controller('IndexCtrl', ['$scope', 'TextData', 'CfgData', 'NewsData',
    function ($scope, TextData, CfgData, NewsData) {
        "use strict";

        $scope.text = TextData;
        $scope.text.init();
        $scope.cfg = CfgData;
        $scope.cfg.init();
        $scope.news = NewsData;
        $scope.news.init();
    }])

    .controller('CVCtrl', ['$scope', 'TextData', 'CVData',
    function ($scope, TextData, CVData) {
        "use strict";

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
            $scope.cvPage = $scope['page' + $scope.currentPage];
        };

        $scope.selectPageHandler = function (pageNo) {
            $scope.cvPage = $scope['page' + pageNo];
        };

        $scope.text = TextData;
        $scope.text.init();
        $scope.cv = CVData;
        $scope.cv.init(function (data) {
            if (!$scope['page' + $scope.currentPage] && data.flattened) {
                var page = 1, lines = [], lineLength = 0;
                var activeType, activeSubtype;
                data.flattened.forEach(function (cvLine) {
                    var maxLines = page == 1 ? 10 : 20;
                    if (cvLine.type === 'type') {
                        activeType = cvLine;
                        activeSubtype = undefined;
                    } else if (cvLine.type === 'subtype') {
                        activeSubtype = cvLine;
                    }
                    if (lineLength <= maxLines) {
                        lines.push(cvLine);
                    } else {
                        if (lines[lines.length - 1].type === 'subtype') {
                            lines.pop();
                        }
                        if (lines[lines.length - 1].type === 'type') {
                            lines.pop();
                        }
                        $scope['page' + page] = lines;
                        page++;
                        lines = [];
                        lineLength = 0;
                        if (activeType) {
                            lines.push(activeType);
                            lineLength += 2;
                        }
                        if (activeSubtype) {
                            lines.push(activeSubtype);
                            lineLength += 2;
                        }
                        if (cvLine !== activeType && cvLine !== activeSubtype) {
                            lines.push(cvLine);
                        }
                    }
                    cvLine.type === 'line' ? lineLength++ : lineLength += 2;
                });
                $scope['page' + page] = lines;
                $scope.noOfPages = lines.length > 0 ? page : (page - 1);
                $scope.setPage(1);
            }
        });
    }])

    .controller('WorksCtrl', ['$scope', 'TextData', 'WorksData',
    function ($scope, TextData, WorksData) {
        "use strict";

        $scope.works = WorksData;
    }]);