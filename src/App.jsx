import Inferno from '../lib/inferno';
import Component from 'inferno-component';
import h from 'inferno-hyperscript';

class Name extends Component {

render({name}) {
    return (
      <li>
        <span>{name.first}</span> <span>{name.last}</span> <span>{name.suffix}</span>
      </li>
      );
  }
}

class App extends Component {

  render({names}) {
    return ( 
      <div>
        Saying Hello to <b>{names.length}</b> names: 
        <ul>
        {
          names.map(
            (name) => (
              <Name name={name}/>
          ))
        }          
        </ul>
      </div>
    )
  }
}

class NameHSrcipt extends Component {

render({name}) {
  return h('li', [h('span', [name.first]), ' ', h('span', [name.last]), ' ', h('span', [name.suffix])]);
  }
}

class AppHSrcipt extends Component {

  render({names}) {
    return h('div', [
      'Saying Hello to', ' ' , h('b', [names.length]), ' ', 'names:',
      h('ul', [ names.map( (name) => { return h(NameHSrcipt, {name:name}) })])
    ]);
  }
}

module.exports = {
  AppHSrcipt: AppHSrcipt,
  AppJSX: App, 
  App: App
};
