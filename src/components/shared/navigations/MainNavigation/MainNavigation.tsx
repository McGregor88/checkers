import { FC } from 'react';
import './MainNavigation.scss';

interface NavProps {
    show: boolean;
}

interface IMenuItem {
    text: string;
}

const menu: IMenuItem[] = [{
    text: 'Play',
}, {
    text: 'Settings',
}, {
    text: 'Credits',
}];

const MainNavigation: FC<NavProps> = ({ show }) => {
    return (
        <div className="main-navigation hidden">
            <ul className="main-menu">
                {menu.map((item: IMenuItem) =>
                    <li 
                        key={item.text}
                        className='main-menu__item'
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
