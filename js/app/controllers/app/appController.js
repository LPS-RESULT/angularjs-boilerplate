/**
 * Created by Jason Wong on 4/9/2017.
 */
(function(angular) {
    "use strict";

    /**
     * The main controller for the default app route
     */
    angular.module("app")
        .controller("appController", ["$scope","Parcel","$category",
            function($scope,Parcel,$category) {
                //default parcel value
                $scope.parcel = new Parcel(0,0,0,0);

                //generates {cost: <number>, category: <name>}
                $scope.summary = $category.categorize($scope.parcel);

                //Executes whenever there are changes to the parcel values
                $scope.onParcelValueChange = function(){
                    $scope.summary = $category.categorize($scope.parcel);
                };
            }
        ]);
})(angular);
