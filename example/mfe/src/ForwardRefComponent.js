import React from 'react';

const MyForwardRefButton = React.forwardRef((props,ref) => {
    return <div>
        <button ref={ref} onClick={props.onclick}>{props.msg || "Default Button"}</button>
    </div>
});

export default MyForwardRefButton;
