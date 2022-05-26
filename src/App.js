import { useState, useEffect } from 'react';
import './App.css';
import {
	getItemFromLocal,
	updateLocalStorage
} from './scripts/local-storage';

//components
import Header from './component/Header';
import Main from './component/Main';

import countryFlagsJson from './data/ISO3166-1.alpha2.json';
function App() {
	const [countries, setCountries] = useState([]);
	const [visitedCountries, setVisitedCountries] = useState([])
	const [score, setScore] = useState({
		best: 0 || getItemFromLocal('bestScore'),
		current: 0
	});
	const [totalUniqueVisits, setTotalUniqueVisits] = useState({
		prev: 0 || getItemFromLocal('prevTotalVisitedCountries'),
		current: visitedCountries.length
	});
	const totalRounds = Object.keys(countryFlagsJson).length;
	const currentYear = new Date().getFullYear();

	// methods that changes the states above
	const jsonToArr = (jsonObj) => {
		return Object.entries(jsonObj)
			.map((country) => ({
				code: country[0],
				country: country[1]
			}));
	}

	// const resetStates = () => {
	// 	setCountries(jsonToArr(countryFlagsJson));
	// 	setVisitedCountries([]);
	// 	setScore({
	// 		best: 0 || getItemFromLocal('bestScore'),
	// 		current: 0
	// 	});
	// 	setTotalUniqueVisits({
	// 		best: 0 || getItemFromLocal('bestTotalUniqueVisits'),
	// 		current: 0
	// 	});
	// }

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
		const newVisitedCountriesArr =
			visitedCountries.concat(latestVisitedCountryArr);
		setVisitedCountries(visitedCountries => ({
			...visitedCountries, newVisitedCountriesArr
		}));
	}

	const countryStatusToVisited = (flagData) => {
		const { code } = flagData;
		const newUnvisitedCountries = countries.filter((flags) => {
			return flags.code !== code;
		});
		setCountries(countries => ({ ...countries, newUnvisitedCountries }));
		updateVisitedCountries(flagData);
	}
	// extract json to create an array with flag objects
	useEffect(() => {
		const countryFlags = jsonToArr(countryFlagsJson);
		setCountries(countryFlags);
	}, []);

	useEffect(() => {
		const { best, current } = totalUniqueVisits;
		
		const updateBestTotalUniqueVisits = (currentTotalUniqueVisits) => {
			updateLocalStorage(
				'bestTotalUniqueVisits',
				currentTotalUniqueVisits
			);
			updateBestScore(currentTotalUniqueVisits);
			setScore(totalUniqueVisits => ({
				...totalUniqueVisits,
				best: currentTotalUniqueVisits,
				current: currentTotalUniqueVisits
			}));
		}

		if (best < visitedCountries.length) {
			updateBestTotalUniqueVisits(current);
		} else {
			setTotalUniqueVisits(totalUniqueVisits => ({
				...totalUniqueVisits,
				current: visitedCountries.length
			}));
		}
	}, [visitedCountries]);

	const mainComponentProps = {
		updateScores,
		updateVisitedCountries,
		countryStatusToVisited,
		countries,
		visitedCountries,
		totalRounds,
		totalUniqueVisits
	};
	return (
		<div className="App">
			<Header
				score={score}
				totalUniqueVisits={totalUniqueVisits}
			/>
			<Main {...mainComponentProps} />
			<footer className='footer'>
				<a href='https://github.com/bvrbryn445'>
					{`B.B. Antipolo ${currentYear}`}
				</a>
			</footer>
		</div>
	);
}

export default App;
