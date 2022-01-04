function Dep () {
    this.subs = [];
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};
// Dep target的设计很巧妙，用来保证同一时间只能有一个全局的 Watcher 被计算
Dep.target = null;