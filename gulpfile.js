const gulp = require('gulp');
const del = require('del');
// const clean = require('gulp-clean');
const shell = require('gulp-shell');
// const sync = require('gulp-sync')(gulp);
// const nodemon = require('gulp-nodemon');

// gulp.task('clean', function () {
// 	return gulp
// 		.src('dist', { read: false })
// 		.pipe(clean());
// });
gulp.task('clean', () => {
    return del('dist');

});
gulp.task('build', shell.task(['ng build --watch']));
gulp.task('server', shell.task(['nodemon server/app.js']));

// gulp.task('default', ['clean', 'build', 'server']);
gulp.task('run', gulp.parallel('build', 'server'));
gulp.task('default', gulp.series('clean', 'run'));