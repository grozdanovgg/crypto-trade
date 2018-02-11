const gulp = require('gulp');
const del = require('del');
// const clean = require('gulp-clean');
const shell = require('gulp-shell');
// const sync = require('gulp-sync')(gulp);
// const nodemon = require('gulp-nodemon');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

// gulp.task('clean', function () {
// 	return gulp
// 		.src('dist', { read: false })
// 		.pipe(clean());
// });
gulp.task('clean', () => {
    del('server');
    return del('dist');
});


gulp.task('serverCompile', () => {
    return gulp.src('src-server/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts({
            noImplicitAny: true,
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('server'));
})
gulp.task('copyServerJs', function () {
    return gulp.src('src-server/**/*.js')
        .pipe(gulp.dest('server'));
});




gulp.task('build', shell.task(['ng build']));
gulp.task('buildWatch', shell.task(['ng build --watch']));
gulp.task('runServerOnce', shell.task(['node server/app.js']));
gulp.task('runServer', shell.task(['nodemon server/app.js']));

// gulp.task('default', ['clean', 'buildWatch', 'server']);
gulp.task('run', gulp.parallel('buildWatch', 'runServer'));
gulp.task('runOnce', gulp.parallel('build', 'runServerOnce'));

gulp.task('default', gulp.series('clean', 'serverCompile', 'copyServerJs', 'run'));
gulp.task('serveOnce', gulp.series('clean', 'serverCompile', 'copyServerJs', 'runOnce'));

