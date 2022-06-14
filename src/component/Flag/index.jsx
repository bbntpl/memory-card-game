import './styles.css';

export default function Flag(props) {
	const {
		flagImage,
		flagData,
		handleVisitCountry,
		endRound,
		isCountryRevisited,
		toggleRestartModal
	} = props;
	const { country, code } = flagData;

	const handleClick = () => {
		if (isCountryRevisited(code)) {
			toggleRestartModal();
		} else {
			endRound();
			handleVisitCountry(flagData);
		}
	}
	return (
		<div className='country-card' onClick={handleClick}>
			<div className='country-img-wrapper'>
				<img className='country-img' src={flagImage} alt={country} />
			</div>
			<p className='country-name'>{country}</p>
		</div>
	)
}