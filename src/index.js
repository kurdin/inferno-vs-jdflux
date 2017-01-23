import Inferno from 'inferno';
import {App} from './App';
import faker from 'faker';

// import './index.css';
  
// var createClass = require('inferno-create-class');
// var h = require('inferno-hyperscript');

// require('inferno-devtools');
let testData = window.testData;
let Delay = window.clientRenderDelay;

setInterval(function() {
  console.log('rendering inferno app');
  var start = performance.now();
  Inferno.render(
    <App names={testData} />,
    document.getElementById('app')
  );
  var end = performance.now();
  var time = (end - start).toFixed(3) + 'ms';
  console.log(`inferno app start peformance: ${time}`);
  document.getElementById("timeclient").innerHTML = time;
  testData = getNewNames();
}, Delay);


function getNewNames() {
	let testData = [];
	let totalNames = 10000;

	[...Array(totalNames)].forEach((_, i) => {
	  testData.push( 
	  	{first: faker.name.firstName(), last: faker.name.lastName(), suffix: faker.name.suffix()}
	  );
	});
	return testData;
}