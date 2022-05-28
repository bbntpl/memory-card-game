import { useCallback, useEffect, useState, useMemo } from 'react';
import useTimer from '../../hooks/useTimer';
import Flag from '../Flag';
import LevelNotification from '../LevelNotification';
import levelComposition from '../../data/level-composition.json';
import Spinner from '../../assets/icons/Spinner-1s-200px.gif';
import './styles.css';
import useStopwatch from '../../hooks/useStopwatch';

function RenderFlags(props) {
	const {
		flags,
		getFlagImage,
		countryStatusToVisited,
		endRound
	} = props
	return [...flags].map((flag, i) => {
		const { code } = flag;
		const flagSvg = getFlagImage({ code });
		return <Flag
			key={`${i}--code`}
			flagImage={flagSvg}
			flagData={flag}
			countryStatusToVisited={countryStatusToVisited}
			endRound={endRound}
		/>
	});
}

export default function FlagsCollection(props) {
	const {
		totalUniqueVisits,
		countries,
		visitedCountries,
		countryStatusToVisited,
		isGameStart,
		modifyScores
	} = props;
	const [currentLevel, setCurrentLevel] = useState(1);
	const [flagsForCurrentRound, setFlagsForCurrentRound] = useState([]);
	const [isTimerRunning, setTimer] = useTimer(5000);
	const [time, toggleStopWatch] = useStopwatch();

	const stopTimer = useCallback(() => setTimer(), []);

	const TOTAL_LEVELS = Object.keys(levelComposition).length;
	const levelNotificationProps = useMemo(() => {
		const {
			scoreMultiplier,
			unvisitedCountries,
			totalFlags
		} = levelComposition[String(currentLevel)];
		const getLevelDifficulty = (unvisitedCountries) => {
			if (Array.isArray(unvisitedCountries)) {
				return Array.from({ length: unvisitedCountries.length },
					(_, index) => {
						const numOfCountries = unvisitedCountries[index];
						const visitedCountries = totalFlags - numOfCountries;
						const unroundedLvlDiff = (visitedCountries / totalFlags) * 100;
						const roundedLvlDiff = Math.round(unroundedLvlDiff);
						return roundedLvlDiff;
					});
			}
			return unvisitedCountries;
		}
		return {
			currentLevel,
			totalLevels: TOTAL_LEVELS,
			scoreMultiplier,
			difficultyRange: getLevelDifficulty(unvisitedCountries)
		}
	}, [currentLevel]);

	function getFlagImage({ fileType = 'svg', code }) {
		return `https://countryflagsapi.com/${fileType}/${code}`;
	}

	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	function randomIndexFromArr(arr) {
		return arr.indexOf(arr[arr.length * Math.random() | 0]);
	}

	function minNumOfCountries(props) {
		const {
			totalFlags,
			numOfUnvisitedCountries,
			numOfVisitedCountries
		} = props;
		if (totalFlags - numOfUnvisitedCountries > numOfVisitedCountries) {
			return totalFlags - numOfVisitedCountries;
		} else {
			return numOfUnvisitedCountries;
		}
	}

	function maxNumOfCountries(props) {
		const { numOfUnvisitedCountries, minNumOfCountires } = props;
		if (minNumOfCountires > numOfUnvisitedCountries) {
			return minNumOfCountires;
		} else {
			return numOfUnvisitedCountries;
		}
	}

	function collectItemsFromArray({ numOfItems, array }) {
		const newArray = [];
		const passedArray = [].concat(array);
		for (let i = 0; i < numOfItems; i++) {
			const collectedItemIndex = randomIndexFromArr(passedArray);
			const collectedItem = passedArray.splice(collectedItemIndex, 1);
			newArray.push(...collectedItem);
		}
		return newArray;
	}

	const shuffleArray = (originalArr) => [...originalArr].sort(() => 0.5 - Math.random());

	// pick random flags from both (un)visited countries
	// to be displayed for the user to choose on
	function displayFlags() {
		const currentLvlObj = levelComposition[String(currentLevel)];
		const { totalFlags, unvisitedCountries } = currentLvlObj;
		const visitedCountriesLen = visitedCountries.length;
		const minRandomNumber = minNumOfCountries({
			totalFlags,
			numOfUnvisitedCountries: unvisitedCountries[0] || unvisitedCountries,
			numOfVisitedCountries: visitedCountriesLen
		});
		const maxRandomNumber = maxNumOfCountries({
			numOfUnvisitedCountries: unvisitedCountries[1],
			minNumOfCountries: minRandomNumber
		});

		// get the number of unvisited countries between
		// the available min/max range 
		const numOfCountries = Array.isArray(unvisitedCountries)
			? randomNumber(minRandomNumber, maxRandomNumber)
			: unvisitedCountries;
		const numOfVisitedCountries = totalFlags - numOfCountries;
		const countriesFlags = collectItemsFromArray({
			numOfItems: numOfCountries,
			array: countries
		});
		const visitedCountriesFlags = collectItemsFromArray({
			numOfItems: numOfVisitedCountries,
			array: visitedCountries
		});
		return shuffleArray(countriesFlags.concat(visitedCountriesFlags));
	}

	const calculateRoundScore = (time) => {
		const { scoreMultiplier } = levelComposition[String(currentLevel)];
		const maxMilliseconds = 10000;
		const round = visitedCountries.length + 1;
		const scoreReduction = (maxMilliseconds - time) / maxMilliseconds;
		const defaultScorePerRound = round * 10;
		return Math.round((defaultScorePerRound * scoreReduction) * scoreMultiplier);
	}

	const restartStopWatch = () => {
		toggleStopWatch(false, true);
		toggleStopWatch(true, false);
	}

	const endRound = () => {
		restartStopWatch();
		modifyScores(calculateRoundScore(time));
	}
	useEffect(() => {
		const flags = displayFlags();
		setFlagsForCurrentRound(flags);
	}, [countries, visitedCountries]);

	// In every round, compare the level composition to the
	// accumulated rounds to confirm whether the memory 
	// game must advance to the next level
	useEffect(() => {
		const currentRound = totalUniqueVisits.current + 1;

		// accumulated rounds from first level to the current level
		const getLevelAndRoundsByCurrentRound = (currentRound) => {
			return Object.values(levelComposition)
				.reduce((accumulatedData, levelObj) => {
					const { totalRounds } = levelObj;
					const { level, rounds } = accumulatedData;
					if (currentRound > rounds) {
						return {
							level: level + 1,
							rounds: rounds + totalRounds
						}
					}
					return accumulatedData;
				}, { level: 0, rounds: 0 });
		}
		const { level, rounds } = getLevelAndRoundsByCurrentRound(currentRound);

		// switch to the next level when the current round 
		// surpasses the rounds for the current level
		if (rounds < currentRound) return;
		setCurrentLevel(level);
	}, [totalUniqueVisits.current]);

	// start the timer once a new level or game started
	useEffect(() => setTimer(true), [currentLevel, isGameStart]);

	useEffect(() => {
		toggleStopWatch(isGameStart ? 1 : 0);
	}, [isGameStart]);

	return (
		<div className='flags-container'>
			{
				// making sure the flags contains defined data and not empty
				flagsForCurrentRound.every(f => typeof f !== 'undefined')
					&& flagsForCurrentRound.length ?
					<RenderFlags
						flags={flagsForCurrentRound}
						getFlagImage={getFlagImage}
						countryStatusToVisited={countryStatusToVisited}
						endRound={endRound}
					/> :
					<img src={Spinner} alt='spinner' className='spinner' />
			}
			{(isTimerRunning && isGameStart) &&
				<LevelNotification
					levelNotificationContent={levelNotificationProps}
					stopTimer={stopTimer}
				/>
			}
		</div>
	)
}