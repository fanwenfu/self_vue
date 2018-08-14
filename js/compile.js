//重点：使用documentFragment解决频繁操作dom问题 
//vm:vue实例，el：#app
function Compile(el, vm) {
    this.vm = vm;
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
        //DocumentFragment节点不属于文档树，继承的parentNode属性总是null。它有一个很实用的特点，当请求把一个DocumentFragment节点插入文档树时，
        //插入的不是DocumentFragment自身，而是它的所有子孙节点。这个特性使得DocumentFragment成了占位符，
        //因为遍历解析的过程有多次操作dom节点，为提高性能和效率，会先将根节点el转换成文档碎片fragment进行解析编译操作，解析完成，再将fragment添加回原来的真实dom节点中
        var fragment = document.createDocumentFragment();//创建一个虚拟的节点对象
        var child = el.firstChild;
        // console.log(el)
        // console.log(child)
        while (child) {
            // 将原生节点拷贝到fragment
            fragment.appendChild(child);//将原dom树中的节点添加到DocumentFragment中时，会删除原来的节点。 
            child = el.firstChild
            
        }
        // console.log(fragment)
        return fragment;
    },
    //compileElement,将遍历所有节点及其子节点，进行扫描解析编译，调用对应的指令渲染函数进行数据渲染，并调用对应的指令更新函数进行绑定
    compileElement: function (el) {
        // console.log(el.childNodes)
        var childNodes = el.childNodes;
        var self = this;
        [].slice.call(childNodes).forEach(function(node) {
            var reg = /\{\{(.*)\}\}/;// 表达式文本{{}}
            var text = node.textContent;
            // console.log(node)
            // 按元素节点方式编译
            if (self.isElementNode(node)) {  
                self.compile(node);
            } else if (self.isTextNode(node) && reg.test(text)) {
                self.compileText(node, reg.exec(text)[1]);
            }
            // 遍历编译子节点
            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node);
            }
        });
    },
    compile: function(node) {
        var attrs = node.attributes;
        var self = this;
        [].slice.call(attrs).forEach(function(attr) {
            
            var attrName = attr.name;// 得到相关属性，如：class，v-model，v-on:click
            if (self.isDirective(attrName)) {
                var exp = attr.value;// name，age，clickMe
    
                var dir = attrName.substring(2);
                console.log(dir)
                if (self.isEventDirective(dir)) {  // 事件指令
                    // 事件指令, 如 v-on:click
                    self.compileEvent(node, self.vm, exp, dir);
                } else {  // v-model 指令
                    self.compileModel(node, self.vm, exp, dir);
                }
                node.removeAttribute(attrName);
            }
        });
    },
    compileText: function(node, exp) {
        var self = this;
        var initText = this.vm[exp];
        this.updateText(node, initText);
        new Watcher(this.vm, exp, function (value) {
            self.updateText(node, value);
        });
    },
    // v-on指令，vm：vue实例，exp：相关属性内容，dir：on:click，node：对应节点
    compileEvent: function (node, vm, exp, dir) {
        var eventType = dir.split(':')[1];
        var cb = vm.methods && vm.methods[exp];

        if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm), false);
        }else{
            console.log('methods没有定义'+exp)
        }
    },
    // v-model指令
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
    updateText: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    },
    isDirective: function(attr) {
        return attr.indexOf('v-') == 0;
    },
    isEventDirective: function(dir) {
        return dir.indexOf('on:') === 0;
    },
    isElementNode: function (node) {
        return node.nodeType == 1;
    },
    isTextNode: function(node) {
        return node.nodeType == 3;
    }
}