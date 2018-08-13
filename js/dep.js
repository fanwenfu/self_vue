function Dep(){
	this.subs = [];//存储订阅者
	// console.log(this.subs)
}

Dep.prototype = {
	addSub:function(sub){
		this.subs.push(sub);
		// console.log(this.subs)
	},
	notify:function(){
		this.subs.forEach(function(sub){
			console.log(sub)
			sub.update();
		})
    },
    // removeSub (sub) {
    //     remove(this.subs, sub)
    // }
}

Dep.target = null;