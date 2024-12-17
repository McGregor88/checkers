import { FC } from 'react';
import './Button.css';

interface ButtonProps {
    text: string;
    className: string;
    onClicked: () => void;
}

const Button: FC<ButtonProps> = ({ text, className, onClicked }) =>  (
    <div className="btn-wrap"> 
        <button 
            className={[ "btn", className ].join(' ').trim()}
            onClick={onClicked}
        >
            {text}
        </button>
    </div>
);

export default Button;
