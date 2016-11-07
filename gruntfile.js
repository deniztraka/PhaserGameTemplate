module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: ['src/scripts/**/*.js', 'app.js'],
                // the location of the resulting JS file
                dest: 'dist/scripts/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/scripts/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        qunit: {
            files: ['dist/**/*.html']
        },
        jshint: {
            // define the files to lint
            files: ['gruntfile.js', 'src/app.js', 'src/scripts/**/*.js', 'test/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        },
        copy: {
            main: {
                files: [                                   
                    // includes files within path and its sub-directories 
                    {expand: true, cwd:'src', src: ['assets/**'], dest: 'dist/'},
                    {expand: true, cwd:'src', src: ['index.html'], dest: 'dist/'},
                    {expand: true, cwd:'src', src: ['app.js'], dest: 'dist/'},
                    //{expand: true, cwd:'src', src: ['scripts/lib/**'], dest: 'dist/'}                                   
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('test', ['jshint'/*, 'qunit'*/]);

    grunt.registerTask('default', ['jshint', /*'qunit',*/ 'concat', 'uglify','copy']);
};