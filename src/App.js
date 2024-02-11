import { useState, useEffect } from 'react';
import {
	getItemFromLocal,
	updateLocalStorage
} from './scripts/local-storage';
import './App.css';

//components
import Header from './component/Header';
import Main from './component/Main';
import Modal from './component/Modal';

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


	const modifyCurrentScore = (scoreGainedInARound) => {
		setScore(score => ({
			...score,
			current: score.current + scoreGainedInARound
		}));
	}

	const modifyBestScore = (bestScore) => {
		setScore(score => ({ ...score, best: bestScore }));
	}

	const modifyScores = (scoreGainedInARound) => {
		const { best, current } = score;
		const modifiedScore = current + scoreGainedInARound;
		if (best < modifiedScore) {
			updateLocalStorage('bestScore', modifiedScore);
			modifyBestScore(modifiedScore);
			modifyCurrentScore(scoreGainedInARound);
			return;
		}
		modifyCurrentScore(scoreGainedInARound);
	}

	const modifyVisitedCountries = (latestVisitedCountryArr) => {
		const newVisitedCountriesArr = (visitedCountries) =>
			visitedCountries.concat(latestVisitedCountryArr);
		setVisitedCountries(visitedCountries =>
			newVisitedCountriesArr(visitedCountries)
		);
	}

	const toggleRestartModal = () => {
		setIsGameStart(isGameStart => !isGameStart);
	}

	const handleVisitCountry = (flagData) => {
		const { code } = flagData;

		// otherwise move the chosen country to the visited countires array
		const newUnvisitedCountries = (countries) => countries.filter((flags) => {
			return flags.code !== code;
		});
		setCountries(countries => newUnvisitedCountries(countries));
		modifyVisitedCountries(flagData);
	};


	// extract json to create an array with flag objects
	useEffect(() => {
		const countryFlags = jsonToArr(countryFlagsJson);
		setCountries(countryFlags);
	}, []);

	// resetting states after game restart
	useEffect(() => {
		if (isGameStart) return;

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
	}, [isGameStart])

	useEffect(() => {
		const { best } = totalUniqueVisits;

		const modifyBestTotalUniqueVisits = (currentTotalUniqueVisits) => {
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
			modifyBestTotalUniqueVisits(visitedCountries.length);
			return;
		}

		setTotalUniqueVisits(totalUniqueVisits => ({
			...totalUniqueVisits,
			current: visitedCountries.length
		}));
	}, [visitedCountries]);

	const mainComponentProps = {
		modifyScores,
		handleVisitCountry,
		toggleRestartModal,
		countries,
		visitedCountries,
		totalRounds: TOTAL_ROUNDS,
		totalUniqueVisits,
		isGameStart
	};

	return (
		<div className="App">
			<Header
				score={score}
				totalUniqueVisits={totalUniqueVisits}
			/>
			<Main {...mainComponentProps} />
			{(!isGameStart && totalUniqueVisits.current !== TOTAL_ROUNDS)
				&& <Modal
					score={score}
					totalUniqueVisits={totalUniqueVisits}
					toggleRestartModal={toggleRestartModal}
				/>}
			{(!isGameStart && totalUniqueVisits.current === TOTAL_ROUNDS)
				&& <Modal
					primaryMessage={CONGRATS_MSG}
					toggleRestartModal={toggleRestartModal}
				/>}
			<footer className='footer'>
				<a href='https://github.com/bbntpl'>
					{`B.B. Antipolo ${CURRENT_YEAR}`}
				</a>
			</footer>
		</div>
	);
}

export default App;
