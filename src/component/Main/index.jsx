import FlagsCollection from '../FlagsCollection';
import './styles.css';

import Progress from '../Progress';
import Rounds from '../Rounds';

export default function Main(props) {
	const { totalUniqueVisits, totalRounds } = props;
	const round = totalUniqueVisits.current + 1;
	return (
		<div className='main'>
			<Rounds
				round={round}
				totalRounds={totalRounds}
				id={'round-indicator--desktop'}
			/>
			<div className='memory-card-screen'>
				<Progress totalUniqueVisits={totalUniqueVisits} />
				<Rounds
					round={round}
					totalRounds={totalRounds}
					id={'round-indicator--tablet'}
				/>
				<FlagsCollection {...props} />
			</div>
		</div>
	)
}