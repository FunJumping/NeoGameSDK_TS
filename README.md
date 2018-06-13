# hello vue

>  Vue + Typescript + Webpack 初学者入门Demo

## 运行前端

``` bash
# 安装依赖
npm install

# 启动。从浏览器访问 localhost:8080
npm run dev

# 生成生产环境的最小化包
npm run build

# 生成生产环境的最小化包并查看报告
npm run build --report
```

> 如果需要联调，例如调试ajax，就需要启动服务器代码。我们使用了webpack的代理功能，这样就可以在8080端口调用api，而不会出现跨域问题。具体实现参见build/webpack.base.conf.js。
## 启动后端mini-server
```bash
#切换到server目录
cd mini-server
#运行服务器端
npm start
```
模拟了一个后端微型的服务器。

## 目录结构
- src是前端代码
- mini-server是微型nodejs服务器代码，使用了express框架
- build是webpack构建配置文件
- dist是build后生成的可发布文件
- static是静态css/js/fonts文件，编译时会被复制到dist目录下。

## 代码解读

> 重点看一下src目录下的源代码，新项目可以在这里接着写。其他目录下的代码几乎不用动。对于Vue的基本概念还是要到官网学习。

- index.html首页框架代码。webpack打包后的css/js文件引用会插入到该文件，压缩后拷贝到dist目录。
- assets目录几乎没什么用了，有了static目录。
- components存放vue的组件。VLink.vue使用的是es6的export/import语法。也可以使用官网的es5语法。定义了组件的属性href，以及内部点击事件调用go方法实现路由跳转。结合main.ts，了解路由的实现。
- layouts存放页面布局代码。Main.vue演示了如何使用VLink.vue组件。Main.vue又作为布局组件，提供给pages目录里的页面使用。
- pages目录是功能页面的实现。前面的所有代码都是为了让pages里的页面服务的。home.vue使用了Main.vue组件，逻辑代码分离到home.ts文件中。
- home.ts使用了类型化的ts写法定义Vue组件。类的属性Message映射到传统Vue的data属性，类的方法映射到Vue的methods，事件created、mounted等自动映射。其他Vue特性通过@Component、@Prop等指令映射。更多用法参考[vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)，或者[这里](https://www.cnblogs.com/crazycode2/p/7821389.html)。
- home.ts中还演示了await/async的用法，异步代码同步化的写法，使代码逻辑更加清晰。
- about.vue保持了原始的es6写法。
- main.ts 入口函数。不仅是Vue执行的入口，还是Webpack打包的入口。webpack从main.ts出发，检查import引用的Vue组件，打包成一个app.[hash].js，第三方公共库打包成vendor.[hash].js。打包的细节参加webpack的配置文件webpack.base.conf.js
- main.ts 现实了webpack的代码分离技术，使用require而不是import，从而使特定模块组件脱离app.[hash].js，实现按需加载。404.vue只有真正需要时才加载，从而减少了初次加载的体积，提高了加载速度。
- main.ts实现了一个简单的路由。此路由并不依赖于VLink.vue组件，是完全独立的。