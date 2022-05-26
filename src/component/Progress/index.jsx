import './styles.css';

export default function Progress() {
	return (
		<div className='progress-bar'>
			<div className='progress-bar__percentage'></div>
			<div className='progress-bar__overlay'></div>
			{/* <img 
			className='progress_bg-img' 
			/> */}
		</div>
	)
}