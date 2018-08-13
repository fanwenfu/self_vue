
function Vue (options) {
    var self = this;
    this.data = options.data;
    this.methods = options.methods;
    Object.keys(this.data).forEach(function(key){
        self.proxyKeys(key);//绑定代理属性
    })
    observe(options.data);
    new Compile(options.el, this);
    options.mounted.call(this); // 所有事情处理好后执行mounted函数
    // options.el.innerHTML = this.data[options.exp];  // 初始化模板数据的值
    // new Watcher(this, options.exp, function (value) {
    //     options.el.innerHTML = value;
    // });
    return this;
}
Vue.prototype = {
    proxyKeys:function(key){
        var self = this;
        Object.defineProperty(this,key,{
            enumerable:false,//设置为false，遍历this时可绕过这些内置属性
            configurable:true,
            get:function getter(){
                return self.data[key]
            },
            set:function setter(value){
                self.data[key] = value;
            }
        })
    }
}