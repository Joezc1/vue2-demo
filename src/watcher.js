// 订阅者 Watcher的应用十分广泛，Watcher会传入一个回调函数，当订阅的数据变化的时候会调用该回调函数
function Watcher(vm, exp, cb) {
    // 回调函数
    this.cb = cb;
    // 传入的实例对象
    this.vm = vm;
    // 对应的是vm中data的键，可以理解成v-model绑定的key,例如v-model="name"，此时exp就对应name
    this.exp = exp;
    // Watcher的初始值，构造函数调用的时候就对被劫持的对象进行一次
    this.value = this.get();  // 将自己添加到订阅器的操作
}

Watcher.prototype = {
    update: function() {
        this.run();
    },
    run: function() {
        var value = this.vm.data[this.exp];
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            //更新value以后 改变this指向的同时调用回调函数，将当前传入的实例返回
            this.cb.call(this.vm, value, oldVal);
        }
    },
    get: function() {
        Dep.target = this;  // 缓存自己
        var value = this.vm.data[this.exp]  // 强制执行监听器里的get函数，将当前的this添加到订阅者列表，其实等价于Dep.addSub(this)
        Dep.target = null;  // 释放自己
        return value;
    }
};