import useMountTransition from '../../hooks/useMountTransition';
import './styles.css';

export default function LevelNotification(props) {
	const {
		levelNotificationContent,
		stopTimer
	} = props;
	const {
		totalLevels,
		currentLevel,
		scoreMultiplier,
		difficultyRange,
	} = levelNotificationContent;
	const isMounted = true;
	const hasTransitionedIn = useMountTransition(isMounted, 3000);
	return (
		(hasTransitionedIn || isMounted) &&
		<div
			className={`card-notif--${!hasTransitionedIn ? 'in' : ''}visible`}
			onClick={stopTimer}
		>
			<h2 className='card-notif__header'>{`${currentLevel}/${totalLevels}`}</h2>
			<dl className='bar-datalist'>
				<dt>Score Multiplier: </dt>
				<dd>{scoreMultiplier}x</dd>
			</dl>
			<dl className='card-notif__datalist'>
				<dt>Difficulty: </dt>
				<dd>
					{
						Array.isArray(difficultyRange)
							? `${difficultyRange[1]}% - ${difficultyRange[0]}%`
							: `${difficultyRange}%`
					}
				</dd>
			</dl>
		</div>
	)
}