// 创建自己的Vue实例，该实例的主要目的是将各个部件连接起来
// options结构大概长这样
//  {
//     el: '#app',
//     data: {
//         title: '标题初始值',
//         name: 'input初始值'
//     },
//     methods: {
//         changeVal: function () {
//             this.title = '新的标题';
//         },
//         changeInput: function(){
//             this.name = "新的input值"
//         }
//     },
//     mounted: function () {
//         window.setTimeout(() => {
//             this.title = '初始化结束了';
//         }, 1000);
//     }
// }
function myVue (options) {
    var self = this;
    this.vm = this;
    this.data = options.data;
    this.methods = options.methods;

    // 这里只是为了赋值value更像vue可以忽略
    Object.keys(this.data).forEach(function(key) {
        self.proxyKeys(key);
    });

    // 遍历劫持data中的所有属性，当对其取值的时候
    observe(this.data);
    new Compile(options.el, this.vm);
    options.mounted.call(this); // 所有事情处理好后执行mounted函数
}

// 该函数的作用是调用this.data[name]赋值取值的时候可以省略data,直接this.name进行赋值取值，相当于一个代理，为了更像Vue写法，可以忽略
myVue.prototype = {
    proxyKeys: function (key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function proxyGetter() {
                return self.data[key];
            },
            set: function proxySetter(newVal) {
                self.data[key] = newVal;
            }
        });
    }
}