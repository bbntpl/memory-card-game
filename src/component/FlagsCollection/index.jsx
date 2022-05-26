import { useEffect, useState } from 'react';
import levelCompositionJson from '../../data/level-composition.json';
import Spinner from '../../assets/icons/Spinner-1s-200px.gif';
import Flag from '../Flag';
import './styles.css';

function RenderFlags({ flags, getFlagImage }) {
	return [...flags].forEach((flag, i) => {
		const { code } = flag;
		const flagSvg = getFlagImage({ code });
		return (<Flag
			key={`${i}--code`}
			flagImage={flagSvg}
			flagData={flag}
		/>)
	});
}

export default function FlagsCollection(props) {
	const {
		totalUniqueVisits,
		countries,
		visitedCountries
	} = props;
	const [currentLevel, setCurrentLevel] = useState(1);
	const levelComposition = levelCompositionJson;
	const [flagsForCurrentRound, setFlagsForCurrentRound] = useState([]);

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
			return numOfVisitedCountries;
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

	function shuffleArray(originalArr) {
		const copiedArr = [...originalArr];
		copiedArr.sort(() => 0.5 - Math.random());
		console.log(copiedArr);
		//
		return copiedArr;
	}

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
	console.log(flagsForCurrentRound);

	useEffect(() => {
		const flags = displayFlags();
		setFlagsForCurrentRound(flags);
		console.log(flags);
	}, []);

	// In every round, compare the level composition to the
	// accumulated rounds to confirm whether the memory 
	// game must advance to the next level
	useEffect(() => {
		const round = totalUniqueVisits + 1;

		// accumulated rounds from first level to the current level
		const totalRoundsByCurrentLevel = (currentLevel) => {
			return Object.values(levelComposition)
				.reduce((accumulatedRounds, levelObj, level) => {
					if (currentLevel <= level + 1) {
						return accumulatedRounds + levelObj.totalRounds;
					}
					return accumulatedRounds;
				}, 0);
		}

		if (totalRoundsByCurrentLevel(currentLevel) > round) {
			setCurrentLevel(currentLevel => currentLevel + 1);
		}
	}, [totalUniqueVisits, levelComposition, currentLevel]);

	return (
		<div className='flags-container'>
			{
				// making sure the flags contains defined data and not empty
				flagsForCurrentRound.every(f => typeof f !== 'undefined')
					&& flagsForCurrentRound.length ?
					<RenderFlags
						flags={flagsForCurrentRound}
						getFlagImage={getFlagImage}
					/> :
					< img src={Spinner} alt='spinner' className='spinner' />
			}
		</div>
	)
}