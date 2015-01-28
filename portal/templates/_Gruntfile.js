module.exports = function (grunt) {

    var cmpUtil = require('grunt-cmp-builder/tasks/lib/cmp').init(grunt);

    var taskConfig = {
        params: grunt.file.readJSON('params.json'),
        //params: grunt.file.readJSON('params_local.json'),
        pkg: grunt.file.readJSON('package.json'),
        build: 'build',
        cmp: cmpUtil.getCmp,
        cmpBower: {
            options: {
                sourceFile: 'cmp.json',
                repository: '<%%= params.repo %>'
            }
        },
        cmpBuild: {
            options: {
                app: {
                    tasks: [
                        'cmpSet:app',
                        'jshint:cmp',
                        'jsonlint:app',
                        'clean:cmp',
                        'copy:cmp',
                        'concat:cmp',
                        'ngAnnotate:cmp',
                        'html2js:cmp',
                        'cmpConfig:app',
                        'uglify:cmp',
                        'cmpScripts:app',
                        'assemble:app'
                    ]
                },
                mod: {
                    tasks: [
                        'cmpSet:mod',
                        'jshint:cmp',
                        'clean:cmp',
                        'copy:cmp',
                        'concat:cmp',
                        'ngAnnotate:cmp',
                        'html2js:cmp',
                        'uglify:cmp'
                    ]
                },
                lib: {
                    tasks: [
                        'cmpSet:lib',
                        'clean:cmp',
                        'copy:lib'
                    ]

                },
                template: {
                    tasks: [
                        'cmpSet:template',
                        'clean:cmp',
                        'copy:cmp'
                    ]
                },
                portal: {
                }
            }
        },
        cmpSet: {
            options: {
                src: '<%%=cmp().dir %>/src',
                path: '<%%=cmp().type %>/<%%=cmp().name %>/<%%=cmp().version %>',
                dest: '<%%=build %>/<%%=cmp().type %>/<%%=cmp().name %>/<%%=cmp().version %>'
            },
            app: {
                options: {
                    config: '<%%=cmp().dir %>/src/config.yml',
                    main: [
                        'scripts/app-config.js',
                        'scripts/app.js',
                        'scripts/app-views.js'
                    ]
                }
            },
            mod: {
                options: {
                    config: '<%%=cmp().dir %>/src/config.yml',
                    main: [
                        'scripts/mod.js',
                        'scripts/mod-views.js'
                    ]
                }
            },
            lib:{
                options:{
                    src: '<%%=cmp().dir %>'
                }
            },
            template: {
                options: {
                    config: '<%%=cmp().dir %>/src/config.yml',
                    main: []
                }
            }
        },

        cmpConfig: {
            app: {
                options: {
                    baseConfig: './config.yml',
                    configField: 'config',
                    pathField: 'path',

                    write: {
                        jsVariable: '_<%%=cmp().name %>AppConfig',
                        jsFile: '<%%=cmp().dest %>/scripts/app-config.js',
                        yamlFile: '<%%=cmp().dest %>/config.yml'
                    }

                }
            }
        },

        cmpScripts: {
            app: {
                options: {
                    scriptField: 'main',
                    pathField: 'path',
                    minify: false,
                    version: true
                }
            }
        },

        banner: '/*! <%%= cmp().type %>.<%%= cmp().name %> - v<%%= cmp().version %> - ' +
            '<%%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * Copyright (c) <%%= grunt.template.today("yyyy") %> <%%= cmp().authors %> */',

        clean: {
            options: {
                force: true
            },
            all: {
                files: [
                    {
                        src: [
                            '<%%=build %>/**/*'
                        ]
                    }
                ]
            },
            cmp: {
                files: [
                    {
                        src: [
                            '<%%= cmp().dest %>/**/*'
                        ]
                    }
                ]
            },
            bower: {
                files: [
                    {
                        src: [
                            '**/bower_components'
                        ]
                    }
                ]
            }
        },
        concat: {
            options: {
                banner: '<%%= banner %>\n',
                separator: '\n/*-------------*/\n',
                nonull: true
            },
            cmp: {
                files: [
                    {
                        src: '<%%=cmp().src %>/scripts/*.js',
                        dest: '<%%=cmp().dest %>/scripts/<%%=cmp().type %>.js'
                    },
                    {
                        src: '<%%=cmp().src %>/tests/unit/*.js',
                        dest: '<%%=cmp().dest %>/tests/<%%=cmp().type %>-unit.spec.js'
                    },
                    {
                        src: '<%%=cmp().src %>/tests/e2e/*.js',
                        dest: '<%%=cmp().dest %>/tests/<%%=cmp().type %>-e2e.spec.js'
                    }
                ]
            }
        },

        ngAnnotate: {
            options: {
                force: true
            },
            cmp: {
                files: [
                    {
                        src: '<%%=cmp().dest %>/scripts/<%%=cmp().type %>.js',
                        dest: '<%%=cmp().dest %>/scripts/<%%=cmp().type %>.js'
                    }
                ]
            }
        },

        copy: {
            cmp: {
                expand: true,
                cwd: '<%%=cmp().src %>',
                src: [ '**/*.css', '**/*.json', '**/*.png', '**/*.jpg', '**/*.gif', '**/*.ico'],
                dest: '<%%=cmp().dest %>'
            },
            lib: {
                expand: true,
                cwd: '<%%=cmp().src %>',
                src: [ '**/*.js', '**/*.map', '**/*.html', '**/*.css', '!Gruntfile.js',
                       '!src/**', '!test/**', '!build/**','!sample/**'],
                dest: '<%%=cmp().dest %>'
            }
        },
        html2js: {
            options: {
                quoteChar: '\'',
                base: '<%%=cmp().src %>',
                module: '<%%=cmp().type %>/<%%=cmp().name %>/views',
                rename: function (moduleName) {
                    var cmp = cmpUtil.getCmp();
                    return cmp.type + '/' + cmp.name + '/' + moduleName; //.replace('.html', '');
                }
            },
            cmp: {
                src: ['<%%=cmp().src %>/views/**/*.html'],
                dest: '<%%=cmp().dest %>/scripts/<%%=cmp().type %>-views.js'
            },
            template: {
                src: '<%%=cmp().src %>/template/**/*.html',
                dest: '<%%=cmp().dest %>/scripts/templates.js',
                module: 'template'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            portal: [
                'Gruntfile.js'
            ],
            cmp: [
                '<%%=cmp().src %>/**/*.js'
            ]
        },
        jsonlint: {
            app: {
                src: [ '<%%=cmp().src %>/**/*.json' ]
            }
        },
        uglify: {
            options: {
            },
            cmp: {
                files: [
                    {
                        expand: true,
                        cwd: '<%%=cmp().dest %>',
                        src: [ '**/*.js' , '!**/*.min.js', '!**/*.spec.js'],
                        dest: '<%%=cmp().dest %>',
                        ext: '.min.js'
                    }
                ]
            }
        },
        assemble: {
            options: {
                layoutdir: '<%%=cmp(cmp().template).src %>/_layouts',
                layout: 'default.hbs',
                partials: '<%%=cmp(cmp().template).src %>/_includes/*.hbs',
                flatten: true,
                hbs:{
                    assets: '/<%%=cmp(cmp().template).path %>',
                    home: '/',
                    name: '<%%=cmp().name %>App',
                    title: '<%%=cmp().config.app.title %>',
                    scripts: function(){
                        return cmpUtil.getCmp().main;
                    }
                }
            },
            app: {
                src: ['<%%=cmp().src %>/<%%=cmp().name %>.hbs'],
                dest: '<%%=build %>'
            }
        },

        compress: {
            site: {
                options: {
                    archive: '<%%=build %>/<%%= grunt.template.today("yyyy-mm-dd") %>/<%%= pkg.name %>-<%%= grunt.template.today("yyyy-mm-dd") %>.zip',
                    mode: 'zip'
                },
                files: [
                    {
                        src: ['<%%=build %>/**','!**/*.zip']
                    }
                ]
            }
        },

        replace: {
            md: {
                options: {
                    patterns: [
                        {
                            match: 'date',
                            replacement: '<%%= grunt.template.today("yyyy-mm-dd") %>'
                        },
                        {
                            match: 'version',
                            replacement: '<%%=pkg.version %>'
                        }
                    ]
                }, files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['install.md'],
                        dest: '<%%=build %>/<%%= grunt.template.today("yyyy-mm-dd") %>'
                    }
                ]
            }
        },
        connect: {
            server: {
                options: {
                    port: '<%%= params.server.port %>',
                    hostname: '<%%= params.server.hostname %>',
                    base: '<%%= build %>/',
                    middleware: function (connect, options) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [
                            proxy,
                            connect.static(options.base),
                            // Make empty directories browsable.
                            connect.directory(options.base)
                        ];
                    }
                },
                proxies: '<%%= params.server.proxies %>'
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%%= params.server.port %>'
            }
        },
        watch: {
            app: {
                options: {
                    cwd: '<%%= params.watch %>/src'
                },
                files: [ '**/*.hbs', '**/*.html', '**/*.json', '**/*.js','**/*.yml','**/*.sass','**/*.css'],
                tasks: ['cmpBuild:<%%= params.watch %>']
            }
        }

    };
    grunt.initConfig(taskConfig);
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('assemble');


    grunt.registerTask('server', [
        'clean:all',
        'cmpBuild',
        'configureProxies:server',
        'connect:server',
        'open:server',
        'watch:app'
    ]);

    grunt.registerTask('test', [
        'clean:all',
        'cmpBuild',
        'configureProxies:server',
        'connect:server',
        'open:server'
    ]);

    grunt.registerTask('build', [
        'clean:all',
        'cmpBuild',
        'compress',
        'replace:md'
    ]);

};
