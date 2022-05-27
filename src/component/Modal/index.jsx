import { useMemo } from 'react';
import Logo from '../Logo';
import './styles.css';

const MemoizedStat = ({ label, value }) => useMemo(() => {
	return (
		<dl>
			<dt>{label}</dt>
			<dd>{value}</dd>
		</dl>
	)
}, [])
export default function RestartModal(props) {
	const {
		score,
		totalUniqueVisits,
		toggleRestartModal,
		primaryMessage = null
	} = props;

	return (
		<div className='screen-overlay'>
			<div className='restart-modal'>
				<Logo toggleSlogan={false} />
				{
					primaryMessage
						? <div className='primary-msg'>{primaryMessage}</div>
						: <div className='restart-modal__stats'>
							<MemoizedStat label={'Score'} value={score.current} />
							<MemoizedStat
								label={'Unique Visits'}
								value={totalUniqueVisits.current}
							/>
						</div>
				}
				<button
					className='restart-modal__button'
					onClick={toggleRestartModal}
				>Restart</button>
			</div>
		</div>
	)
}