// function Vue(obj){
//     var self = this;
//     this.data = obj.data;
//     this.methods = obj.methods
//     Object.keys(this.data).forEach(function(key){
//         self.proxyKeys(key)
//     })

//     observe(this.data);
//     new Compile(options.el, this);
//     options.mounted.call(this); // 所有事情处理好后执行mounted函数
// }
// Vue.prototype = {
//     proxyKeys(key){
//         var self = this;
//         Object.defineProperty(this,key,{
//             enumerable:false,
//             configurable:true,
//             get:function getter(){
//                 return self.data[key];
//             },
//             set: function setter (newVal) {
//                 self.data[key] = newVal;
//             }
//         })
//     }
// }
function SelfVue (data, el, exp) {
    this.data = data;
    observe(data);
    el.innerHTML = this.data[exp];  // 初始化模板数据的值
    new Watcher(this, exp, function (value) {
        el.innerHTML = value;
    });
    return this;
}