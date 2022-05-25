import { createApp, reactive, h } from 'vue';
import Component from './VueComponent.vue';

let app = null;
let reactiveProps = null;
const mount = ({domElement,...props}) => {
  console.log("Vue component props:");
  console.log("Vue",props);
  reactiveProps = reactive(props);
  app = createApp({
    render() {
      return h(Component,reactiveProps);
    }
  });
  app.mount(domElement);
};

const update = ({domElement,...props}) => {
  console.log("VUE UPDATE!");
  console.log("Vue",props);
  for (let k in props) {
    console.log("Vue",k);
    reactiveProps[k] = props[k];
  }
  console.log("VUE UPDATE COMPLETE");
};

const unmount = ()=>{
  console.log("Unmounting Vue");
  if (app) {
    console.log("app exists");
    app.unmount();
  }
};

export default { mount, unmount, update };