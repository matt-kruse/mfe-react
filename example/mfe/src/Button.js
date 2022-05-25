import React from 'react';

const MyButton = (props) => {
    return <div>
        <button onClick={props.onclick}>{props.msg || "Default Button"}</button>
    </div>
};

export default MyButton;
