var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	del = require('del'),
	compass = require('gulp-compass');

gulp.task('scripts', function() {
	gulp.src(['app/js/**/*.js','!app/js/**/*.min.js'])
		.pipe(plumber())
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(reload({stream:true}));
});

gulp.task('compass', function() {
	gulp.src('app/scss/style.scss')
		.pipe(plumber())
		.pipe(compass({
			config_file: './config.rb',
			css: 'app/css',
			sass: 'app/scss',
			require: ['susy']
		}))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('app/css'))
		.pipe(reload({stream:true}));
});

gulp.task('html', function() {
	gulp.src('app/**/*.html')
	.pipe(reload({stream:true}));;
});

gulp.task ('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "./app/"
		}
	});
});

gulp.task('build:cleanfolder', function(cb) {
	del(['build/**'],
		cb);
});

gulp.task('build:copy', ['build:cleanfolder'], function() {
	return gulp.src('app/**/*/')
			.pipe(gulp.dest('build/'));
});

gulp.task('build:removeUnwanted',['build:copy'], function(cb) {
	del([
		'build/scss/',
		'build/js/**/!(*.min.js)'
		], cb);
});


gulp.task('build', ['build:copy', 'build:removeUnwanted']);



gulp.task('watch', function() {
	gulp.watch('app/js/**/*.js',['scripts']);
	gulp.watch('app/scss/**/*.scss',['compass']);
	gulp.watch('app/**/*.html',['html']);
});

gulp.task('default', ['scripts', 'compass', 'html', 'browser-sync', 'watch']);