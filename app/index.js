'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var os = require('os');



module.exports = yeoman.generators.Base.extend({

  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up

    yeoman.generators.Base.apply(this, arguments);
    this.portal = this.config.get('portal');


    if(!this.portal){
      this.composeWith('cmp:portal',{options:{welcome:false}});
    }else{
      this.log(chalk.red('cmpPortal') + ' name: ' + this.portal);
    }
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    var template = this.config.get('template');


    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('cmpApp') + ' as Single Page Application generator!'
    ));

    var apps = this.config.get('apps') || [];

    function existApp(name){
      for (var i = 0; apps.length; i++) {
        if (apps[i] === name) {
          return true;
        }
      }
      return false;
    }

    var prompts = [
      {
        type: 'input',
        name: 'appName',
        message: 'Enter the name of the application (\'name\'.html)',
        validate: function (name) {
          return !existApp(name) || 'such app already exists';
        },
        default: existApp('index') ? null : 'index'
      },
      {
        type: 'confirm',
        name: 'angular',
        message: 'Would you use AngularJS framework?',
        default: true
      }
    ];



    this.prompt(prompts, function (props) {

      this.cmp = props.appName;
      this.cmpName = 'app.'+this.cmp;
      this.angular = props.angular;
      this.src = this.cmpName + '/src';

      // Save user configuration options to .yo-rc.json file
      apps.push(this.cmp);
      this.config.set('apps',apps);
      this.config.save();

      done();
    }.bind(this));
  },


  writing: {
    cmp: function () {
      this.mkdir(this.cmpName);
      this.template('_cmp.json', this.cmpName + '/cmp.json');
    },

    app: function () {
      this.mkdir(this.src);
      this.template('_config.yml', this.src + '/config.yml');
      this.template('_app.hbs', this.src + '/' + this.cmp + '.hbs');
    },

    angular: function () {
      if(this.angular){
        var scripts =  this.src + '/scripts';
        this.mkdir(scripts);

        this.template('/scripts/_module.js', scripts + '/_app.module.js');
        this.template('/scripts/_provider.js', scripts + '/_app.provider.js');
        this.template('/scripts/config.js', scripts + '/app.config.js');
        this.template('/scripts/factories.js', scripts + '/app.factories.js');
        this.template('/scripts/controller.js', scripts + '/app.controller.js');
        this.template('/scripts/run.js', scripts + '/app.run.js');

        var views =  this.src + '/views';
        this.mkdir(views);

        this.template('/views/top.html', views + '/top.html');
        this.template('/views/list.html', views + '/list.html');
    //    this.template('/views/dialog.html', '/views/dialog.html');
      }
    }

  },

  install: function () {
    //this.installDependencies({
    //  skipInstall: this.options['skip-install']
    //});
  }
});
