import './styles.css';

export default function Flag(props) {
	const {
		flagImage,
		flagData,
		countryStatusToVisited,
		endRound
	} = props;
	const { country } = flagData;
	return (
		<div 
		className='country-card' 
		onClick={() => 
			{
				const wasCountryVisited = countryStatusToVisited(flagData);
				!wasCountryVisited && endRound();
			}}
		>
			<div className='country-img-wrapper'>
				<img
					className='country-img'
					src={flagImage}
					alt={country}
				/>
			</div>
			<p className='country-name'>{country}</p>
		</div>
	)
}