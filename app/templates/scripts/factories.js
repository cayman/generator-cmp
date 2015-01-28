_<%=cmp %>App.factory('<%=cmp %>Rest', function ($log, <%=cmp %>App, $resource) {
    var restUrl = <%=cmp %>App.getUrl('rest');
    var fileUrl = <%=cmp %>App.getAppUrl();
    return $resource(restUrl, {}, {

        getItems: { url: restUrl + '/items', method: 'GET', params: {}, isArray: true  },
        getItemsFile: { url: fileUrl + '/models/items.json', method: 'GET', params: {}, isArray: true  },

    });
});
