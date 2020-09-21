const gulp = require('gulp');
// const sass = require('gulp-sass');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const concat = require('gulp-concat');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const remember = require('gulp-remember');
const cached = require('gulp-cached');
const rigger = require('gulp-rigger');
const tildeImporter = require('node-sass-tilde-importer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const gulpIf = require('gulp-if');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const del = require('del');

const isProduction = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? true : false;

console.log(isProduction)

gulp.task('styles', () => {
    return gulp
        .src(['src/styles/index.styl'], { base: 'src' })
        .pipe(gulpIf(!isProduction, sourcemaps.init()))
        .pipe(stylus({
            compress: true
        }))
        .pipe(concat('styles/bundle.css'))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(remember('styles'))   //кеширование при первом проходе, при последующих - пользуется им для недостающих файлов
        .pipe(cssnano())
        .pipe(gulpIf(!isProduction, sourcemaps.write()))
        .pipe(gulp.dest('dist'))
});

gulp.task('clean', (cb) => {
    del('dist');
    cb();
})

gulp.task('reset', () => {
    return gulp
        .src('src/styles/reset.css', { base: 'src' })
        .pipe(gulp.dest('dist'))
})

gulp.task('assets', () => {
    return gulp
        .src('src/assets/**/*.*')
        .pipe(cached('styles'))
        .pipe(newer('dist'))
        .pipe(gulpIf(isProduction, imagemin({verbose: true})))
        .pipe(gulp.dest('dist/assets'))
});

gulp.task('html', () => {
    return gulp
        .src('src/*.html')
        .pipe(rigger())
        .pipe(gulpIf(isProduction, htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest('dist'))
})


gulp.task('fav', () => {
    return gulp
        .src('src/favicon.ico')
        .pipe(gulp.dest('dist'))
})

gulp.task('scripts', () => {
    return browserify({ entries: 'src/scripts/index.js' })
        .transform(babelify, {
            presets: ["@babel/preset-env"],
            global: true,
            sourceMaps: false,
        })
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulpIf(isProduction, streamify(uglify())))
        .pipe(gulp.dest('dist/scripts'))
})

gulp.task('serve', () => {
    browserSync.init({
        server: 'dist'
    })

    browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
})

gulp.task('watch', () => {
    gulp.watch('src/styles/**/*.styl', gulp.series('styles'))
    gulp.watch('src/assets/**/*.*', gulp.series('assets'))
    gulp.watch('src/scripts/*.js', gulp.series('scripts'))
    gulp.watch('src/*.html', gulp.series('html'))
    gulp.watch('src/favicon.ico', gulp.series('fav'))
})

// gulp.task('build', gulp.parallel('styles', 'assets', 'scripts', 'html', 'fav', 'extraCss'));
gulp.task('build', gulp.parallel('styles', 'scripts', 'fav', 'reset', 'assets', 'html'));

gulp.task('dev', gulp.series('build', gulp.parallel('serve', 'watch')))