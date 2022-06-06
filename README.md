# React Micro-Frontend Component Wrapper

### Description

This module simplifies the lazy import of remote Micro-Frontends into a React app, and automatically wraps them in &lt;suspense&gt;, an ErrorBoundary, and optionally Shadow DOM. This allows MFEs to be isolated from the containing page and have robust error handling to prevent them from breaking their host.

It supports loading React Components directly or single-spa "Parcel" style plain javascript components with mount(), bootstrap(), unmount(), and update() methods.

### Demo

https://matt-kruse.github.io/mfe-react/example/host/dist/

You can also install the demo in the `example` directory of this repo.

### Example

Regardless of the component implementation, the result is a React Component that can be used on the page as-is and passed props. This example uses Module Federation to load the remote component.

```javascript
import {MFEComponent} from 'mfe-react';
const RemoteButton = MFEComponent(
  import('ComponentLibrary/Button'),
  {
    fallback:<Loading/>,
    errorHandler:Error,   
    shadowDOM:true,  // default: false
    log:true         // default: false
  },
  'Button'
);
```

Then use `RemoteButton` in your JSX:
```
<RemoteButton label="MFE"/>
```

The remote code will be lazy loaded, displaying your fallback until it is loaded, then will display the Component output. If any error occurs, the `<Error/>` component will be displayed, with an `errorMessage` prop containing the string error message.

### API

#### MFEComponent( *&lt;import statement&gt;* , {config} , label )

##### import

Use a normal import statement, which resolves to a Promise.

##### config

* fallback: What to display while the remote component loads
* errorHandler: What to display if there are any errors
* shadowDOM: boolean indicating whether to use the Shadow DOM to guard against CSS leaks
* log: boolean to determine if console.log() should be called for debugging

##### label

An optional string label to be used in logging statements to identify this MFE

### Parcel Support

A remote module need not be written in React when using MFEComponent(). If it implements the single-spa [Parcel](https://single-spa.js.org/docs/parcels-overview/) format then the MFEComponent applies an adapter to make it work.

An example in Parcel format:
```javascript
const bootstrap = ()=>{};
const mount = ({domElement,...props})=>{
  domElement.innerHTML = "Plain Javascript MFE.";
};
const unmount = ()=>{};
const update = ({domElement,...props})=>{
  let count = props.count;
  domElement.innerHTML = `Updated with count: ${count}`;
};
export default { bootstrap, mount, unmount, update };
```

This Component can be used like this:
```javascript
const ParcelComponent = MFEComponent(import('...'));

<ParcelComponent property={"value"}/>
```

It will receive props in its mount() method, along with which DOM element to mount itself to. Subsequent re-renders of `<ParcelComponent>` will call the update() method, passing the new props. It is the responsibility of the Parcel Component to behave correctly.
