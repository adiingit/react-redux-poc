import React from 'react';
import { shallowWithContext,mountWithContext,renderWithContext } from '../../../src/utils/testing';
import Sensor from '../../../src/components/Machine/Sensor';

describe('Testing <Sensor />', () => {

	describe('With default props',() =>{
		let wrapper;
		beforeEach(()=>{
			const updateFunction = sinon.spy();
		  	const sensorComponent = <Sensor 
		              id={String(1)}
		              width={200}
		              height={200}
		              updateUrl={'sampleUrl'}
		              location={{x:100,y:100}}
		              label={'sensor'}
		              update={updateFunction}
		              updateFreq={10}/> ;
		   	wrapper = mountWithContext(sensorComponent);
		});
		it('renders a sensor - checks for RaisedButton and Popover display', () => {
		    expect(wrapper.find('RaisedButton')).to.have.length(1);
		    expect(wrapper.find('Popover > div').exists()).to.be.false;
	  	});
	  	it('renders a sensor - default onTouchStart called on sensor click and sets empty Popover', () => {
	  		wrapper.simulate('click');
	  		expect(wrapper.prop('onTouchStart')).to.have.been.called;
		    expect(wrapper.find('Popover').text()).to.be.equal('');
	  	});
	  	it('renders a sensor - sensor should be by default in idle state',()=>{
	  		expect(wrapper.prop('idle')).to.be.true;
	  	});
	  	it('renders a sensor - update function should be called at updateFreq',()=>{
	  		const clock = sinon.useFakeTimers();
	  		clock.tick(wrapper.prop('updateFreq')*1000);
	  		expect(wrapper.prop('update').withArgs(wrapper.prop('updateUrl'))).to.be.called;
	  		clock.restore();
	  	});
	  	it('renders a sensor - sensor should have the default color',()=>{
	  		expect(wrapper.prop('color')).to.be.equal(wrapper.find('RaisedButton').prop('backgroundColor'));
	  	});
	});

	describe('With Ok status',() =>{
		let wrapper;
		beforeEach(()=>{
			const updateFunction = sinon.spy();
			const onTouchStart = sinon.spy();
			const onTouchEnd = sinon.spy();
		  	const sensorComponent = <Sensor 
		              id={String(1)}
		              width={200}
		              height={200}
		              updateUrl={'sampleUrl'}
		              location={{x:100,y:100}}
		              label={'sensor'}
		              update={updateFunction}
		              updateFreq={10}
		              idle={false}
		              status={true}
		              color={'#0f0'}
		              onTouchStart={onTouchStart}
		              onTouchEnd={onTouchEnd}/> ;
		   	wrapper = mountWithContext(sensorComponent);

		   	
		});


		it('renders a sensor - checks for color of Sensor in Ok state', () => {
			expect(wrapper.prop('color')).to.be.equal(wrapper.find('RaisedButton').prop('backgroundColor'));
	  	});
	  	it('renders a sensor - Popover does appear on sensor click', () => {
	  		wrapper.simulate('click');
	  		expect(wrapper.prop('onTouchStart').withArgs(wrapper.prop('id'))).to.have.been.called;
	  		wrapper.setProps({sensorDisplay:true});
		    expect(wrapper.find('Popover').prop('open')).to.be.true;
	  	});
	});

	describe('With Error status',() =>{
		let wrapper;
		beforeEach(()=>{
			const updateFunction = sinon.spy();
			const onTouchStart = sinon.spy();
		  	const sensorComponent = <Sensor 
		              id={String(1)}
		              width={200}
		              height={200}
		              updateUrl={'sampleUrl'}
		              location={{x:100,y:100}}
		              label={'sensor'}
		              update={updateFunction}
		              updateFreq={10}
		              idle={false}
		              status={false}
		              color={'#f00'}
		              onTouchStart={onTouchStart}/> ;
		   	wrapper = mountWithContext(sensorComponent);
		});
		it('renders a sensor - checks for color of Sensor in Error state', () => {
			expect(wrapper.prop('color')).to.be.equal(wrapper.find('RaisedButton').prop('backgroundColor'));
	  	});
	  	it('renders a sensor - Popover does appear on sensor click', () => {
	  		wrapper.simulate('click');
	  		expect(wrapper.prop('onTouchStart').withArgs(wrapper.prop('id'))).to.have.been.called;
	  		wrapper.setProps({sensorDisplay:false});
		    expect(wrapper.find('Popover').prop('open')).to.be.false;
	  	});
	});
});