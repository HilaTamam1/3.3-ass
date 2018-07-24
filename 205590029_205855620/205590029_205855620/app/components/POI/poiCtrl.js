angular.module('BerlinApp')
    .controller('poiCtrl', ['$scope', '$location', '$http', '$filter', 'localStorageService', 'setHeadersToken', 'directToPOI', 'setFavToLS', 'numOfFav', 'priorityUpdate', function ($scope, $location, $http, $filter, localStorageService, setHeadersToken, directToPOI, setFavToLS, numOfFav, priorityUpdate) {
        let serverUrl = $scope.indexController.serverUrl;
        setHeadersToken.set();
        $scope.login = false;
        if (localStorageService.get('userID') != 'Guest' && localStorageService.get('userID') != undefined) {
            $scope.login = true;
        }


        $scope.numOfFAv = numOfFav.get();
        $scope.propertyName = 'rate';
        $scope.reverse = true;
        //Responsible for sorting by field from large to small and vice versa
        $scope.sortBy = function (propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        $http.get(serverUrl + 'guests/points').then(response => {
            $scope.points = response.data;
            console.log($scope.points);
        }).catch((err) => {
            console.log(err);
        });
        $scope.searchCategory = "All";
        
        //delet locally the point from the favorites of the user or add locally to the local storage specific point   
        $scope.updateFav = function (point) {
            let deleted;
            if (localStorageService.get(point) != null) {
                deleted = localStorageService.get(point).priority;
                $scope.indexController.priorityOfDeleteArray[$scope.indexController.priorityOfDeleteArray.length]=deleted;
                localStorageService.remove(point);
                $scope.numOfFav--;
                priorityUpdate.update(deleted);
                $scope.inFav(point);
            }
            else{
                let pointfav={
                    pointID: point,
                    priority: $scope.numOfFAv+1
                }
                $http.post(serverUrl+'auth/users/pointAsFav',pointfav).then(response => {
                    console.log(response);   
                    setFavToLS.set(serverUrl);
                    $scope.inFav(point);
                    $scope.numOfFAv++;
                    $http.delete(serverUrl+'auth/users/pointAsFav/'+point).then(response => {
                        console.log(response);                    
                    }).catch((err) => {
                        console.log(err);  
                    });                   
                }).catch((err) => {
                    console.log(err);  
                }); 
            }
        }

        //check if the point of interest is in the favorites according to the localStorage
        $scope.inFav = function (point) {
        if (localStorageService.get(point) != null) 
            {
                 return true;
            }
                return false;
        }
        // move to page with the info of a specific point 
        $scope.PointDetails = function (pointID) {
            directToPOI.PointDetails(pointID);
        };
        // move to page of favorite points
        $scope.favPage = function () {
            $location.path('Favorites');
            $location.replace();
        };
        //get form server DB all the points by category
        $scope.PointsByCat = function () {
            if ($scope.searchCategory == "All") {
                $http.get(serverUrl + 'guests/points').then(response => {
                    $scope.points = response.data;
                    console.log($scope.points);
                }).catch((err) => {
                    console.log(err);
                });
            }
            else
            {
                $http.get(serverUrl + 'guests/pointsAccCat/' + $scope.searchCategory).then(response => {
                    $scope.points = response.data;
                    console.log($scope.points);
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

    }]);