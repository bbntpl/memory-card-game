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
		best: 0 || Number(getItemFromLocal('bestScore')),
		current: 0
	});
	const [totalUniqueVisits, setTotalUniqueVisits] = useState({
		best: 0 || Number(getItemFromLocal('bestTotalUniqueVisits')),
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
	}

	// extract json to create an array with flag objects
	useEffect(() => {
		const countryFlags = jsonToArr(countryFlagsJson);
		setCountries(countryFlags);
	}, []);

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
		console.log(best, visitedCountries.length);
		if (best < visitedCountries.length) {
			updateBestTotalUniqueVisits(visitedCountries.length);
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
