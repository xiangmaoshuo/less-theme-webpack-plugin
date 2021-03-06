# webpack-custom-less-theme
## 使用方法
 ```
 // webpack.config.js
 const lessThemeLoader = require('webpack-custom-less-theme/loader');
 const LessThemeWebpackPlugin = require('webpack-custom-less-theme');
 ...
 {
   test: /\.less$/,
   use: [
     ...,
     {
        loader: lessThemeLoader,
     },
     ...
   ]
 }
 ...
 plugins: [
   // 详细配置参考index.js -> getOptions方法
   new LessThemeWebpackPlugin(
     {
      themeVariables: ['@primary-color'],
      themeSelfVariables: [],
      // 默认你的less变量在src/assets/css/var.less文件中
      varFile: './src/assets/css/var.less',
      /* 以下参数一般用不上 */
      customColorRegexArray: [],
      fileName: 'css/theme-colors-[contenthash:8].less',
      // 默认使用的ui框架为view-design，如果你的项目是它，则不用处理
      ui: 'view-design',
      uiStyleDir: './src/styles',
      uiColorFile: './color/colors.less',
      // 衍生变量生成函数文件地址
      colorPaletteFile: './color/colorPalette.less',
      // 根据这个值，判断从js中提取css使用哪个正则表达式
      isJsUgly: !isDev(),
      // 衍生变量
      derivedVars: [],
      ...
     }
   ),
 ]
 ```

如果你使用的是vue-cli3，推荐使用[vue-cli-plugin-less-theme](https://github.com/xiangmaoshuo/vue-cli-plugin-less-theme)
 默认的generateThemeUseLess方法会在window.less上添加一个方法changeTheme和一个属性themeColors：
 ```
 // 包含系列主题色，方便在js中调用
 window.less.themeColors = {...}
 
 // 用以改变主题
 window.less.changeTheme({
    '@primary-color': '#f90',
});
```

## 其他

1. 该项目是参考自[antd-theme-generator](https://github.com/mzohaibqc/antd-theme-generator)和[webpack-theme-color-replacer](https://github.com/hzsrc/webpack-theme-color-replacer)
2. 简单说下上面两者的区别，antd-theme-generator处理的场景是样式文件都单独抽离出来的情况下，
webpack-theme-color-replacer则没有这个限制，他是基于webpack插件来处理css文件的
3. antd-theme-generator中对于css的处理时，使用了postcss插件的方法，这种相对于webpack-theme-color-replacer处理css的方式，个人感觉更好一些，比如扩展性。
4. 所以最终基于antd-theme-generator，然后参考了webpack-theme-color-replacer中部分代码（比如开发模式下，在js中抽离css），然后自己再做了一些需求上的优化
5. 关于主题换肤功能，我在代码中也有备注，这个项目使用的是less在线替换的方式，但是实际上只要能得到最终的颜色样式内容，后面其实就是采用什么方式去替换颜色的步骤了，使用less.js只是其中一种方法

### 和上面两个插件相比，做了哪些改变呢？
1. 将原来的css中对应的颜色样式进行了删除，这样无论theme-color插入在html的哪个地方，都不需要担心样式覆盖问题
2. 支持热更新
