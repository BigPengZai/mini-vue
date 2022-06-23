// 依赖
class Dep {
  constructor() {
    // 添加订阅者，并删除重复依赖
    this.subsribers = new Set();
  }
  // 添加effect 的重构
  depend() {
    if (activeEffect) {
      this.subsribers.add(activeEffect);
    }
  }
  // notify
  notify() {
    this.subsribers.forEach((effect) => {
      effect();
    });
  }
}
// 执行dep 的方法时，不需要依赖effect。依然可以添加到subscribers中
let activeEffect = null;
function watchEffect(effect) {
  activeEffect = effect;

  // deep:true
  effect();
  activeEffect = null;
}

// weakMap key:对象，弱引用

// 通过数据结构来管理 dep
const targetMap = new WeakMap();
function getDep(target, key) {
  // 根据target对象取出 对应的Map对象
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  //    取出对应的dep
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

// raw  原始数据，数据发生变化 进行劫持,自动收集依赖
function reactive(raw) {
  Object.keys(raw).forEach((key) => {
    const dep = getDep(raw, key);
    let value = raw[key];
    Object.defineProperty(raw, key, {
      get() {
        dep.depend();
        return value;
      },
      set(newValue) {
        if (value !== newValue) {
          value = newValue;
          dep.notify();
        }
      },
    });
  });

  return raw;
}

// const info  = {salary:100,name:'peyton'}
// const info1 = {age:32}

const info = reactive({ salary: 100, name: "peyton" });
const info1 = reactive({ age: 32 });

const dep = new Dep();

// watchEffect1
watchEffect(function () {
  console.log(info.salary * 2, info.name);
});
// watchEffect2
watchEffect(function () {
  console.log(info.salary * 3);
});
// watchEffect3
watchEffect(() => {
  console.log(info1.age);
});

// info.salary ++;
info.name = "peng";

// dep.notify()
