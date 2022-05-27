import { useCallback, useEffect, useState } from 'react';


export default function useTimedComponent(seconds = 5) {
	const [isTimerRunning, setTimer] = useState(false);
	const stopTimer = useCallback(() => setTimer(false), []);

	useEffect(() => {
		if(isTimerRunning) {
			setTimeout(() => {
				stopTimer()
			}, (seconds * 1000));
		}
	}, [timer]);

	return [isTimerRunning, setTimer];
}