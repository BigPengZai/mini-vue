const h = (tag, props, children) => {
  // vnode -->javascript ->{}
  return {
    tag,
    props,
    children,
  };
};

const mount = (vnode, container) => {
  // 创建真实的 dom
  // 1.  vnode --》 el ，并且在vnode中保留一份
  const el = (vnode.el = document.createElement(vnode.tag));

  // 2.处理 props
  if (vnode.props) {
    for (const key in vnode.props) {
      const value = vnode.props[key];
      // edge processing
      if (key.startsWith("on")) {
        //addEventListener
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  // 3.处理children
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      el.textContent = vnode.children;
    } else {
      vnode.children.forEach((item) => {
        mount(item, el);
      });
    }
  }
  // 4.将 el 挂载到 container 中
  container.appendChild(el);
};

// vnode1 , vnode2  进行 diff
const patch = (n1, n2) => {
  if (n1.tag !== n2.tag) {
    //直接移除
    const n1ElParent = n1.el.parentElement;
    n1ElParent.removeChild(n1.el);
    mount(n2, n1ElParent);
  } else {
    //   1.取出 el对象并且在n2 中保存一份
    const el = (n2.el = n1.el);
    //   2.处理 props
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    // 2.1 将所有newPros 添加到 n1 中
    for (const key in newProps) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if (newValue !== oldValue) {
        if (key.startsWith("on")) {
          el.addEventListener(key.slice(2).toLowerCase(), newValue);
        } else {
          el.setAttribute(key, newValue);
        }
      }
    }

    // 2.2 删除 旧的props ，如果新的node没有 旧中的属性，旧中就移除
    for (const key in oldProps) {
      //    if(!(key in newProps)){
      //        if(key.startsWith('on')){
      //            const value = oldProps[key]
      //            el.removeEventListener(key.slice(2).toLowerCase(),value)
      //        }else{
      //            el.removeAttribute(key)
      //        }
      //    }
      if (key.startsWith("on")) {
        // 对事件监听的判断
        const value = oldProps[key];
        el.removeEventListener(key.slice(2).toLowerCase(), value);
      }
      if (!(key in newProps)) {
        el.removeAttribute(key);
      }
    }

    //  3处理 children
    const oldChidren = n1.children || [];
    const newChidren = n2.children || [];

    if (typeof newChidren === "string") {
      // first case: newChildren is string
      // TODO: edge case  边界情况的处理
      // el.innerHTML = newChidren
      if (typeof oldChidren === "string") {
        if (newChidren !== oldChidren) {
          el.textContent = newChidren;
        }
      } else {
        el.innerHTML = newChidren;
      }
    } else {
      // second case: newChildren is array

      if (typeof oldChidren === "string") {
        el.innerHTML = "";
        newChidren.forEach((item) => {
          mount(item, el);
        });
      } else {
        //    oldChildren:[v1,v2,v3]
        //    newChildren:[v1,v4,v5,v6,v7]
        // 1.前面有相同节点的情况处理
        const commonLength = Math.min(oldChidren.length, newChidren.length);
        for (let i = 0; i < commonLength; i++) {
          patch(oldChidren[i], newChidren[i]);
        }
        // 2.newChildren > oldChildren
        if (newChidren.length > oldChidren.length) {
          newChidren.slice(oldChidren.length).forEach((item) => {
            mount(item, el);
          });
        }
        // 3.newChildren < oldChildren
        if (newChidren.length < oldChidren.length) {
          // unmount
          oldChidren.slice(newChidren.length).forEach((item) => {
            el.removeChild(item.el);
          });
        }
      }
    }
  }
};
