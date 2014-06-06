'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yo: {
            // configurable paths
            webdir: 'public',
            dist: 'dist'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            options: {
                livereload: true
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            js: {
                files: ['<%= yo.webdir %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all']
            },
            less: {
                files: ['<%= yo.webdir %>/styles/less/*.less'],
                tasks: ['less:development', 'autoprefixer']
            },
            compass: {
                files: ['<%= yo.webdir %>/styles/scss/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            livereload: {
                options: {
                    open: true
                },
                files: [
                    '<%= yo.webdir %>/**/*.html',
                    '<%= yo.webdir %>/styles/{,*/}*.css',
                    '<%= yo.webdir %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            express: {
                files: [
                    'app.js',
                    'routes/**/*.js',
                    'views/**/*.jade'
                ],
                tasks: ['express:dev'],
                options: {
                    spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
                }
            }
        },

        express: {
            options: {
                // Override defaults here
            },
            dev: {
                options: {
                    script: 'app.js',
                    node_env: 'development'
                }
            },
            prod: {
                options: {
                    script: '<%= yo.dist%>/app.js',
                    node_env: 'production'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yo.webdir %>/scripts/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yo.dist %>/*',
                            '!<%= yo.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yo.webdir %>/styles/css/',
                        src: '*.css',
                        dest: '<%= yo.webdir %>/styles/css/'
                    }
                ]
            }
        },

        // Automatically inject Bower components into the app
        'bower-install': {
            app: {
                html: '<%= yo.webdir %>/index.html',
                ignorePath: '<%= yo.webdir %>/'
            }
        },

        less: {
            development: {
                options: {
                },
                files: {
                    "<%= yo.webdir %>/styles/css/site.css": "<%= yo.webdir %>/styles/less/main.less",
                    "<%= yo.webdir %>/styles/css/store.css": "<%= yo.webdir %>/styles/less/store.less"
                }
            },
            production: {
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= yo.webdir %>/styles/scss',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yo.webdir %>/images',
                javascriptsDir: '<%= yo.webdir %>/scripts',
                fontsDir: '<%= yo.webdir %>/styles/fonts',
                importPath: '<%= yo.webdir %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= yo.dist %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },


        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yo.webdir %>/index.html',
            options: {
                dest: '<%= yo.dist %>/<%=yo.webdir%>'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yo.dist %>/{,*/}*.html'],
            css: ['<%= yo.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yo.dist %>/<%=yo.webdir%>']
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yo.webdir %>/images',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yo.dist %>/<%=yo.webdir%>/images'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yo.webdir %>/images',
                        src: '{,*/}*.svg',
                        dest: '<%= yo.dist %>/<%=yo.webdir%>/images'
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yo.dist %>',
                        src: ['*.html', 'views/{,*/}*.html'],
                        dest: '<%= yo.dist %>/<%=yo.webdir%>'
                    }
                ]
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    }
                ]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yo.dist %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yo.webdir %>',
                        dest: '<%= yo.dist %>/<%=yo.webdir%>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            '*.html',
                            'views/{,*/}*.html',
                            'templates/{,*/}*.html',
                            'bower_components/**/*',
                            'images/{,*/}*.{webp}',
                            'styles/fonts/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yo.dist %>/images',
                        src: ['generated/*']
                    },
                    {
                        expand: true,
                        dest: '<%= yo.dist %>',
                        src: [
                            'app.js',
                            'routes/{,*/}*.js',
                            'views/{,*/}*.jade'
                        ]
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yo.webdir %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },



        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });


    grunt.registerTask('serve', function (target) {
        if (target === 'prod') {
            return grunt.task.run(['build', 'express:prod', 'watch']);
        }

        grunt.task.run([
            'clean:server',
//            'bower-install',
            'autoprefixer',
            'express:dev',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'autoprefixer',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'bower-install',
        'useminPrepare',
        'autoprefixer',
        'concat',
        'ngmin',
        'copy:dist',
        'cdnify',
        'cssmin',
        'uglify',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};
