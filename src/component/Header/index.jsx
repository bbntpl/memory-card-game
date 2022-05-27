import Logo from '../Logo';
import Stat from '../Stat';
import './styles.css';
export default function Header(props) {
	const { score, totalUniqueVisits } = props;
	return (
		<div className='header'>
			<Logo />
			<div className='stats-container'>
				<Stat
					best={score.best}
					current={score.current}
					text={'Score'}
				/>
				<Stat
					best={totalUniqueVisits.best}
					current={totalUniqueVisits.current}
					text={'Total Visited Countries'}
				/>

			</div>
		</div>
	)
}