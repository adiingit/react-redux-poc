import {AppBar} from './AppBar'

describe('<AppBar> - Component Test',()=>{
	it('tests if component has a toolbar',()=>{
		
		let appBar = shallow(<AppBar/>);

		expect(appBar.find('Toolbar')).to.have.length(1);
	});
});