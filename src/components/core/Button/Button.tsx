import { FC } from 'react';

interface ButtonProps {
    text: string;
    onClicked: () => void;
}

const Button: FC<ButtonProps> = ({ text, onClicked }) =>  {
    return (
        <div className="btn-wrap"> 
            <button 
                className="btn reload-btn black" 
                onClick={onClicked}
            >
                {text}
            </button>
        </div>
    );
}

export default Button;
