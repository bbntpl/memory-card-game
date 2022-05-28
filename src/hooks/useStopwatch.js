import { useCallback, useEffect, useState } from 'react';

export default function useStopwatch(maxMilliseconds = 10000) {
	const [isActive, setIsActive] = useState(false);
	const [time, setTime] = useState(0);

	const toggleStopwatch = useCallback((initialState, resetTime = false) => {
		setIsActive(isActive => initialState || !isActive);
		if (resetTime) {
			setTime(0);
		}
	}, []);

	//automatically stop the time when the toggle callback is called
	useEffect(() => {
		let interval;
		if (isActive) {
			interval = setInterval(() => {
				setTime((time) => time + 10);
			}, 10);
		} else {
			clearInterval(interval);
		}
		return () => {
			clearInterval(interval);
		};
	}, [isActive]);

	useEffect(() => {
		if (time >= maxMilliseconds) {
			toggleStopwatch(false);
		}
	}, [time])

	return [time, toggleStopwatch]
}