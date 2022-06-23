const createApp = (rootComponent) => {
  return {
    mount(select) {
      const container = document.querySelector(select);
      let isMounted = false;
      let oldVNode = null;

      watchEffect(() => {
        if (!isMounted) {
          oldVNode = rootComponent.render();
          mount(oldVNode, container);
          isMounted = true;
        } else {
          //    update
          const newVNode = rootComponent.render();
          patch(oldVNode, newVNode);
          oldVNode = newVNode;
        }
      });
    },
  };
};
