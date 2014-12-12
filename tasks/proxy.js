/**
 * Proxy js code execution from a desktop browser to STB.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 */

'use strict';

var gulp   = require('gulp'),
	gutil  = require('gulp-util'),
	config = require(__dirname + '/../lib/config')('proxy'),
	title  = 'proxy:   ';


gulp.task('proxy', function () {
	if ( config.active ) {
		require('code-proxy')(config);
		gutil.log(title, 'listening ...');
	}
});