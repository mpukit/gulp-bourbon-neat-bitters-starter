module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			content: {
				files: ['app/*.html']
			},

			images: {
				files: ['app/imgs/*.{png,jpg,gif}'],
				tasks: ['newer:imagemin']
			},

			deleting: {
				files: ['app/imgs/*.{png,jpg,gif}'],
				tasks: ['delete_sync']
			},

			scripts: {
				files: ['js/libs/*.js', 'js/custom/*.js'],
				tasks: ['concat', 'uglify'],
				options: {
					//spawn: false,
				},
			},

			sass: {
				files: ['app/sass/**/*.scss'],
				tasks: ['sass', 'autoprefixer'],
				options: {
                    sourcemap: true,
					//spawn: false,
				}
			},
            
            css: {
				files: ['app/css/**/*.css', 'app/css/**/*.map'],
			},
            
            dependencies: {
				files: ['bower_components/*'],
				tasks: ['wiredep']
			},

		}, //end of watch

		delete_sync: {
			production: {
				cwd: 'app/imgs',
				src: ['**'],
				syncWith: 'app/imgs'
			}
		},

		imagemin: {
			dynamic: {
				files: [{
					expand: true, // Enable dynamic expansion
					cwd: 'app/imgs/src/', // source images (not compressed)
					src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
					dest: 'app/imgs' // Destination of compressed files
				}]
			}
		},

		concat: {
			production: {
				src: ['app/js/libs/*.js', 'app/js/custom/*.js'],
				dest: 'app/js/build/production.js'
			}
		},

		uglify: {
			production: {
				src: 'app/js/build/production.js',
				dest: 'app/js/build/production.min.js'
			}
		},

		sass: {
			production: {
				options: {
                    sourcemap: true, // run grunt sass to kickstart if not working in dev tools
					style: 'compressed' //no need for config.rb
					// compass: 'true', //no need to @import compass
					// require: 'sassy-buttons' // plugins if needed!
				},
				files: {
					'app/css/main.css' : 'app/sass/main.scss'
				}
			}
		},

		autoprefixer: {

			options: {
				browsers: ['> 5%', 'last 2 version', 'ie 8', 'ie 9']
			},

			production: {
				files: {
					'app/css/main.css' : 'app/css/main.css'
				}
			}
		},
        
        wiredep: { // grunt wiredep task (to hooks in index)
            
            target: {
                src: 'app/index.html' // .html support
            }
            
        },

		browserSync: {
			dev: {
				bsFiles: {
					src: ['app/css/*.map', 'app/css/*.css', 'app/imgs/*.*', 'app/js/build/production.min.js', 'app/*.html']
				},
				options: {
					server: {
						baseDir: "./app"

					},
					watchTask: true // < VERY important
				}
			}
		}
	});

	// load npm tasks, add jshint ?
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-delete-sync');
    grunt.loadNpmTasks('grunt-wiredep');

	// define default task
	grunt.registerTask('default', ["browserSync", "watch"]);
};
