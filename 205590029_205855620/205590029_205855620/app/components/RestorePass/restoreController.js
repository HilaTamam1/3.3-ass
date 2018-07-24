angular.module('BerlinApp')
    .controller('restoreController', ['$scope', '$http', function ($scope, $http) {
        let serverUrl='http://localhost:3005/';
        $scope.user = {
            userID:"",
            securityAns1:"",
            securityAns2:""
        }
        $scope.show1=true;
        $scope.show2=false;
        $scope.show3=false;

        // get the question fron the DB to restore the password , if the user name is not correct show error
        $scope.checkUser = function () {
            $http.post(serverUrl+'guests/securityQues', $scope.user).then(Response => {
                $scope.user.ques = Response.data;
                if($scope.user.ques == "no user")
                    $scope.error="please enter correct user name";
                else
                {
                    $scope.error="";
                    $scope.show1=false;
                    $scope.show2=true;

                    $scope.que1 = $scope.user.ques[0].que1;
                    $scope.que2 = $scope.user.ques[0].que2;
                }
            })
        }
        // this function check the answers of the user and show error according to his answers
        $scope.checkAns = function () {
            $http.post(serverUrl+'guests/restorePassword', $scope.user).then(Response => {
                $scope.user.ans = Response.data;
                console.log($scope.user.ans);
                if($scope.user.ans == "you'r first answer is incorrect, try again!" ||$scope.user.ans == "you'r second answer is incorrect, try again!")
                    $scope.error="one or more of your answers are incorrect, try again!";
                else 
                {
                    $scope.error="";
                    $scope.show2=false;
                    $scope.show3=true;
                    $scope.pass = $scope.user.ans;
                }
            })
        }
    }]);



    