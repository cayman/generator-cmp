_<%=cmp %>App.provider('<%=cmp %>App', function (coreModProvider) {
    console.log('<%=cmp %>App.provider');

    //init config from global _<%=cmp %>AppConfig variable
    coreModProvider.setConfig(_<%=cmp %>AppConfig);
    var _config = coreModProvider.getApp();

    var _searchTemplate = null;

    var _dialogConfig = null;

    this.setDialogConfig = function (dialogConfig) {
      _dialogConfig = dialogConfig;
    };

    this.$get = function ($log, $modal, $filter, coreMod, messageMod) {

      return {
        getSearchTemplate: function () {
          return _searchTemplate;
        },

        //get app-config.js values
        getTitle: function () {
          return _config.title;
        },
        getMessage: function (name) {
          return _config.messages[name];
        },

        //get urls from app-config.js
        getAssets: function () {
          return  coreMod.getAssets();
        },
        getAppUrl: function () {
          return coreMod.getAppUrl();
        },
        getUrl: function (name) {
          if(_config.url[name]) {
            $log.debug('url.'+name+' = '+_config.url[name]);
            return _config.url[name];
          }else{
            $log.error('url.'+name+' not found in config');
          }
        },

        //function for partition loading from data
        getStep: function () {
          return _config.step || 40;
        },
        nextPart: function (params, step){
          if(!step){
            step = this.getStep();
          }
          params.from = params.to ? params.to + 1 : 0;
          params.to =  params.to ? params.to + step: step;
          return params;
        },

        //date time functions
        getDate: function (date){
          return  $filter('date')(date || Date.now(), 'yyyy-MM-dd');
        },
        getTime: function(dateString){
          if(dateString){
            dateString = dateString.split(' ').join('T');
            return new Date(dateString);
          }else{
            return Date.now();
          }
        },

        //show inline error functions
        showError: function(errorKey,response){
          messageMod.showError(response.data.message || response.data.error || this.getMessage(errorKey), response.data);
        },

        //show modal window
        openModal: function(dialogConfig, params){
          $log.debug('openModal params',params);
          dialogConfig.resolve = {
            params: function () {
              return params;
            }
          };
          return $modal.open(dialogConfig);
        },
        openDialogModal: function(params){
          return this.openModal(_dialogConfig,params);
        }

      };
    };
  });
