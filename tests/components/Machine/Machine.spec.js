import React from 'react';
import { shallowWithContext,mountWithContext,renderWithContext } from '../../../src/utils/testing';
import Sensor from '../../../src/components/Machine/Sensor';
import Machine from '../../../src/components/Machine/Machine';

describe('Testing <Machine />', () => {

	describe('Without sensors',() =>{
		let wrapper;
		beforeEach(()=>{
			const updateFunction = sinon.spy();
		  	const machineComponent = <Machine 
								      image={'abc.png'}
								      sensors={[]}/>
      		
		   	wrapper = mountWithContext(machineComponent);
		});
		it('renders a machine - checks for a Paper Component', () => {
		    expect(wrapper.find('Paper').exists()).to.be.true;
	  	});
	  	it('renders a sensor - should not contain any sensor', () => {
	  		expect(wrapper.find('Paper').children('Sensor').exists()).to.be.false;
	  	});
	  	it('renders a sensor - should have a machine schematic image', () => {
	  		expect(wrapper.find('Paper').prop('style').backgroundImage).to.be.equal(`url(${wrapper.prop('image')})`);
	  	});
	});


	describe('With sensors',() =>{
		let wrapper;
		beforeEach(()=>{
			const updateFunction = sinon.spy();
		  	const sensorData = [{
		  		id:'1',
		  		width:200,
		        height:200,
		        updateUrl:'sampleUrl1',
		        location:{x:100,y:100},
		        label:'sensor 1',
		        update:sinon.spy(),
		        updateFreq:10
		  	},{
		  		id:'2',
		  		width:200,
		        height:200,
		        updateUrl:'sampleUrl2',
		        location:{x:130,y:160},
		        label:'sensor 2',
		        update:sinon.spy(),
		        updateFreq:10
		  	}];
      		const sensorComponent=sensorData.map(data=>{
      			return (
      					<Sensor 
      					  key={data.id}	
			              id={data.id}
			              width={data.width}
			              height={data.height}
			              updateUrl={data.updateUrl}
			              location={data.location}
			              label={data.label}
			              update={data.update}
			              updateFreq={data.updateFreq}/>
      					);
      		});

		    const machineComponent = <Machine 
								      image={'abc.png'}
								      sensors={sensorComponent}/>
								                
		   	wrapper = mountWithContext(machineComponent);
		});
		it('renders a machine - checks for a Paper Component', () => {
		    expect(wrapper.find('Paper').exists()).to.be.true;
	  	});
	  	it('renders a sensor - should contain sensors', () => {
	  		expect(wrapper.find('Paper').children('Sensor')).to.have.length(2);
	  	});
	  	it('renders a sensor - should have a machine schematic image', () => {
	  		expect(wrapper.find('Paper').first().prop('style').backgroundImage).to.be.equal(`url(${wrapper.prop('image')})`);
	  	});
	});

});	