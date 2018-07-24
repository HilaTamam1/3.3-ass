angular.module('BerlinApp')
    .controller('registertionController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        let serverUrl=$scope.indexController.serverUrl;

        $scope.valCat=false;
        $scope.user = {
            userID: "",
            password: "",
            firstName: "",
            lastName: "",
            city: "",
            email: "",
            que1: "What is the name of your elementary school?",
            ans1: "",
            que2: "what is mothers maiden name?",
            ans2: "",
            country: "Israel",
            cat1: '0',
            cat2: '0',
            cat3: '0',
            cat4: '0'
        }
        $scope.cats = { cat1: "", cat2: "", cat3: "", cat4: "" }
        
        //update the list of the countries according the the XML file
        $http.get(serverUrl+'guests/countries').then(Response => {
            $scope.countries = Response.data;
             console.log($scope.countries);
        })

        //check if the form is valid
        $scope.submitForm = function(isValid) {
            $scope.valCat=($scope.cats.cat1 && $scope.cats.cat2)||($scope.cats.cat1 && $scope.cats.cat3)||($scope.cats.cat1 && $scope.cats.cat4)||($scope.cats.cat2 && $scope.cats.cat3)||($scope.cats.cat2 && $scope.cats.cat4)||($scope.cats.cat3 && $scope.cats.cat4);
            // check to make sure the form is completely valid
            if($scope.valCat==false)
                return;
            if (isValid) {
                reg();
            }              
            
        }

        //insert to the DB the information about the user. 
        function reg() {
            // console.log($scope.cats.cat1);
            // console.log($scope.cats.cat2);
            // console.log($scope.cats.cat3);
            // console.log($scope.cats.cat4);

            if ($scope.cats.cat1 == true)
                $scope.user.cat1 = '1';
            if ($scope.cats.cat2 == true)
                $scope.user.cat2 = '1';
            if ($scope.cats.cat3 == true)
                $scope.user.cat3 = '1';
            if ($scope.cats.cat4 == true)
                $scope.user.cat4 = '1';

            // console.log($scope.user)
            $http.post(serverUrl + 'guests/register', $scope.user).then(Response => {
                $scope.res = Response.data;
                console.log($scope.res)
                if ($scope.res == true) {
                    alert('Now, You can log into the website! :)');
                    $location.path('/');
                    $location.replace();
                }
            })
        }
    }]);