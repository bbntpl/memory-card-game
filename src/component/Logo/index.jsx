import ShieldAirplane from '../../assets/icons/shield-airplane.svg';

export default function Logo() {
	const logoTitle = 'CFMC';
	const sloganTxt = 'Travel each country without on visited countries'
	return (
		<div className='logo'>
			<div className='logo__upper'>
				<img
					src={ShieldAirplane}
					alt='logoImage'
					className='logo-image'
				/>
				<h1 className='logo-image'>{logoTitle}</h1>
			</div>
			<p className='logo__slogan'>{sloganTxt}</p>
		</div>
	)
}