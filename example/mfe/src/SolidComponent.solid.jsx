import { createSignal } from "solid-js";
import { render } from "solid-js/web";

const Counter = (props) => {
  return (
      <div>
        <p>SolidJS Component</p>
        <div>Count: {props.count} <button onclick={props.increment}>Increment</button></div>
      </div>
  );
};
let dispose = function(){};
Counter.mount = ({domElement,...props}) => {
  dispose = render(()=><Counter {...props}/>, domElement);
};
Counter.unmount = dispose;
Counter.update = ({domElement,...props})=>{
  dispose();
  render(()=><Counter {...props}/>, domElement);
};
Counter.bootstrap = ()=>{};
export default Counter;

