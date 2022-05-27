import './styles.css';

export default function Progress(props) {
	const { totalUniqueVisits, totalRounds } = props;
	const { current } = totalUniqueVisits;
	const roundedUniqueVisitsPercentage =
		`${Math.floor((current / totalRounds) * 100)}%`
	return (
		<div className='progress-bar'>
			<div
				className='progress-bar__background'
				style={{ width: roundedUniqueVisitsPercentage }}
			>
			</div>
			<div className='progress-bar__overlay'>
				{`${roundedUniqueVisitsPercentage}(
					${current}/${totalRounds})`}
			</div>
		</div>
	)
}