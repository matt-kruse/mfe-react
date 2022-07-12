import React from 'react';
import {MFEComponent} from '../../../src';

const delay = (timeout)=>{
  return (o)=> {
    return new Promise(r => {
      setTimeout(()=>r(o), timeout);
    });
  }
};

const Error = (props)=>{
    return (
        <div>Trapped Error: {props.errorMessage}</div>
    );
};

const StaticBackupComponent = (props)=>{
  return (
    <div>Count: {props.count}</div>
  );
};

const Loading = ()=>{
  return <div>Loading...</div>
};

const MFECard = (props)=>{
  return (
    <div style={{"margin":"15px","width":"400px","display":"inline-block","float":"left","minHeight":"200px","border":"1px solid #666"}}>
      <div style={{borderBottom:"1px solid #ccc",padding:"8px",backgroundColor:"#c0d3db"}}>{props.title}</div>
      <div style={{"padding":"10px"}}>{props.children}</div>
    </div>
  );
};

const RemoteButton = MFEComponent(import('ComponentLibrary/Button'),null,'Button');
const ComponentError = MFEComponent(import('ComponentLibrary/ComponentError'),{errorHandler:Error},'ComponentError');
const ComponentError2 = MFEComponent(import('ComponentLibrary/ComponentError'),{errorHandler:StaticBackupComponent},'ComponentError2');
const DelayedComponent = MFEComponent(import('ComponentLibrary/DelayedComponent').then(delay(5000)),{fallback:<Loading/>},'DelayedComponent');
const PlainJavascriptComponent = MFEComponent(import('ComponentLibrary/PlainJavascriptComponent'),null,'PlainJavascriptComponent');
const PlainJavascriptError = MFEComponent(import('ComponentLibrary/PlainJavascriptError'),null,'PlainJavascriptError');
const VueComponent = MFEComponent(import('ComponentLibrary/VueComponent'),null,'VueComponent');
const DestructiveStyleComponent = MFEComponent(import('ComponentLibrary/DestructiveStyleComponent'),null,'DestructiveStyleComponent');
const ShadowStyleComponent = MFEComponent(import('ComponentLibrary/ShadowStyleComponent'),{shadowDOM:true}, 'ShadowStyleComponent');
const ReactVersionComponent = MFEComponent(import('ComponentLibrary/ReactVersionComponent'),null,'ReactVersionComponent');
const SolidComponent = MFEComponent(import('ComponentLibrary/SolidComponent'),null,'SolidComponent');

const App = () => {
  const [count,setCount] = React.useState(0);
  const inc = ()=>{
      setCount(count+1);
  };

  return (
    <div>
      <h1>Micro-Frontend Example with mfe-react</h1>
      <p>Host react version: {React.version}</p>
      <p>Counter stored as state in the host app: <b>{count}</b> <button onClick={inc}>Increment</button> </p>

      <MFECard title={"MFE React Version"}>
        <ReactVersionComponent/>
      </MFECard>

      <MFECard title={"Simulating a slow-loading component..."}>
        <DelayedComponent/>
      </MFECard>

      <MFECard title={"Offer a button to increment host counter above, which gets passed to other components."}>
        <RemoteButton msg={"Increment Counter"} onclick={inc}/>
      </MFECard>

      <MFECard title={"Throw an error that is caught with a custom error handler component."}>
        <ComponentError count={count}/>
      </MFECard>

      <MFECard title={"Display a static fallback component when a dynamic MFE fails to load"}>
        <ComponentError2 count={count}/>
      </MFECard>

      <MFECard title={"A Plain Javascript component that exposes mount() and update()."}>
        <PlainJavascriptComponent count={count}/>
      </MFECard>

      <MFECard title={"A Plain Javascript component that has a trapped error."}>
        <PlainJavascriptError/>
      </MFECard>

      <MFECard title={"A Vue3 SFC (Single-File-Component)"}>
        <VueComponent count={count} increment={inc}/>
      </MFECard>

      <MFECard title={"SolidJS Component"}>
        <p>A component built using the SolidJS Framework</p>
        <SolidComponent count={count} increment={inc}/>
      </MFECard>

      <MFECard title={"An MFE that contains a global style rule that affects the host."}>
        <DestructiveStyleComponent/>
      </MFECard>

      <MFECard title={"Guard against style bleed-out using ShadowDOM."}>
        <ShadowStyleComponent count={count}/>
      </MFECard>
    </div>
  );
};

export default App;
