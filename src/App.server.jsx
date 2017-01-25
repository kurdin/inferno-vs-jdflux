import Inferno from '../lib/inferno';
import {renderToString} from 'inferno-server';
import Component from 'inferno-component';
import {App} from './App.jsx';

Inferno.options.noSSRNormalizeEnabled = true;

module.exports = (props) => { 
	return  renderToString(<App names={props.names} isServer={true} />);
}