import { useCallback, useEffect, useState } from 'react';


export default function useTimer(milliseconds = 5000) {
	const [state, setState] = useState({
		timer: null,
		isTimerRunning: false
	});
	const isTimerRunning = state.isTimerRunning;
	const setTimer = useCallback((initialToggle) => {
		setState(state => ({ ...state, isTimerRunning: initialToggle || false }))
	}, []);

	useEffect(() => {
		const { timer } = state;
		if (isTimerRunning && timer) {
			window.clearTimeout(timer);
			setState(state => ({ ...state, timer }));
		}
		if (isTimerRunning) {
			const timer = setTimeout(() => {
				setTimer();
			}, milliseconds);
			setState(state => ({ ...state, timer }));
			return () => {
				clearTimeout(timer);
			};
		}
	}, [isTimerRunning]);

	return [isTimerRunning, setTimer];
}