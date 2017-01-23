const Inferno = require('inferno');
const InfernoServer = require('inferno-server');
import Component from 'inferno-component';
const App = require('./App.jsx').App;

module.exports = (props) => { 
	return  InfernoServer.renderToString(<App names={props.names} isServer={true} />);
}