import React from 'react';

const style = `button { color:blue !important; }`;
const DestructiveStyleComponent = (props) => {
    return <div>
      <style>{style}</style>
      <p>This component contains a style block with a destructive global style that changes all buttons.</p>
      <pre>&lt;style&gt;{style}&lt;/style&gt;</pre>
      <p>This style bleeds out and affects all buttons on the page, outside of this MFE.</p>
    </div>
}
export default DestructiveStyleComponent;
