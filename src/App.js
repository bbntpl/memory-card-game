// import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';

//components
import Header from './component/Header';
import Link from './component/Link';

import countryFlags from './data/ISO3166-1.alpha2.json';
console.log(countryFlags);

function App() {
	// const [countries, setCountries] = useState([]);
	// const [visitedCountries, setVisitedCountries] = useState([])
	// const [score, setScore] = useState({
	// 	best: 0,
	// 	current: 0
	// });
	// const [totalVisitedCountries, setTotalVisitedCountries] = useState({
	// 	prev: 0,
	// 	current: 0
	// });

	useEffect(() => {

	}, []);
  return (
    <div className="App">
			<Header	/>
			<Link page={'github.com/bvrbryn445'}></Link>
    </div>
  );
}

export default App;
