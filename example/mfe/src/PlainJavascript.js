const bootstrap = ()=>{
  console.log("bootstrap: Plain javascript MFE is ready to mount");
};
const mount = ({domElement,...props})=>{
  console.log("mount: Plain javascript MFE is mounted");
  console.log(props);
  domElement.innerHTML = "Plain Javascript MFE. Press any increment counter button to update this MFE with new value.";
};
const unmount = ()=>{
  console.log("unmount: Plain javascript MFE is unmounted");
};
const update = ({domElement,...props})=>{
  console.log("update: Plain javascript MFE is being updated");
  let count = props.count;
  domElement.innerHTML = `Updated with count: ${count}`;
};
export default { bootstrap, mount, unmount, update };
