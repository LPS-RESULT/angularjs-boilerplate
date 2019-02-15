describe('AppController', function() {
    beforeEach(module('app')); //load the angular module 'app'

    var $controller;

    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    it('Must categorize to "Medium" at $80 when weight is 10, height is 20, width is 5, depth is 20', function() {
        var $scope = {};
        var controller = $controller('appController', { $scope: $scope });
        $scope.parcel.weight = 10;
        $scope.parcel.height = 20;
        $scope.parcel.width = 5;
        $scope.parcel.depth = 20;
        $scope.onParcelValueChange();
        expect($scope.summary.cost).toEqual(80);
        expect($scope.summary.category).toEqual('medium');
    });

    it('Must categorize to "Heavy" at $330 when weight is 22, height is 5, width is 5, depth is 5', function() {
        var $scope = {};
        var controller = $controller('appController', { $scope: $scope });
        $scope.parcel.weight = 22;
        $scope.parcel.height = 5;
        $scope.parcel.width = 5;
        $scope.parcel.depth = 5;
        $scope.onParcelValueChange();
        expect($scope.summary.cost).toEqual(330);
        expect($scope.summary.category).toEqual('heavy');
    });

    it('Must categorize to "Small" at $18 when weight is 2, height is 3, width is 10, depth is 12', function() {
        var $scope = {};
        var controller = $controller('appController', { $scope: $scope });
        $scope.parcel.weight = 2;
        $scope.parcel.height = 3;
        $scope.parcel.width = 10;
        $scope.parcel.depth = 12;
        $scope.onParcelValueChange();
        expect($scope.summary.cost).toEqual(18);
        expect($scope.summary.category).toEqual('small');
    });

    it('Must categorize to "Reject" at $18 when weight is 110, height is 20, width is 55, depth is 120', function() {
        var $scope = {};
        var controller = $controller('appController', { $scope: $scope });
        $scope.parcel.weight = 110;
        $scope.parcel.height = 20;
        $scope.parcel.width = 55;
        $scope.parcel.depth = 120;
        $scope.onParcelValueChange();
        expect($scope.summary.cost).toEqual(null);
        expect($scope.summary.category).toEqual('reject');
    });
});