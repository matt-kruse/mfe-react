import React from 'react';

const style = `* { color:red; }`;
const ShadowStyleComponent = (props) => {
    return <div>
      <style>{style}</style>
      <p>This component contains a style block with a destructive global style.</p>
      <pre>&lt;style&gt;{style}&lt;/style&gt;</pre>
      <p>Count: {props.count}</p>
      <p>The destructive style does not bleed out of this MFE.</p>
    </div>
}
export default ShadowStyleComponent;
