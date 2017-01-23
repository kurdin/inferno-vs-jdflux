/*globals $$, __DEV__*/

const dust = require('dust');
const $$ = require('jdflux');
const faker = require('faker');

if (__DEV__) {
	dust.config.whitespace = true;
} else {
	dust.config.whitespace = false;
}

$$.config({
	dust: dust,
	baseUrl: '/jdflux' // for push state if used
});

let Delay = window.clientRenderDelay;
let testData = window.testData;

var BasicComponent = require('./component');

setInterval(function() {
	console.log('rendering jdflux app');
	var start = performance.now();
	// $$.render(BasicComponent({testData: testData}), '#app', 'bootstrap');
	$$.render(BasicComponent({testData: testData}), '#app');
	var end = performance.now();
	var time = (end - start).toFixed(3) + 'ms';
	console.log(`jdflux app start peformance: ${time}`);
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