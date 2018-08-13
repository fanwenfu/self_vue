// import Dep from './Observer'
function Watcher(vm,exp,cb){
    this.cb = cb;//回调
    this.vm = vm;//data:对象
    this.exp = exp;//要改变的值
    this.value = this.get();//将自己添加到订阅者
}

Watcher.prototype = {
    update(){
        this.run()
    },
    run(){
        var value = this.vm.data[this.exp];
        var oldVal = this.value;
        if(value != oldVal){
            this.value = value
            this.cb.call(this.vm,value,oldVal);
        }
    },
    get(){
        // console.log(this)
        Dep.target = this;//缓存自己
        var value = this.vm.data[this.exp];// 强制执行监听器里的get函数
        Dep.target = null;//释放自己
        return value
    }
}