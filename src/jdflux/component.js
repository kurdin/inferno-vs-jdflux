/*globals $$*/

/*Basic Compoment*/

// var HelloComponent = require('./hello');
$$.templates.load('template-main', require('./template-main.dust'));
$$.templates.load('template-hello', require('./template-hello.dust'));

module.exports = $$.component({

	component: {
		name: 'Main Component'
		// type: 'static',
		// ,type: 'self_updated'
		,renderType: 'replace'
	},

	// components: {
	// 	helloComponent: HelloComponent
	// },

	init: function () {
		this.names = this.props.testData;
	},

	render: function () {
		return this.dust_render('template-main')(this);
	}
});