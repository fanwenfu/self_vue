function defineReactive(data,key,val) {
	
	observe(val)
	var dep = new Dep();
	// console.log(dep)
	Object.defineProperty(data,key,{
		enumerable:true,
		configurable:true,
		get:function(){
			// console.log('------:'+Dep.target)
			if(Dep.target){//判断是否需要添加订阅者
				dep.addSub(Dep.target)//添加订阅
			}
			return val
		},
		set:function(newVal){
			console.log('set')
			if(val === newVal){
				return
			}
			val = newVal;
			console.log('属性' + key + '已经被监听了，现在值为：“' + newVal.toString() + '”');
			dep.notify();//值变化，通知所有订阅者
		}
	})
}
function observe(data){

	if(!data || typeof data !== 'object'){
		return
	}
	Object.keys(data).forEach(function(key){
		defineReactive(data,key,data[key])
	})
}