/*
 * @Author: your name
 * @Date: 2022-01-02 18:38:55
 * @LastEditTime: 2022-01-02 18:41:03
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue\src\observer.js
 */
    //监听器
    function Observer(data) {
        this.data = data;
        // 将传入的对象进行数据劫持
        this.walk(data);
    }
    Observer.prototype = {
        // 遍历对象所有键，进行数据劫持
        walk: function (data) {
            var self = this;
            Object.keys(data).forEach(function (key) {
                self.defineReactive(data, key, data[key]);
            });
        },
        defineReactive: function (data, key, val) {
            var dep = new Dep();
            // 递归遍历劫持所有属性
            observe(val);
            Object.defineProperty(data, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                    // 当有Dep.target的时候并且属性被读取的时候，则将当前的Dep.target添加在订阅者列表中
                    if (Dep.target) {
                        dep.addSub(Dep.target);
                    }
                    return val;
                },
                set: function (newVal) {
                    if (newVal === val) {
                        return;
                    }
                    val = newVal;
                    // 当值发生变动的时候，通知订阅者列表中所有的订阅者调用自身的update函数
                    dep.notify();
                }
            });
        }
    };

    function observe(value, vm) {
        if (!value || typeof value !== 'object') {
            return;
        }
        return new Observer(value);
    };

