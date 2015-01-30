'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var os = require('os');

module.exports = yeoman.generators.Base.extend({

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('cmpPortal') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'portalName',
        message: 'Enter the name of the portal',
        default: this.appname
      },
      {
        type: 'input',
        name: 'description',
        message: 'Enter the description of the portal',
      },
      {
        type: 'input',
        name: 'repoUrl',
        message: 'local repository dir for components',
        default: 'https://git.egron.net:8443/git/portal/'
      },
      {
        type: 'confirm',
        name: 'deploy',
        message: 'Would you like to enable a deploy functionality?',
        default: true
      },
      {
        type: 'confirm',
        name: 'karma',
        message: 'Would you like to enable a karma testing?',
        default: true
      }
    ];


    this.prompt(prompts, function (props) {
      this.portal = props.portalName;
      this.portalName = 'portal.' + this.portal;
      this.description = props.description;
      this.repoUrl = props.repoUrl;
      this.karma = props.karma;
      this.deploy = props.deploy;

      // Save user configuration options to .yo-rc.json file
      this.config.set('portal',this.portal);
      this.config.set('title',this.description);
      this.config.save();

      done();
    }.bind(this));
  },


  configuring: function () {
    var apps = this.config.get('apps');


    this.template('_cmp.json','cmp.json',{
      portalName : this.portalName,
      appList:apps.map(function (app){
        return '"app.'+app +'": "./app.'+app +'"';
      }).join(",\n\t")
    });

  },

  writing: {
    project: function () {
      this.copy('gitignore','.gitignore');
      this.copy('editorconfig','.editorconfig');
      this.copy('jshintrc','.jshintrc');
      this.copy('_mklink.bat','mklink.bat');
      this.template('_package.json','package.json');
      this.template('_README.md','README.md');
    },

    portal: function () {

      this.template('_config.yml','config.yml');
      this.template('_params.json','params.json');
      this.copy('_Gruntfile.js','Gruntfile.js');
    }

  },

  install: function () {
    //this.installDependencies({
    //  skipInstall: this.options['skip-install']
    //});
  }
});
