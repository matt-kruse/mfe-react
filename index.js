import React from 'react';
import ReactShadowRoot from 'react-shadow-root';

// The default MFE Configuration
let defaultConfig = {
  shadowDOM: false,
  errorHandler: null,
  fallback: null,
  log: false
};

// Test if a loaded module is a React component (the other option is a Parcel).
// This will not work if the external module is any other type of plain
// function, but you shouldn't use this wrapper in those cases.
const isModuleReactComponent = module=>{
  return module && module.default && typeof module.default==="function" && !module.default.mount;
};

// This Wrapper may wrap a React Component or a plain javascript component.
// The argument is just an import statement, which gets turned into a Promise that
// resolves when the remote module is loaded.
// The imported component must either be a React Component or a Parcel format: mount() etc
export const MFEComponent = function (importPromise,config,id) {
  // Apply the passed config to the default config for this MFE's effective config
  config = Object.assign({},defaultConfig, config);

  const logLabel = `${id?'[MFE '+id+'] ':''}`;
  const log = function(msg) {
    if (!config.log) return;
    if (typeof msg==="object") {
      window.console.info(logLabel,msg);
    }
    else {
      window.console.info(`${logLabel}${msg}`);
    }
  };
  log("Running MFEComponent");

  // Has the import resolved yet?
  let resolved = false;
  // What type is the module?
  let isReactComponent = null;

  // Component is the actual object we use in our output
  let Component = null;
  // Parcel is the possible remote component with mount() etc
  let Parcel = null;

  // This is a component to trap errors in sub-components, since MFEs can be unpredictable.
  // We don't want errors to propagate up and break the host page.
  // It prevents itself from re-rendering if the MFE is a Parcel, because we don't
  // want it to unmount and then mount again and potentially lose state.
  class BoundaryErrorWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        hasError: false,
        errorMessage: null
      };
    }
    shouldComponentUpdate(nextProps, nextState) {
      log("shouldComponentUpdate");
      let {children,...props} = nextProps;
      log(props);

      // If the module has not yet resolved or if it's a React component, we always want to re-render.
      // But for Parcel components, we never want to re-render, just call update()
      if (this.state.hasError) {
        log("error, BoundaryError should update");
        return true;
      }
      if (!resolved) {
        log("module is not yet resolved, BoundaryError should update");
        return true;
      }
      if (isReactComponent) {
        log("module is a React component, BoundaryError should update");
        return true;
      }
      log("module is not a React component")
      if (Parcel.update) {
        log("It has an update() method, calling it");
        // Add domElement to the props
        props.domElement = Parcel.domElement;
        try {
          Parcel.update(props);
        } catch (e) {
          // If the update() call throws, we want to catch it and re-render the error
          this.state.hasError = true;
          this.state.errorMessage = e.toString();
          return true;
        }
        return false;
      }
      return true;
    }
    componentDidCatch(error, errorInfo) {
      // console.warn(error);
      // console.warn(errorInfo);
    }
    static getDerivedStateFromError(error,b,c) {
      return {
        hasError: true,
        errorMessage: `${error?error.toString():error}`
      };
    }
    render() {
      log("BoundaryErrorWrapper is rendering");
      if (this.state.hasError) {
        log("BoundaryError error!");
        log(this.state.errorMessage);
        let Err = config.errorHandler;
        if (Err) {
          if (typeof Err=="string") return Err;
          return <Err {...this.props} errorMessage={this.state.errorMessage}/>;
        }
        return <div>MFE Component Error: {this.state.errorMessage}</div>;
      }
      return (<React.Fragment>{this.props.children}</React.Fragment>);
    }
  }

  // What to do when the import() actually resolves to the module
  let modulePromise = importPromise.then(module=>{
    log("Promise resolved");
    resolved = true;

    // If the module is a React Component, return it, we're done.
    isReactComponent = isModuleReactComponent(module);
    log(`isModuleReactComponent=${isReactComponent}`);
    if (isReactComponent) {
      return module;
    }

    log("Module is not a react component");

    // If it is not a React component, then we need to turn it into one!
    isReactComponent = false;
    let mounted = false;
    Parcel = module.default;
    Component = (props)=> {
      log("Component render");
      // This will be a reference to the DOM node we mount to
      let ref = React.createRef();
      let [error, setError] = React.useState(null);

      // Once the React component renders, let the Parcel component mount itself.
      React.useEffect(() => {
        log("Non-React Component has rendered in useEffect");
        log(props);
        // If the component gets a forced re-render, unmount then re-mount the non-react component
        if (mounted && Parcel.unmount) {
          Parcel.unmount();
          mounted = false;
        }
        if (!mounted) {
          mounted = true;
          try {
            // First we call the Parcel bootstrap method
            if (Parcel.bootstrap) {
              Parcel.bootstrap();
            }
            // Now we call mount()
            // The Parcel API requires us to pass in a "domElement" prop which is where the component will mount
            log("Calling mount");
            Parcel.domElement = ref.current;
            Parcel.mount({domElement: Parcel.domElement, ...props});
          } catch (e) {
            setError(e.toString());
          }
        }
        // Cleanup Method
        // This will run when component unmounts, so unmount the Parcel instance
        return function () {
          log("Cleanup in useEffect - unmounting");
          if (mounted && Parcel.unmount) {
            log("Unmounting app");
            Parcel.unmount();
            mounted = false;
          }
        }
      }, []);
      return error ? <div>MFE Component Error: {error}</div> : <div ref={ref}></div>;
    };
    // Now return the native React component back in module format as expected
    return {
      default:Component
    }
  });

  // The above code just chains on to the import() promise, so the output is a module in the
  // format that React.lazy() expects, whether it's a React component or Parcel.
  // Now just create a Lazy Component from it which will resolve when the module loads.
  Component = React.lazy(()=>modulePromise);

  // This is the actual Component that the wrapper returns.
  return (props) => {
    log("Rendering Component");

    // Attach a shadow dom root?
    if (config.shadowDOM) {
      return (
        <BoundaryErrorWrapper {...props}>
          <ReactShadowRoot>
            <React.Suspense fallback={config.fallback || ''}>
              <Component {...props}/>
            </React.Suspense>
          </ReactShadowRoot>
        </BoundaryErrorWrapper>
      );
    }

    return (
      <BoundaryErrorWrapper {...props}>
        <React.Suspense fallback={config.fallback || ''}>
          <Component {...props}/>
        </React.Suspense>
      </BoundaryErrorWrapper>
    );
  };
};

export default MFEComponent;

