angular.module('BerlinApp')
    .controller('indexController',['$scope','$location','setHeadersToken','localStorageService', function ($scope,$location,setHeadersToken,localStorageService) {
        
        self = this;
        setHeadersToken.set();
        self.serverUrl='http://localhost:3005/';
        self.priorityOfDeleteArray=[];
   
        //show the name of the user/Guest
        if(localStorageService.get('userID')!=null){
            self.userName =localStorageService.get('userID');
        } 
        else{
            self.userName='Guest';  
        }

        //show the page of user that  is online 
        if(self.userName!='Guest' && self.userName!=undefined){
            state_login();  
        }
        
        
        // clear the local storage, update the users name to Guest and move the user to the home page
        self.pressLogout=function(){
            localStorageService.clearAll();
            state_logout();
            self.priorityOfDeleteArray=[];
            $scope.indexController.userName='Guest';
            $location.path('/');
            $location.replace();
        }

    }]);
