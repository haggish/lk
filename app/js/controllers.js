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
                var page = 1, items = [], itemLength = 0;
                var activeSection, activeSubsection;
                data.flattened.forEach(function (cvItem) {
                    var maxItems = page == 1 ? 10 : 20;
                    if (cvItem.type === 'section') {
                        activeSection = cvItem;
                        activeSubsection = undefined;
                    } else if (cvItem.type === 'subsection') {
                        activeSubsection = cvItem;
                    }
                    if (itemLength <= maxItems) {
                        items.push(cvItem);
                    } else {
                        if (items[items.length - 1].type === 'subsection') {
                            items.pop();
                        }
                        if (items[items.length - 1].type === 'section') {
                            items.pop();
                        }
                        $scope['page' + page] = items;
                        page++;
                        items = [];
                        itemLength = 0;
                        if (activeSection) {
                            items.push(activeSection);
                            itemLength += 2;
                        }
                        if (activeSubsection) {
                            items.push(activeSubsection);
                            itemLength += 2;
                        }
                        if (cvItem !== activeSection &&
                            cvItem !== activeSubsection) {
                            items.push(cvItem);
                        }
                    }
                    cvItem.type === 'item' ? itemLength++ : itemLength += 2;
                });
                $scope['page' + page] = items;
                $scope.noOfPages = items.length > 0 ? page : (page - 1);
                $scope.setPage(1);
            }
        });
    }])

    .controller('WorksCtrl', ['$scope', 'TextData', 'WorksData',
    function ($scope, TextData, WorksData) {
        "use strict";

        $scope.works = WorksData;
    }]);