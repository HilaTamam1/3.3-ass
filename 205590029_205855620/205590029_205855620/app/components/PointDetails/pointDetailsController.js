angular.module('BerlinApp')
 .controller('pointDetailsController', ['localStorageService','setHeadersToken','$scope', '$http','setFavToLS', 'numOfFav','priorityUpdate', function (localStorageService,setHeadersToken,$scope, $http,setFavToLS,numOfFav,priorityUpdate) {
    
    let serverUrl=$scope.indexController.serverUrl;
    //bonus of the map
    var mymap = L.map('map').setView([52.554354, 13.474712], 10);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiaGlsYXQiLCJhIjoiY2pqcGp6am0zN2F5djN3czI2aGQ2ZHI0NyJ9.Z1pMcrvhslJ6jq9-PSy4ug'
    }).addTo(mymap);

    setHeadersToken.set();
    //check if the user login
    $scope.login=false;
    if (localStorageService.get('userID')!='Guest' && localStorageService.get('userID')!=undefined){
        $scope.login=true;
    }
    // console.log($scope.login);

    let pointId=document.URL.split('/')[6];
    //check if the point_of_interest is in the favorites according to the localStorage
    $scope.inFav=function(){ 
        if(localStorageService.get(pointId)!=null){
            return true;
        }
        else return false;
    }
    //delet locally the point from the favorites of the user or add locally specific point to the local storage   
    $scope.updateFav=function(){
        let deleted;
        if (localStorageService.get(pointId) != null) {
            deleted = localStorageService.get(pointId).priority;
            $scope.indexController.priorityOfDeleteArray[$scope.indexController.priorityOfDeleteArray.length]=deleted;
            localStorageService.remove(pointId);
            priorityUpdate.update(deleted);
            $scope.inFav(pointId);
        }
        else{
            let pointfav={
                pointID: pointId,
                priority: numOfFav.get()+1
            }
            $http.post(serverUrl+'auth/users/pointAsFav',pointfav).then(response => {
                console.log(response);   
                setFavToLS.set(serverUrl);
                $scope.inFav(pointId);
                $http.delete(serverUrl+'auth/users/pointAsFav/'+pointId).then(response => {
                    console.log(response);                    
                }).catch((err) => {
                    console.log(err);  
                });                   
            }).catch((err) => {
                console.log(err);  
            }); 
        }
    }
    //get all the details of specific point from the server
    $http.get(serverUrl+'guests/pointInfo/'+pointId).then(response => {
        $scope.pointDet=response.data;
        var marker = L.marker([$scope.pointDet.point[0].x, $scope.pointDet.point[0].y]).addTo(mymap);
        marker.bindPopup("<b>"+$scope.pointDet.point[0].name+"</b>").openPopup();
        // $scope.inFav=false;
        $scope.pointDet.reviews[0].date=$scope.pointDet.reviews[0].date.substring(0,10);
        $scope.pointDet.reviews[1].date=$scope.pointDet.reviews[1].date.substring(0,10);
        console.log($scope.pointDet);
    }).catch((err) => {
        console.log(err);
    })

}]);