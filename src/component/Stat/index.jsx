import './styles.css'

export default function Stat(props) {
	const { best, current, text } = props;
	return (
		<div className='stat-wrapper'>
			<p className='stat__subject'>{text}</p>
			<dl className='stat-data-wrapper'>
				<div>
					<dt className='stat-data__label'>Best</dt>
					<dd className='stat-data__num'>{best}</dd>
				</div>
				<span>
					<dt className='stat-data__label'>Current</dt>
					<dd className='stat-data__num'>{current}</dd>
				</span>
			</dl>
		</div>
	)
}