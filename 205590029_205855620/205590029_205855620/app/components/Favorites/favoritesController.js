angular.module('BerlinApp')
 .controller('favoritesController', ['$http','$scope','$location','localStorageService','setHeadersToken','directToPOI','priorityUpdate',function($http,$scope,$location,localStorageService,setHeadersToken,directToPOI,priorityUpdate) { 
    let serverUrl=$scope.indexController.serverUrl;
    
    if (localStorageService.get('userID')!=null){
        $scope.indexController.userName=localStorageService.get('userID');
    }
    setHeadersToken.set();

    $scope.show1 = true;
    $scope.show2 = true;

    //create array 'favPoints' of favorite points from the local storage
    function createFavPoint(){
        var j=0;
        $scope.favPoints=[];
        var storage=localStorageService.keys();
    
        for (let i=0; i<storage.length;i++) {
            if (storage[i]!='token' && storage[i]!='userID') {
                $scope.favPoints[j]=localStorageService.get(storage[i]);
                j++;   
            }
        }
    }
    createFavPoint();
    $scope.propertyName = '';
    $scope.reverse = false;
    //Responsible for sorting by field from large to small and vice versa
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : true;
        $scope.propertyName = propertyName;
    }; 
    
    //delete locally the point from the favorites of the user    
    $scope.updateFav=function(point){
        if($scope.inFav(point)){
            let deleted=localStorageService.get(point).priority;
            $scope.indexController.priorityOfDeleteArray[$scope.indexController.priorityOfDeleteArray.length]=deleted;
            localStorageService.remove(point);
            priorityUpdate.update(deleted);
            createFavPoint();
            findAndDelete(point);
        }
    }

    //check if the point of interest is in the favorites according to the localStorage
    $scope.inFav=function(point){
        if(localStorageService.get(point)!=null)
            return true;
        else return false;
    }
    //update the priority fo points in the localStorage from array 'favPoints'
    function updatePriority(){
        let pointToUp={};
        let value;
        for (let i=0; i<$scope.favPoints.length;i++) {
            pointToUp={
                pointID: "",
                priority:""
            };
            point=localStorageService.get($scope.favPoints[i].pointID);
            value=parseInt($scope.favPoints[i].priority);
            if(point.priority!==value){
                point.priority=value;
                pointToUp.priority=value;
                pointToUp.pointID=$scope.favPoints[i].pointID;
                localStorageService.set($scope.favPoints[i].pointID,point);
                $http.post(serverUrl + 'auth/users/priority',pointToUp)
                .then(response => {
                    console.log(response.data);     
                })
            }
        }
    }
    //sort down the point according to the order by user
    $scope.swapDown=function(point){
        let index =findInFavPoint(point);
        if($scope.favPoints[index].priority<$scope.favPoints.length){
            let prePriority=$scope.favPoints[index].priority;
            // console.log(prePriority);
            $scope.favPoints[index].priority+=1;
            // console.log($scope.favPoints[index].priority);
            for(let i=0; i<$scope.favPoints.length ; i++){
                if(i!=index && $scope.favPoints[i].priority===$scope.favPoints[index].priority )
                $scope.favPoints[i].priority=prePriority;

            }   
        }
        else{
            alert("This is the minimum priority")
        }
    }
    //sort down the point according to the order by user
    $scope.swapUp=function(point){
        let index =findInFavPoint(point);
        if($scope.favPoints[index].priority>1){
            let prePriority=$scope.favPoints[index].priority;
            // console.log(prePriority);
            $scope.favPoints[index].priority-=1;
            // console.log($scope.favPoints[index].priority);
            for(let i=0; i<$scope.favPoints.length ; i++){
                if(i!=index && $scope.favPoints[i].priority===$scope.favPoints[index].priority )
                $scope.favPoints[i].priority=prePriority;

            }
        }
        else{
            alert("This is the maximum priority")
        }
    }


    // move to page with the info of a specific point 
    $scope.PointDetails = function (pointID) {
        directToPOI.PointDetails(pointID);
    };
    //find point in array 'favPoints', delete it and update the priority of the rest relvant point
    function findAndDelete(pointID){
        var temp_favPoints=$scope.favPoints;
        var priorityOfPoint;
        for (let i=0; i<temp_favPoints.length;i++) {
            if (temp_favPoints[i].pointID==pointID) {
                priorityOfPoint=temp_favPoints[i].priority;
                $scope.favPoints.splice(i,1);
            }
        }  
        for (let i=0; i<temp_favPoints.length;i++) {
            if (temp_favPoints[i].priority>priorityOfPoint) {
                $scope.favPoints[i].priority-=1;
                
            }
        }
    }
    //update DB in all points that add/deleted to/from favorites in the localStorage
    $scope.saveToDB=function(){
        var favPointsLS=localStorageService.keys();//LS=LocalStorage
        var favPointsDB=[];
        $http.get(serverUrl+'auth/users/favPoints').then(response => {
            $scope.favDB=response.data;
            for(let i=0; i<$scope.favDB.length; i++){
                favPointsDB[i]=$scope.favDB[i].pointID;
            }           
            console.log(favPointsDB);
            console.log(favPointsLS);
            for(let i=0; i<favPointsLS.length; i++){
                if(favPointsLS[i]!='token' && favPointsLS[i]!='userID'){
                    if(!favPointsDB.includes(favPointsLS[i])){
                        var point={
                            pointID: favPointsLS[i],
                            priority: $scope.favPoints[findInFavPoint(favPointsLS[i])].priority
                        }
                        $http.post(serverUrl+'auth/users/pointAsFav',point).then(response => {
                            console.log(response);                    
                        }).catch((err) => {
                            console.logs(err);  
                        });         
                    }
                }
            }
            for(let i=0; i<favPointsLS.length; i++){
                if(!favPointsLS.includes(favPointsDB[i])){
                    $http.delete(serverUrl+'auth/users/pointAsFav/'+favPointsDB[i]).then(response => {
                        console.log(response);                    
                    }).then(function(){
                        updateDB();
                    })
                    .catch((err) => {
                        console.log(err);  
                    });         
                }
            }

        }).then(function(){
            updatePriority();
        });
  

    }
    // update the DB in the changes in priority of points
     function updateDB(){
        let pointToUp={};
        let minDeleted=21;
        let favLS=[];
        for(let i=0;i<$scope.indexController.priorityOfDeleteArray.length;i++){
            if($scope.indexController.priorityOfDeleteArray[i]<minDeleted)
            minDeleted= $scope.indexController.priorityOfDeleteArray[i];
        }
        if(minDeleted!=21 )
        favLS=localStorageService.keys();
        for(let i=0; i<favLS.length;i++){
            pointToUp={
            pointID: "",
            priority:""
            };
            if(favLS[i]!='token' && favLS[i]!='userID'){
                pointInfo=localStorageService.get(favLS[i]);
                if(pointInfo.priority>=minDeleted){
                    pointToUp.pointID=pointInfo.pointID;
                    pointToUp.priority=pointInfo.priority;
                    $http.post(serverUrl + 'auth/users/priority',pointToUp)
                    .then(response => {
                        console.log(response.data);     
                    })
                }
            }
        }
    }
    //find index of specific point array 'favPoints'
    function findInFavPoint(pointID) {
        for (let i = 0; i < $scope.favPoints.length; i++) {
            if ($scope.favPoints[i].pointID=== pointID) {
                return i;
            }
        }
    }
    
    $scope.review_rate = {
        rate: "",
        pointID: "",
        review: ""
    }
    $scope.res = ""
    $scope.error1 = "";
    $scope.error2 = "";

    $scope.show = function () {
        $scope.show1 = true;
        $scope.show2 = true;
        $scope.error1 = "";
        $scope.error2 = "";
        $scope.review_rate.review = "";
    }
    //responsible for updating the server to the numerical rating that the user has given
    $scope.rateInNumber = function (pointID) {
        if ($scope.review_rate.rate == "") {
            $scope.error1 = "please insert rate";
        }
        else {
            $scope.error1 = "";
            $scope.review_rate.rate = parseInt($scope.review_rate.rate);
            console.log($scope.review_rate.rate);
            $scope.review_rate.pointID = pointID;
            $http.post(serverUrl + 'auth/users/ratePoint', $scope.review_rate).then(Response => {
                $scope.res = Response.data;
                console.log($scope.res);
                if ($scope.res == true) {
                    
                    $http.get(serverUrl+'guests/pointInfo/'+pointID).then(response => {
                        localStorageService.remove(pointID);
                        localStorageService.set(pointID,response.data.point[0]);
                        $scope.favPoints[findInFavPoint(pointID)]=response.data.point[0];
                    }).catch((err) => {
                        console.log(err);
                    });

                    $scope.error1 = "your rate was inserted to the system";
                    $scope.show1 = false;
                }
                else
                    $scope.error1 = "please try again";
            })
        }
    };
    //responsible for updating the server to the verbal rating that the user gave
    $scope.rateInWords = function (pointID) {
        if ($scope.review_rate.review == "") {
            $scope.error2 = "please insert review";
        }
        else {
            $scope.error2 = "";
            console.log($scope.review_rate.review);
            $scope.review_rate.pointID = pointID;
            console.log($scope.review_rate);
            $http.post(serverUrl + 'auth/users/review', $scope.review_rate).then(Response => {
                $scope.res = Response.data;
                console.log($scope.res);
                if ($scope.res == true) {
                    $scope.error2 = "your review was inserted to the system";
                    $scope.show2 = false;

                }
                else
                    $scope.error2 = "you already gave review in this day, please give review in another day";
            })
        }
    };


 }]);