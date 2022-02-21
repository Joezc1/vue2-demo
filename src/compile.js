function Compile(el, vm) {
    // 可以理解成当前的MyVue实例,vm里面包括data,method等一系列属性
    this.vm = vm;
    // el是当前的节点，类似Vue项目中index.html设置的id
    this.el = document.querySelector(el);
    this.fragment = null;
    this.init();
}

Compile.prototype = {
    init: function () {
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        } else {
            console.log('Dom元素不存在');
        }
    },
    nodeToFragment: function (el) {
        var fragment = document.createDocumentFragment();
        var child = el.firstChild;
        while (child) {
            // 将Dom元素移入fragment中
            fragment.appendChild(child);
            child = el.firstChild
        }
        return fragment;
    },
    // 遍历dom元素，判断每个节点类型
    compileElement: function (el) {
        var childNodes = el.childNodes;
        var self = this;
        [].slice.call(childNodes).forEach(function(node) {
            console.log("node",node);
            var reg = /\{\{(.*)\}\}/;
            var text = node.textContent;
            if (self.isElementNode(node)) {  
                // 如果是一个元素节点例如<div><p>，处理节点类型
                self.compile(node);
            } else if (self.isTextNode(node) && reg.test(text)) {
                // 如果是实际的文字
                self.compileText(node, reg.exec(text)[1]);
            }

            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node);
            }
        });
    },
    // 用来处理非文本类型节点
    compile: function(node) {
        var nodeAttrs = node.attributes;
        var self = this;
        Array.prototype.forEach.call(nodeAttrs, function(attr) {
            var attrName = attr.name;
            if (self.isDirective(attrName)) {
                var exp = attr.value;
                var dir = attrName.substring(2);
                // 事件指令 on:
                if (self.isEventDirective(dir)) {  
                    self.compileEvent(node, self.vm, exp, dir);
                } else {  // v-model 指令

                    self.compileModel(node, self.vm, exp, dir);
                }
                node.removeAttribute(attrName);
            }
        });
    },
    // 普通{{}}指令的处理
    compileText: function(node, exp) {
        var self = this;
        var initText = this.vm[exp];
        // 初始值设置，并且为该值添加一个Watcher，以便于当数据变动的时候修改当前文本信息
        this.updateText(node, initText);
        new Watcher(this.vm, exp, function (value) {
            self.updateText(node, value);
        });
    },
    // v-on:click指令处理 当设置v-on:click="methodsName"的时候,该node节点上面调用addEventListener('click',vm.methods[exp],false)
    compileEvent: function (node, vm, exp, dir) {
        var eventType = dir.split(':')[1];
        var cb = vm.methods && vm.methods[exp];

        if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm), false);
        }
    },
    // v-model指令的处理
    compileModel: function (node, vm, exp, dir) {
        var self = this;
        var val = this.vm[exp];
        this.modelUpdater(node, val);
        new Watcher(this.vm, exp, function (value) {
            self.modelUpdater(node, value);
        });

        node.addEventListener('input', function(e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }
            self.vm[exp] = newValue;
            val = newValue;
        });
    },
    // 更新text {{}}指令调用
    updateText: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    // v-model指令时候调用，设置input等表单的值
    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    },
    // 是否是v-指令
    isDirective: function(attr) {
        return attr.indexOf('v-') == 0;
    },
    // 是否是on:的指令
    isEventDirective: function(dir) {
        return dir.indexOf('on:') === 0;
    },
    // 一个 元素 节点，例如 <p> 和 <div>。
    isElementNode: function (node) {
        return node.nodeType == 1;
    },
    // 	Element 或者 Attr 中实际的  文字
    isTextNode: function(node) {
        return node.nodeType == 3;
    }
}