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
			setState(state => ({ ...state, timeout: null }));
		}
		if (isTimerRunning) {
			const timer = setTimeout(() => {
				setTimer();
			}, milliseconds);
			setState(state => ({ ...state, timeout: timer }));
			return () => {
				clearTimeout(timer);
			};
		}
	}, [state.isTimerRunning]);

	return [isTimerRunning, setTimer];
}