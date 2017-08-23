import React from 'react';
import configureStore from 'redux-mock-store'
import { shallowWithContext,mountWithContext,renderWithContext } from '../../../src/utils/testing';
import {Map} from 'immutable'
import thunk from 'redux-thunk'
import mockData from '../../mock/mockFetch'
import MachineWidget from '../../../src/components/Machine/Widget';
import Sensor from '../../../src/components/Machine/Sensor';
import Machine from '../../../src/components/Machine/Machine';
import {fetchCurrentSystem,fetchMachineConfig,fetchSensorStatus,displaySensorValue} from '../../../src/ducks/machine'

describe('Testing <Machine Widget/>', () => {

	const mockStore = configureStore([thunk]);
	let store;
	beforeEach(()=>{
		store = mockStore({machine:Map()});
	});
	describe('With redux store',() =>{
		let wrapper;
		beforeEach(()=>{
			const machineChange = sinon.spy();
			const widgetComponent = <MachineWidget 
									onMachineChange={machineChange} 
									url = {'/machine/1'} />
		   	wrapper = shallowWithContext(widgetComponent,store);
		});
		it('renders a machine widget - checks for Machine Component before config', () => {
		    expect(wrapper.find('Machine').exists()).to.be.false;
	  	});
	  	it('renders a machine widget - checks for mapDispatchToProps', () => {
		    expect(wrapper.props()).to.have.any.keys('fetchCurrentSystem','fetchMachineConfig','fetchSensorStatus','displaySensorValue');
	  	});
	  	it('renders a machine widget - checks for update on config url change', () => {
	  		wrapper.setProps({url:'/new/url'});
	  		expect(MachineWidget.prototype.componentWillReceiveProps).to.have.been.called;
	  		expect(wrapper.instance().componentDidUpdate).to.have.been.called;
	  		expect(wrapper.prop('fetchMachineConfig')).to.have.been.called;
	  	});
	});


	describe('With redux store - on action creators called',() =>{
		let wrapper;
		beforeEach(()=>{
			const machineChange = sinon.spy();
			const widgetComponent = <MachineWidget 
									onMachineChange={machineChange} 
									url = {'/machine/1'} />
		   	wrapper = shallowWithContext(widgetComponent,store);
		});
	  	it('renders a machine widget - checks for config load', () => {
	  		store.dispatch(fetchMachineConfig(wrapper.prop('url'))).then(()=>{
				const config = wrapper.prop('machineConfig');
				const machineComp = wrapper.find('Machine');
				
				expect(machineComp.exists()).to.be.true;
				expect(config.get('machineName')).to.be.equal('01');
				expect(machineComp.prop('image')).to.be.equal('images/Auto_pallet1.png');
				expect(machineComp.prop('sensors')).to.have.length(3);
			});
	  	});

	  	//todo
	  	it.skip('renders a machine widget - checks for update on sensor data change', () => {
	  		store.dispatch(fetchMachineConfig(wrapper.prop('url')));
	  		const config = wrapper.prop('machineConfig');
	  		store.dispatch(fetchSensorStatus(config.get('url'))).then(()=>{
				const sensors = wrapper.children('Sensor');
				const sensorData = wrapper.prop('machineConfig').get('sensorData');
				const machineComp = wrapper.find('Machine');
				
				expect(machineComp.exists()).to.be.true;
				expect(config.get('machineName')).to.be.equal('01');
				expect(machineComp.prop('image')).to.be.equal('images/Auto_pallet1.png');
				expect(machineComp.prop('sensors')).to.have.length(3);
			});
	  		wrapper.setProps({url:'/new/url'});
	  		expect(MachineWidget.prototype.componentWillReceiveProps).to.have.been.called;
	  		expect(wrapper.instance().componentDidUpdate).to.have.been.called;
	  		expect(wrapper.prop('fetchMachineConfig')).to.have.been.called;
	  	});
	});

});	