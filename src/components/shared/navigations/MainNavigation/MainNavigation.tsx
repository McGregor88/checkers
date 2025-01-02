import { FC } from 'react';
import './MainNavigation.scss';

interface NavProps {
    show: boolean;
    restart: () => void;
}

interface IMenuItem {
    text: string;
    disabled: boolean;
    onClick: () => void;
}

const MainNavigation: FC<NavProps> = ({ show, restart }) => {
    const menu: IMenuItem[] = [{
        text: 'Play',
        disabled: false,
        onClick: restart,
    }, {
        text: 'Settings',
        disabled: true,
        onClick: () => {},
    }, {
        text: 'Credits',
        disabled: true,
        onClick: () => {},
    }];

    return (
        <div className={`main-navigation ${!show ? 'hidden' : ''}`}>
            <ul className="main-menu">
                {menu.map((item: IMenuItem) =>
                    <li 
                        key={item.text}
                        className={`main-menu__item ${item.disabled ? 'disabled' : ''}`}
                        onClick={item.onClick}
                    >
                        <span 
                            className='main-menu__item-text'
                        >
                            {item.text}
                        </span>
                    </li>
                )}
            </ul>
        </div>
    );
}


export default MainNavigation;
