_<%=cmp %>App.controller('SearchController', function ($log, $scope, $state, $stateParams) {
    $log.info('<%=cmp %>App.SearchController');

    $scope.params = $stateParams || {};

    $scope.search =  function (type){
      if(type){
        $scope.params.type = type;
      }
      $state.go('list',$scope.params,{replace:true,inherit:false,reload:true});
    };

  });

_<%=cmp %>App.controller('ListController', function ($log, $scope, $state, $stateParams, $timeout, $window, $document, <%=cmp %>App, <%=cmp %>Rest,  scrollMod) {
    $log.info('<%=cmp %>App.ListController');

    $scope.params = $stateParams || {};
    $scope.model = null;

    var nextParams;
    function loadModel(newParams) {
      nextParams = <%=cmp %>App.nextPart(newParams ? angular.copy(newParams): nextParams);
      $log.debug('load params', nextParams);

      $scope.loaded = null;
      $scope.part = <%=cmp %>Rest.getItems(nextParams,
        function success(data) {
          if (!$scope.model) {
            $log.debug('first loading list (' + data.items.length + '/' + data.total + ')');
            $scope.model = data;
          } else {
            $log.debug('additional loading list (' + data.items.length + '/' + data.total + ')');
            $scope.model.items = $scope.model.items.concat(data.items);
          }
          $scope.loaded = nextParams.to > data.total;

        },
        function error(response) {
          $scope.loaded = true;
          <%=cmp %>App.showError('itemsNotFound',response);
          $scope.trace = response.data;
        });

    }

    loadModel($scope.params);

    //Scroll result
    scrollMod.subscribeResultOffset(function () {
      if ($scope.loaded === false) {
        $scope.$apply(function () {
          loadModel();
        });
      }
    });

    $scope.selectUser = function(item){
      $log.debug('selectUser');
      <%=cmp %>App.selectUserModal().result.then(function (result) {
        $log.debug('result from modal',result);
        var params = {id: item.activityId, userId: result.id};
        $log.debug('setActivityUser',params);
        <%=cmp %>Rest.setActivityUser(params,function success(){
          $scope.model = null;
          loadModel($scope.params);
        },function error(response) {
          <%=cmp %>App.showError('linkUserError',response);
        });

      });
    };
  });

_<%=cmp %>App.controller('DialogController', function ($scope, $log, <%=cmp %>App, <%=cmp %>Rest, $state, $stateParams, scrollMod, $modalInstance, params) {
    $log.info('<%=cmp %>App.ObjectController');

    $scope.params = params || {};
    $scope.model = <%=cmp %>Rest.getObject($scope.params,
      function(data) {
        $log.debug('success restObject load',data);
      },
      function(response) {
        <%=cmp %>App.showError('objectNotFound',response);
        $scope.trace = response.data;
      });

    $scope.close = function (result) {
      $modalInstance.dismiss('cancel');
    };

});
