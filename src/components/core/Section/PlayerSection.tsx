import { FC } from 'react';
import _ from 'lodash';

import './PlayerSection.css'
import { Player } from '../../../models/Player';
import { Figure } from '../../../models/figures/Figure';
import { Colors } from '../../../types/colors';

interface PlayerSectionProps {
    currentPlayer: Player | null;
    title: string;
    color: Colors;
    figures: Figure[];
}

const PlayerSection: FC<PlayerSectionProps> = ({ currentPlayer, title, color, figures }) => (
    <div 
        className={_.trim([
            `player-section ${color}`,
            currentPlayer?.color === color ? 'active': ''
        ].join(' '))}
    >
        <h3 className="player-section__title">{title}</h3>
        <ul className="player-section__list figures">
            {figures.map(figure => (
                <li key={figure.id} className={`figure ${figure?.isDame ? 'is-dame' : ''}`}>
                    {figure.logo && <img src={figure.logo} alt={figure.name} className="figure__icon" />}
                </li>
            ))}
        </ul>
    </div>
)

export default PlayerSection;
