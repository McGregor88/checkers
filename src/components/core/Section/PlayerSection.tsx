import { FC } from 'react';
import { Figure } from '../../../models/figures/Figure';
import { Colors } from '../../../types/colors';
import './PlayerSection.css'

interface PlayerSectionProps {
    title: string;
    color: Colors;
    figures: Figure[];
}

const PlayerSection: FC<PlayerSectionProps> = ({ title, color, figures }) => (
    <div className={`player-section ${color}`}>
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
