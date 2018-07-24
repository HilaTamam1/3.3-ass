angular.module('BerlinApp')
 .controller('myPageController', ['localStorageService','setHeadersToken','$scope','$location','$http','directToPOI', function(localStorageService,setHeadersToken,$scope,$location,$http,directToPOI) {
    
    let serverUrl=$scope.indexController.serverUrl;
    setHeadersToken.set();
    $scope.indexController.userName=localStorageService.get('userID');

    $scope.error="There are no points of interest in favorites";
    $scope.errorShow=false;

    //show 2 favorite point of the user or show error if there are no points of interest in favorites
    $http.get(serverUrl+'auth/users/2favPoints').then(response => {
        $scope.favPoints=response.data;
        if($scope.favPoints=="There are no points of interest in favorites")
        {
            $scope.errorShow=true;
        }
        else
        {
            $scope.errorShow=false;
        }
    }).catch((err) => {
        console.log(err);
    });

    //show 2 popular points according to the categories of the user
    $http.get(serverUrl+'auth/users/2popularPoints').then(response => {
        $scope.popularPoints=response.data.points;
    }).catch((err) => {
        console.log(err);
    });

    // The function takes the user to the PointDetails page
    $scope.PointDetails = function (pointID) {
        directToPOI.PointDetails(pointID);
    };

    //insert to the local Storage the favorite point of the user from the DB
    $http.get(serverUrl+'auth/users/favPoints').then(response => {
        var favPoints=response.data;
        for(let i=0; i<favPoints.length; i++){
            localStorageService.set(favPoints[i].pointID,favPoints[i]);
        }
        // console.log(localStorageService.keys());
    }).catch((err) => {
        console.log(err);
    });
 }]);