# gulp-svg-to-react

convert svg to react component

## Usage

```javascript
var gulp = require('gulp');
var svgscaler = require('svg-scaler'); // 缩小
var svgmin = require('gulp-svgmin'); // 压缩
var rename = require("gulp-rename"); // 重命名
var gulpSvgToReact = require('gulp-svg-to-react'); // to react component

gulp.task('default', function () {
    return gulp.src('svg/*.svg')
        .pipe(svgscaler({
            width: 32
        }))
        .pipe(svgmin(
            function getOptions(file){
                var sPath = file.path;
                var sClass = 'svg-' + sPath.substring(sPath.lastIndexOf('/')+1, sPath.lastIndexOf('.'));

                return {
                    plugins: [{
                            removeXMLNS: true
                        },
                        {
                            addClassesToSVGElement: {
                                classNames: ['icon-svg',  sClass]
                            }
                        }
                    ],
                    js2svg: {
                        pretty: true
                    }
                }
            }
        ))
        .pipe(gulpSvgToReact())
        .pipe(rename({
            extname: ".jsx"
        }))
        .pipe(gulp.dest('./out'));
});
```


