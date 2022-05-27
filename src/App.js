import { useState, useEffect, useMemo } from 'react';
import {
	getItemFromLocal,
	updateLocalStorage
} from './scripts/local-storage';
import './App.css';

//components
import Header from './component/Header';
import Main from './component/Main';
import RestartModal from './component/Modal';

import countryFlagsJson from './data/ISO3166-1.alpha2.json';

function App() {
	const [countries, setCountries] = useState([]);
	const [visitedCountries, setVisitedCountries] = useState([])
	const [score, setScore] = useState({
		best: Number(getItemFromLocal('bestScore')) || 0,
		current: 0
	});
	const [totalUniqueVisits, setTotalUniqueVisits] = useState({
		best: Number(getItemFromLocal('bestTotalUniqueVisits')) || 0,
		current: visitedCountries.length
	});
	const [isGameStart, setIsGameStart] = useState(true);

	// constant variables
	const TOTAL_ROUNDS = Object.keys(countryFlagsJson).length;
	const CONGRATS_MSG = `Congrats! You have achieved your goal. You 
		may exit the website unless you are determined to waste your precious time 
		once again by clicking the restart button.`
	const CURRENT_YEAR = new Date().getFullYear();

	// methods that changes the states above
	const jsonToArr = (jsonObj) => {
		return Object.entries(jsonObj)
			.map((country) => ({
				code: country[0],
				country: country[1]
			}));
	}
	const resetStates = () => {
		setCountries(jsonToArr(countryFlagsJson));
		setVisitedCountries([]);
		setScore({
			best: getItemFromLocal('bestScore') || 0,
			current: 0
		});
		setTotalUniqueVisits({
			best: getItemFromLocal('bestTotalUniqueVisits') || 0,
			current: 0
		});
	}

	const updateCurrentScore = (scoreGainedInARound) => {
		setScore(score => ({
			...score,
			current: score.current + scoreGainedInARound
		}));
	}

	const updateBestScore = (bestScore) => {
		setScore(score => ({ ...score, best: bestScore }));
	}

	const updateScores = (scoreGainedInARound) => {
		const { best, current } = score;
		const updatedScore = current + scoreGainedInARound;
		if (best < updatedScore) {
			updateLocalStorage('bestScore', current);
			updateBestScore(updatedScore);
			updateCurrentScore(scoreGainedInARound)
			return;
		}
		updateCurrentScore(scoreGainedInARound);
	}

	const updateVisitedCountries = (latestVisitedCountryArr) => {
		const newVisitedCountriesArr = (visitedCountries) =>
			visitedCountries.concat(latestVisitedCountryArr);
		setVisitedCountries(visitedCountries =>
			newVisitedCountriesArr(visitedCountries)
		);
	}

	const countryStatusToVisited = (flagData) => {
		const { code } = flagData;

		const newUnvisitedCountries = (countries) => countries.filter((flags) => {
			return flags.code !== code;
		});
		setCountries(countries => newUnvisitedCountries(countries));
		updateVisitedCountries(flagData);

		// check whether the chose country was visited before
		// then reset every states to restart the memory game
		if (isCountryRevisited(code)) {
			toggleRestartModal();
		}
	}

	const isCountryRevisited = (code) => {
		return visitedCountries.some(flag => flag.code === code);
	}

	const toggleRestartModal = () => {
		setIsGameStart(isGameStart => !isGameStart);
	}

	// extract json to create an array with flag objects
	useEffect(() => {
		const countryFlags = jsonToArr(countryFlagsJson);
		setCountries(countryFlags);
	}, []);

	useEffect(() => {
		if (isGameStart) return;
		resetStates();
	}, [isGameStart])

	useEffect(() => {
		const { best } = totalUniqueVisits;

		const updateBestTotalUniqueVisits = (currentTotalUniqueVisits) => {
			updateLocalStorage(
				'bestTotalUniqueVisits',
				currentTotalUniqueVisits
			);
			setTotalUniqueVisits(totalUniqueVisits => ({
				...totalUniqueVisits,
				best: currentTotalUniqueVisits,
				current: currentTotalUniqueVisits
			}));
		}

		if (best < visitedCountries.length) {
			updateBestTotalUniqueVisits(visitedCountries.length);
			return;
		}
		console.log(visitedCountries.length);
		setTotalUniqueVisits(totalUniqueVisits => ({
			...totalUniqueVisits,
			current: visitedCountries.length
		}));
	}, [visitedCountries]);

	const mainComponentProps = {
		updateScores,
		updateVisitedCountries,
		countryStatusToVisited,
		countries,
		visitedCountries,
		totalRounds: TOTAL_ROUNDS,
		totalUniqueVisits
	};

	return (
		<div className="App">
			<Header
				score={score}
				totalUniqueVisits={totalUniqueVisits}
			/>
			<Main {...mainComponentProps} />
			{(!isGameStart && totalUniqueVisits.current !== TOTAL_ROUNDS)
				&& <RestartModal
					score={score}
					totalUniqueVisits={totalUniqueVisits}
					toggleRestartModal={toggleRestartModal}
				/>}
			{(!isGameStart && totalUniqueVisits.current === TOTAL_ROUNDS)
				&& <RestartModal
					primaryMessage={CONGRATS_MSG}
					toggleRestartModal={toggleRestartModal}
				/>}
			<footer className='footer'>
				<a href='https://github.com/bvrbryn445'>
					{`B.B. Antipolo ${CURRENT_YEAR}`}
				</a>
			</footer>
		</div>
	);
}

export default App;
