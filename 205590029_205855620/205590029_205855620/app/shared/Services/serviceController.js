angular.module('BerlinApp')
    // set token on headers
    .service('setHeadersToken',[ '$http','localStorageService', function ($http,localStorageService) {
        self = this;

        self.set = function () {
            if(localStorageService.get('token')!=null){
                $http.defaults.headers.common[ 'x-access-token'] =localStorageService.get('token');
            }
            
        }
        self.userName='Guest';
    }])
    //update the localStorage in the favorite points of the user
    .service('setFavToLS',[ '$http','localStorageService', function ($http,localStorageService) {
        self = this;

        self.set = function (serverUrl) {
            $http.get(serverUrl+'auth/users/favPoints').then(response => {
                var favPoints=response.data;
                for(let i=0; i<favPoints.length; i++){
                
                    localStorageService.set(favPoints[i].pointID,favPoints[i]);
                }
                console.log(localStorageService.keys());
            }).catch((err) => {
                console.log(err);
            });
        }
        

    }])
    //return the amount of favorite points in the localStorage
    .service('numOfFav',[ 'localStorageService', function (localStorageService) {
        self = this;

        self.get = function () {
            let storage=localStorageService.keys();
            return storage.length-2;
        }
        

    }])
    //update the prioroity of relevant points in  the local storage
    .service('priorityUpdate',['localStorageService', function (localStorageService) {
        self = this;

        self.update = function (deleted) {
            let favLS=localStorageService.keys();
            for(let i=0; i<favLS.length;i++){
                if(favLS[i]!='token' && favLS[i]!='userID'){
                    pointInfo=localStorageService.get(favLS[i]);
                    if(pointInfo.priority>deleted){
                        pointInfo.priority-=1;
                        localStorageService.set(pointInfo.pointID,pointInfo);
                    }
                }
            }
        }

    }])
    // pass the user to the page with the info of specific point
    .service('directToPOI',['$location', function ($location) {
        self = this;

        self.PointDetails = function (pointID) {
            $location.path('PointDetails/'+pointID);
            $location.replace();
        };

    }]);