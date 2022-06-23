// 依赖
class Dep{
    constructor(){
        // 添加订阅者，并删除重复依赖
        this.subsribers = new Set();
        // weakMap 
    }

    // 添加副作用
    addEffect(effect){
       this.subsribers.add(effect)
    }

    // notify
    notify(){
        this.subsribers.forEach(effect=>{
             effect()
        })
    }
}



const dep = new Dep();
const info  = {salary:100}

function doubleSalary(){
    console.log(info.salary * 2);
}
function tripleSalary(){
    console.log(info.salary *3)
}

// 手动添加
dep.addEffect(doubleSalary)
dep.addEffect(tripleSalary)
// doubleSalary()

// 当有依赖数据发生变化的时候，方法会自动执行
info.salary ++;
// doubleSalary()

dep.notify()