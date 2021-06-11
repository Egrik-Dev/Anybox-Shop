const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const sourcemap = require(`gulp-sourcemaps`);
const sass = require(`gulp-sass`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const csso = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const server = require(`browser-sync`).create();
const imagemin = require(`gulp-imagemin`);
const webp = require(`gulp-webp`);
const svgstore = require(`gulp-svgstore`);
const del = require(`del`);

gulp.task(`css`, function () {
  return gulp
    .src(`src/sass/style.scss`)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename(`style.min.css`))
    .pipe(sourcemap.write(`.`))
    .pipe(gulp.dest(`build/css`))
    .pipe(server.stream());
});

gulp.task(`html`, function () {
  return gulp.src(`src/*.html`).pipe(gulp.dest(`build`));
});

gulp.task(`js`, function () {
  return gulp.src(`src/js/*.js`).pipe(gulp.dest(`build/js`));
});

gulp.task(`sprite`, function () {
  return gulp
    .src(`src/img/icon-*.svg`)
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest(`build/img`));
});

gulp.task(`images`, function () {
  return gulp
    .src(`source/img/**/*.{png,jpg,svg}`)
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.svgo(),
      ])
    )
    .pipe(gulp.dest(`source/img`));
});

gulp.task(`webp`, function () {
  return gulp
    .src(`src/img/**/*.{png,jpg}`)
    .pipe(webp({ quality: 95 }))
    .pipe(gulp.dest(`build/img`));
});

gulp.task(`server`, function () {
  server.init({
    server: `build/`,
    notify: false,
    open: false,
    cors: true,
    ui: false,
  });

  gulp.watch(`src/sass/**/*.{scss,sass}`, gulp.series(`css`));
  gulp.watch(`src/img/icon-*.svg`, gulp.series(`sprite`, `html`, `refresh`));
  gulp.watch(`src/*.html`, gulp.series(`html`, `refresh`));
  gulp.watch(`src/js/*.js`, gulp.series(`js`, `html`, `refresh`));
});

gulp.task(`clean`, function () {
  return del(`build`);
});

gulp.task(`refresh`, function (done) {
  server.reload();
  done();
});

gulp.task(`copy`, function () {
  return gulp
    .src(
      [`src/fonts/**/*.{woff,woff2}`, `src/img/**`, `src/js/**`, `src/*.ico`],
      {
        base: `src`,
      }
    )
    .pipe(gulp.dest(`build`));
});

gulp.task(
  `build`,
  gulp.series(`clean`, `copy`, `css`, `sprite`, `images`, `webp`, `html`)
);

gulp.task(`start`, gulp.series(`build`, `server`));
