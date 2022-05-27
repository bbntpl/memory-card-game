import FlagsCollection from '../FlagsCollection';
import './styles.css';

import Progress from '../Progress';

export default function Main(props) {
	const { totalUniqueVisits, totalRounds } = props;
	return (
		<div className='main'>
			<div className='memory-card-screen'>
				<Progress
					totalUniqueVisits={totalUniqueVisits}
					totalRounds={totalRounds}
				/>
				<FlagsCollection {...props} />
			</div>
		</div>
	)
}