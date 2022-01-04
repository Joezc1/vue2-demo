// 创建自己的Vue实例，该实例的主要目的是将
function myVue (options) {
    var self = this;
    this.vm = this;
    this.data = options.data;
    this.methods = options.methods;

    Object.keys(this.data).forEach(function(key) {
        self.proxyKeys(key);
    });

    observe(this.data);
    new Compile(options.el, this.vm);
    options.mounted.call(this); // 所有事情处理好后执行mounted函数
}

// 该函数的作用是调用this.data[name]赋值取值的时候可以省略data,直接this.name进行赋值取值，相当于一个代理，为了更像Vue写法
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