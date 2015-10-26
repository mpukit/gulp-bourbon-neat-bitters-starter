// This shows a full config file!
module.exports = function(grunt) {

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		watch : {
			content : {
				files : 'app/*.html'
			}, //this live reloads html also

			images : {
				files : ['app/imgs/*.{png,jpg,gif}'],
				tasks : ['newer:imagemin']
			}, // watch images added to src

			deleting : {
				files : ['app/imgs/*.{png,jpg,gif}'],
				tasks : ['delete_sync']
			}, // end of delete sync

			scripts : {
				files : ['js/libs/*.js', 'js/custom/*.js'],
				tasks : ['concat', 'uglify'],
				options : {
					spawn : false,
				},
			}, //end of watch scripts

			css : {
				files : ['app/sass/**/*.scss'],
				tasks : ['sass', 'autoprefixer'],
				options : {
					spawn : false,
				}
			}, //end of sass watch

		}, //end of watch

		/* ====================================================================================================================================================
		 * ====================================================================================================================================================

		 Tasks

		 ====================================================================================================================================================
		 ====================================================================================================================================================
		 */

		delete_sync : {
			dist : {
				cwd : 'app/imgs/dist',
				src : ['**'],
				syncWith : 'app/imgs/src'
			}
		}, // end of delete sync

		imagemin : {
			dynamic : {
				files : [{
					expand : true, // Enable dynamic expansion
					cwd : 'app/imgs/src/', // source images (not compressed)
					src : ['**/*.{png,jpg,gif}'], // Actual patterns to match
					dest : 'app/imgs/dist/' // Destination of compressed files
				}]
			}
		}, //end imagemin

		concat : {
			dist : {
				src : ['app/js/libs/*.js', 'app/js/custom/*.js'],
				dest : 'app/js/build/production.js'
			}
		}, //end concat

		uglify : {
			dist : {
				src : 'app/js/build/production.js',
				dest : 'app/js/build/production.min.js'
			}
		}, //end uglify

		sass : {
			dist : {
				options : {
					style : 'compressed' //no need for config.rb
					// compass : 'true', //no need to @import compass
					// require : 'sassy-buttons' // plugins if needed!
				},
				files : {
					'app/css/main.css' : 'app/sass/main.scss'
				}
			}
		}, //end of sass

		autoprefixer : {

			options : {

				browsers : ['> 5%', 'last 2 version', 'ie 8', 'ie 9']
			},

			dist : {
				files : {
					'app/css/main.css' : 'app/css/main.css'
				}

			}
		}, //end of autoprefixer

		browserSync : {
			dev : {
				bsFiles : {
					src : ['app/css/*.css', 'app/imgs/*.*', 'app/js/build/production.min.js', 'app/*.html']
				},
				options : {
					server : {
						baseDir : "./app"

					},
					watchTask : true // < VERY important
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

	// define default task
	grunt.registerTask('default', ["browserSync", "watch"]);
};
