import { FC } from 'react';
import { Figure } from '../../../models/figures/Figure';
import './PlayerSection.css'

interface PlayerSectionProps {
    title: string;
    figures: Figure[];
}

const PlayerSection: FC<PlayerSectionProps> = ({ title, figures }) => (
    <div className="player-section">
        <h3 className="player-section__title">{title}</h3>
        <ul className="player-section__list figures">
            {figures.map(figure => (
                <li key={figure.id} className="figure">
                    { figure.logo && <img src={figure.logo} alt={figure.name} className="figure__logo" /> }
                </li>
            ))}
        </ul>
    </div>
)

export default PlayerSection;
