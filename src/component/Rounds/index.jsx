import './styles.css';

export default function Rounds({ round, id }) {
	return (
		<div className='round-indicator' id={id}>
			<p>{`${round}/247`}</p>
		</div>
	)
}