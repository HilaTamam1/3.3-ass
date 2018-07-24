let app = angular.module('BerlinApp', ["ngRoute", 'LocalStorageModule']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {



    $locationProvider.hashPrefix('');


    $routeProvider.when('/', {
        templateUrl: 'components/Home/home.html',
        controller: 'homeCtrl as homeCtrl'
    })
    .when('/MyPage', {
        templateUrl: 'components/MyPage/myPage.html',
        controller: 'myPageController as myPageController'
    })
   .when('/Registertion', {
        templateUrl: 'components/Registertion/registertion.html',
        controller: 'registertionController as registertionController'
    })
    .when('/RestorePass', {
        templateUrl: 'components/RestorePass/restorPas.html',
        controller: 'restoreController as restoreController'
    })
   .when('/About', {
        templateUrl: 'components/About/about.html',
        controller: 'aboutController as aboutController'
    })
    .when('/POI', {
        templateUrl: 'components/POI/poi.html',
        controller: 'poiCtrl as poiCtrl'
    })
    .when('/PointDetails/:pointID', {
        templateUrl: 'components/PointDetails/pointDetails.html',
        controller: 'pointDetailsController as pointDetailsController'
    })
    .when('/Favorites', {
        templateUrl: 'components/Favorites/favorites.html',
        controller: 'favoritesController as favoritesController'
    })
    // .when('/Services', {
    //     templateUrl: 'components/Services/service.html',
    //     controller: 'serviceController as serviceController'
    // })
    .otherwise({ redirectTo: '/' });

        
}]);










