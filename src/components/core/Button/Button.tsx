import { FC } from 'react';
import _ from 'lodash';
import './Button.css';

interface ButtonProps {
    text: string;
    className: string;
    onClicked: () => void;
}

const Button: FC<ButtonProps> = ({ text, className, onClicked }) =>  (
    <div className="btn-wrap"> 
        <button 
            className={_.trim([ "btn", className ].join(' '))}
            onClick={onClicked}
        >
            {text}
        </button>
    </div>
);

export default Button;
