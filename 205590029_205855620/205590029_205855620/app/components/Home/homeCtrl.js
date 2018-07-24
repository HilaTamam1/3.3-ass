angular.module('BerlinApp')
    .controller('homeCtrl', ['localStorageService', 'setHeadersToken', '$scope', '$location', '$http', 'directToPOI', function (localStorageService, setHeadersToken, $scope, $location, $http, directToPOI) {

        let serverUrl = $scope.indexController.serverUrl;
        setHeadersToken.set();
        $scope.indexController.userName = setHeadersToken.userName;

        $scope.user = {
            userID: "",
            password: "",
        }
        $scope.error = "";

        // The function takes the user to the registration page
        $scope.Registertion = function () {
            $location.path('/Registertion');
            $location.replace();
        };

        // The function takes the user to the PointDetails page
        $scope.PointDetails = function (pointID) {
            directToPOI.PointDetails(pointID);
        };

        // The function takes the user to the Restore Password page
        $scope.restorePage = function () {
            $location.path('/RestorePass');
            $location.replace();
        };


        // The function returns 3 random points above the 3 rating (for the explore window)
        let certainRate = '3';
        $http.get(serverUrl + 'guests/popPointInLoad/' + certainRate).then(response => {
            $scope.randPoint = response.data;
            // console.log($scope.randPoint);
        }).catch((err) => {
            console.log(err);
        });

        //login function - show error if the values are bad or if the Authentication is wrong
        //if the Authentication is success take the user to his page. 
        $scope.login = function () {
            $scope.error = "";
            $http.post(serverUrl + 'guests/login', $scope.user).then(Response => {
                $scope.res = Response.data;
                if ($scope.res.success == false)
                    $scope.error = $scope.res.message;
                else {
                    $scope.error = "";
                    localStorageService.set('token', $scope.res.token);
                    localStorageService.set('userID', $scope.user.userID);
                    state_login();
                    $scope.indexController.userName = localStorageService.get('userID');
                    $location.path('/MyPage');
                    $location.replace();
                }
            })
        };
    }]);