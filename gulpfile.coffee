gulp = require "gulp"
typescript = require "gulp-typescript"

gulp.task "models", () =>
  return gulp.src "src/js/models/**/*.ts"
  .pipe typescript
    out: "models.js"
  .pipe gulp.dest("build")

gulp.task "default", () =>
