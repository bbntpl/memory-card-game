export default function Flag(props) {
	const {
		flagImage,
		flagData,
		countryStatusToVisited
	} = props;
	const { country } = flagData;
	return (
		<div 
		className='country-card' 
		onClick={() => countryStatusToVisited(flagData)}
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