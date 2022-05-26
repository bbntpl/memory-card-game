import ShieldAirplane from '../../assets/icons/shield-airplane.svg';
import './styles.css';

export default function Logo() {
	const logoTitle = 'CFMC';
	const sloganTxt = 'Travel each country without landing on visited countries'
	return (
		<div className='logo'>
			<div className='logo__upper'>
				<img
					src={ShieldAirplane}
					alt='logoImage'
					className='logo-image'
				/>
				<h1 className='logo-title'>{logoTitle}</h1>
			</div>
			<p className='logo-slogan'>{sloganTxt}</p>
		</div>
	)
}