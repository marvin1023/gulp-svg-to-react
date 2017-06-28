var gulp = require('gulp');
// through2 是一个对 node 的 transform streams 简单封装
var through = require('through2');
// var gutil = require('gulp-util');
// var PluginError = gutil.PluginError;

// 常量
const PLUGIN_NAME = 'gulp-svg-to-react';

/**
 * 将中划线转换为驼峰格式
 * @param  {} str
 * @param  {} first 第一个字母是否需要转换
 */
function toHump (str, first) {
    var str =  str.replace(/-([a-z])/g, function(m, m1) { return m1.toUpperCase(); })

    // 第一个字母是否需要转换
    if(first) {
        str = str.replace(/^\S/, function (s) { return s.toUpperCase(); });
    }

    return str;
}

function addPrefix (name) {
    return `import React from 'react';

let ${name} = function(props) {
    return ( 
        `;
}

function addSuffix (name) {
    return `    );
}

export default ${name};`;
}

function gulpSvgToReact() {

    // 创建一个让每个文件通过的 stream 通道
    return through.obj(function (file, enc, cb) {

        var sPath = file.path;
        var sName = sPath.substring(sPath.lastIndexOf('/') + 1, sPath.lastIndexOf('.'));

        var iconName = 'Icon' + toHump(sName, true);

        var strPrefix = addPrefix(iconName);
        var strSuffix = addSuffix(iconName);

        if (file.isNull()) {
            // 返回空文件
            cb(null, file);
        }
        if (file.isBuffer()) {
            
            var sContent = file.contents.toString('utf-8');

            sContent = sContent.replace(/(class)="(.*)"/g, function(m, m1, m2) {
                return m1 + "Name = { `" + m2 + " ${props.className}` }"
            });

            // console.log(sContent);

            sContent = strPrefix + sContent + strSuffix;

            file.contents = new Buffer(sContent);
        }
        if (file.isStream()) {
            console.log('没有处理 stream 类型');
            // file.contents = file.contents.pipe(prefixStream(prefixText));
        }

        cb(null, file);

    });

};

// 暴露（export）插件主函数
module.exports = gulpSvgToReact;