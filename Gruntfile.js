"use strict";
module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		assets: {
			main: assetsId()
		},
		uglify: {
			all: {
				src: [
				    'public/lib/imgloader.js',
				      'public/lib/adaptUILayout.js',
				      'public/lib/zepto.min.js',
				      'public/lib/touch.js',
				      'public/lib/music.js',
				      'public/js/main.js'],
				dest: 'public/build/main.js'
			}
		},
		cssmin: {
			all: {
				src: 'public/css/style.css',
				dest: 'public/build/style.css'
			}
		},
		setPHPConstant: {
			mainVersion: {
				constant: 'MAIN_VERSION',
				value: '<%= assets.main %>',
				file: 'const.php'
			}
		},
        "regex-replace": {
            js: { //specify a target with any name
                src: ['public/build/*.js'],
                actions: [
                    // {
                    //     name: 'cdn',
                    //     search: './public/',
                    //     replace: '//csair.h5ap.cn/csairhbc/public/',
                    //     flags: 'g'
                    // },
                    {
                        name: 'jpg',
                        search: '.jpg',
                        replace: '.<%= assets.main %>.jpg',
                        flags: 'g'
                    },
                    {
                        name: 'png',
                        search: '.png',
                        replace: '.<%= assets.main %>.png',
                        flags: 'g'
                    }
                ]
            },
            css: { //specify a target with any name
                src: ['public/build/*.css'],
                actions: [
                    // {
                    //     name: 'cdn',
                    //     search: '../img/',
                    //     replace: '//csair.h5ap.cn/csairhbc/public/img/',
                    //     flags: 'g'
                    // },
                    {
                        name: 'jpg',
                        search: '.jpg',
                        replace: '.<%= assets.main %>.jpg',
                        flags: 'g'
                    },
                    {
                        name: 'png',
                        search: '.png',
                        replace: '.<%= assets.main %>.png',
                        flags: 'g'
                    }
                ]
            }
        }
	});
	grunt.registerTask('build', ['setPHPConstant', 'uglify:all', 'cssmin:all', 'regex-replace']);
};

function assetsId() {
	var date = new Date;
	return date.getMonth()+''+date.getDate()+date.getHours()+''+date.getMinutes()+''+date.getSeconds();
}
