const fs = require('fs');

exports.hmrJsFileRegExp = /\.hot-update\.js$/;

exports.isDef = (array) => Object.prototype.toString.call(array) !== '[object Undefined]';
exports.isDev = () => process.env.NODE_ENV === 'development';

/**
 *
 * @param {*} varName 变量名称
 * @description Input: @primary-1 Output: color(~`colorPalette("@{primary-color}", ' 1 ')`)
 */
exports.getShade = function getShade(varName) {
  const array = varName.match(/(.*)-(\d)/);
  const number = array[2];
  let className = array[1];
  if (/primary-\d/.test(varName)) {
    className = '@primary-color';
  }
  // eslint-disable-next-line
  return 'color(~`colorPalette("@{' + className.replace('@', '') + '}", ' + number + ')`)';
}

/**
 *
 * @param {*} string 给定字符串
 * @param {*} regex 给定正则
 * @description 从给定的字符串中返回匹配的正则组成的对象
 */
exports.getMatches = function getMatches(string, regex) {
  const matches = {};
  let match;
  // eslint-disable-next-line
  while ((match = regex.exec(string))) {
    if (/^(rgba|#)/.test(match[2])) {
      // eslint-disable-next-line
      matches['@'+ match[1]] = match[2];
    }
  }
  return matches;
}

/**
*
* @param {*} cssContent css内容
* @description 压缩css
*/
exports.minifyCss = function minifyCss(cssContent) {
 let css = cssContent;
 // Removed all comments and empty lines
 css = css.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/^\s*$(?:\r\n?|\n)/gm, '');

 /*
 Converts from

   .abc,
   .def {
     color: red;
     background: blue;
     border: grey;
   }

   to

   .abc,
   .def {color: red;
     background: blue;
     border: grey;
   }

 */
 css = css.replace(/\{(\r\n?|\n)\s+/g, '{');

 /*
 Converts from

 .abc,
 .def {color: red;
 }

 to

 .abc,
 .def {color: red;
   background: blue;
   border: grey;}

 */
 css = css.replace(/;(\r\n?|\n)\}/g, ';}');

 /*
 Converts from

 .abc,
 .def {color: red;
   background: blue;
   border: grey;}

 to

 .abc,
 .def {color: red;background: blue;border: grey;}

 */
 css = css.replace(/;(\r\n?|\n)\s+/g, ';');

 /*
Converts from

.abc,
.def {color: red;background: blue;border: grey;}

to

.abc, .def {color: red;background: blue;border: grey;}

*/
 css = css.replace(/,(\r\n?|\n)[.]/g, ', .');

 // 去掉换行符
 css = css.replace(/\n/g, '');
 return css;
}

/**
 * @description 检查路径是否存在
 */
exports.IsPathExist = function IsPathExist(path, msg) {
  if (!fs.existsSync(path)) {
    if (msg) {
      throw new Error(msg);
    }
    throw new Error(`${path} is not exist!`);
  }
  return path;
}
