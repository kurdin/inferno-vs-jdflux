require('./config/jsx-require');
const express = require('express');
const faker = require('faker');
var dust = require('dustjs-helpers');

const app = express();

app.set('view engine', 'pug')
app.use(express.static('public'));

var $$ = require('jdflux')(dust, app);
console.time('include jsx');
const App = require('./src/App.server.jsx');
console.timeEnd('include jsx');
const AppJdflux = require('./src/jdflux/component');

let totalNames = 10000;

app.get('/', function (req, res) {
	res.render('home');	
})

app.get('/:lib', function (req, res) {
	let lib = req.params.lib;
	if (lib !== 'jdflux' && lib !== 'inferno' && lib !== 'angular2') return;
	let testData = [];

	[...Array(totalNames)].forEach((_, i) => {
	  testData.push( 
	  	{first: faker.name.firstName(), last: faker.name.lastName(), suffix: faker.name.suffix()}
	  );
	});

	let noSSR = req.query.noSSR === '' ? true : false; 
	let clientRenderDelay = req.query.clientRenderDelay ? req.query.clientRenderDelay : 0; 
	let startSSR = new Date();	
	let AppHTML = noSSR ? '' : lib == 'jdflux' ? $$.render({ component: AppJdflux({testData:testData}), cacheId: 'AppJdflux' + Date.now() }) : App({names: testData});

	if (AppHTML) {
		console.log(AppHTML);
		console.log(`Above output of SSR ${lib} app`);
	}

	let timeSSR = new Date() - startSSR;

	// console.log(AppHTML);
	res.render('index', { AppHTML: AppHTML, testData: testData, lib: lib, timeSSR: timeSSR, clientRenderDelay:clientRenderDelay});
})

app.listen(3000, function() {
  console.log('listening on 3000 express');
})