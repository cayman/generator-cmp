_<%=cmp %>App.config( function($stateProvider,<%=cmp %>AppProvider){
    console.log('<%=cmp %>App.config');

    <%=cmp %>AppProvider.setSearchTemplate('app/<%=cmp %>/views/search.html');

    <%=cmp %>AppProvider.setDialogConfig({
      templateUrl: 'app/<%=cmp %>/views/dialog.html',
      controller: 'DialogController',
      windowClass: 'bigModalDialog'
    });


    var page = {
        url: '?number&from&to', // root route
        views: {
            'top': {
              templateUrl: 'app/<%=cmp %>/views/top.html',
              controller:  /*@ngInject*/  'SearchController'
            },
            '': {
                templateUrl: 'app/<%=cmp %>/views/list.html',
                controller:  /*@ngInject*/  'ListController'
            }
        }
    };

    $stateProvider.state('list', page );
});
