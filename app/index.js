'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');



module.exports = yeoman.generators.Base.extend({

  constructor: function () {

    // Calling the super constructor is important so our generator is correctly set up
    yeoman.generators.Base.apply(this, arguments);

    var portal = this.config.get('portal');
    var apps = this.config.get('apps');

    if (portal) {
      this.log(chalk.red('cmpPortal') + ': ' + portal + ' (portal:' + portal + ')');
    } else {
      this.composeWith('cmp:portal', {options: {welcome: false}}, { link:'strong'});
    }

    if(apps) {
      for (var i = 0; i < apps.length; i++) {
        this.log(chalk.red('cmpApp') + ': ' + apps[i] + ' (app:' + apps[i] + ')');
      }
    }

  },

  initializing: function () {

  },

  prompting: function () {
    var done = this.async();

    var title = this.config.get('title');
    var template = this.config.get('template');
    var apps = this.config.get('apps') || [];

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('cmpApp') + ' as Single Page Application generator!'
    ));

    function existApp(name,found,notFound){
      for (var i = 0; i < apps.length; i++) {
        if (apps[i] === name) {
          return found;
        }
      }
      return notFound;
    }

    var prompts = [
      {
        type: 'input',
        name: 'appName',
        message: 'Enter the name of the application (\'name\'.html)',
        validate: function (name) {
          return existApp(name,'such app already exists', true );
        },
        default: existApp('index', undefined, 'index' )
      },
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title the application',
        default: title || null
      },
      {
        type: 'input',
        name: 'template',
        message: 'Enter the name of the template (template.\'name\')',
        default: template || 'base'
      }
      ,
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
      this.title = 'app.'+this.title;
      this.angular = props.angular;
      this.templateName = 'template.'+ props.template;
      this.src = this.cmpName + '/src';

      // Save user configuration options to .yo-rc.json file
      apps.push(this.cmp);
      this.config.set('title',this.title);
      this.config.set('apps',apps);
      this.config.set('template',props.template);
      this.config.save();

      done();
    }.bind(this));
  },

  configuring: function () {
    var cmpJsonPath = this.destinationPath('cmp.json');
    if(fs.existsSync(cmpJsonPath)){
        var portalCmp = require(cmpJsonPath);
        portalCmp.dependencies[this.cmpName] = './' + this.cmpName;
        this.write(cmpJsonPath, JSON.stringify(portalCmp, null, 2));
    }
    var paramsJsonPath = this.destinationPath('params.json');
    if(fs.existsSync(paramsJsonPath)){
      var gruntParams = require(paramsJsonPath);
      gruntParams.watch  =  this.cmpName;
      this.write(paramsJsonPath, JSON.stringify(gruntParams, null, 2));
    }
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
