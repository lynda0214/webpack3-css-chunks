const gulp = require('gulp');
const argv = require('yargs').argv;
const zip = require('gulp-zip');
const clean = require('gulp-clean');
const yarn = require('gulp-yarn');
const shell = require('gulp-shell');
import moment from "moment";

const dist = argv.dist || 'dist';
const webver = moment().format('YYYYMMDDHHmmss');

function runSequential(tasks) {
  if (!tasks || tasks.length <= 0) return;

  const task = tasks[0];
  gulp.start(task, () => {
    console.log(`${task} finished`);
    runSequential(tasks.slice(1));
  });
}

gulp.task('archive', () => {
  gulp.start("packing");
});

gulp.task('packing', ['packing_s3'], function () {
  const r = argv.webRoute || 'web';
  return gulp.src([r + '/*'], {base: '.'})
    .pipe(zip('cosmetic-ui.zip'))
    .pipe(gulp.dest(dist));
});

gulp.task('packing_s3', ['webpack-demo'], function () {
  const r = argv.webRoute || 'web';
  if (argv.scminfo)
    return gulp.src([r + '/assets/**'], {base: r + '/'})
      .pipe(gulp.dest(dist + '/s3/' + argv.scminfo));
});

gulp.task('install-npm-dependencies', function () {
  gulp.src(['./package.json', './yarn.lock']).pipe(yarn());
});

gulp.task('webpack-demo', ['clean'], shell.task('webpack --config webpack.config.demo.js'));

gulp.task('environment', function () {
  const env = argv.profile || 'production';
  if (argv.webRoute)
    process.env.webRoute = argv.webRoute;
  if (argv.assetsCdn)
    process.env.assetsCdn = argv.assetsCdn;
  if (argv.scminfo)
    process.env.scminfo = argv.scminfo;
  process.env.webver = webver;
  return process.env.NODE_ENV = env;
});

gulp.task('clean', ['environment'], function () {
  const r = argv.webRoute || 'web';
  gulp.src([dist, r]).pipe(clean());
});

gulp.task('default', ['archive']);
