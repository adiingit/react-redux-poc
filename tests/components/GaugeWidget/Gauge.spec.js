import React from 'react';
import configureStore from 'redux-mock-store'
import { shallowWithContext, mountWithContext, renderWithContext } from '../../../src/utils/testing';
import { shallow, mount, render } from 'enzyme'
import thunk from 'redux-thunk'
import mockData from '../../mock/mockFetch'
import { expect } from 'chai';
import sinon from 'sinon';
import { Map, OrderedMap, Record, List } from 'immutable';
import { GaugeWidget } from '../../../src/components/GaugeWidget/Gauge';
import Needle from '../../../src/components/GaugeWidget/Needle';
import GaugeSvg from '../../../src/components/GaugeWidget/GaugeSvg';
import { renderReading, fetchCurrentReading, getGaugeConfig } from '../../../src/ducks/gauge';
import Paper from 'material-ui/Paper';

describe('Testing <Gauge Widget/>', () => {

    const mockStore = configureStore([thunk]);
    let store;
    beforeEach(() => {
        store = mockStore({ gauge: Map() });
    });
    describe('Without redux store', () => {
        let wrapper, rangeData, labelData
        beforeEach(() => {
            const spyFunction = sinon.spy();
            const widgetComponent = < GaugeWidget
            configUrl = { '/gauge/ranges' }
            readingUrl = { '/gauge/reading' }
            polling = { false }
            value = { 185 }
            gauge = { Map() }
            getGaugeConfig = { spyFunction }
            renderReading = { spyFunction }
            fetchCurrentReading = { spyFunction }
            />
            wrapper = mount(widgetComponent);
            labelData = [0];
            rangeData = [{ "min": 0, "max": 25, "color": "#2962ff" }, {
                "min": 25,
                "max": 50,
                "color": "#00c853"
            }, { "min": 50, "max": 75, "color": "#ffd600" }, { "min": 75, "max": 200, "color": "#d50000" }]
            wrapper.setProps({ gauge: Map({ 'range': List(rangeData) }) });
        });

        it('renders a gauge - checks for a Paper Component', () => {
            expect(wrapper.find(Paper).exists()).to.be.true;
        });


        it('renders a GaugeSvg widget - checks for GaugeSvg Component', () => {
            expect(wrapper.find(GaugeSvg).exists()).to.be.true;
        });
        it('renders a GaugeSvg widget - checks for mapDispatchToProps', () => {
            expect(wrapper.props()).to.have.any.keys('renderReading', 'fetchCurrentReading', 'getGaugeConfig');
        });


    });

    describe('With redux store - on action creators called', () => {
        let wrapper, rangeData, labelData
        beforeEach(() => {
            const spyFunction = sinon.spy();
            const widgetComponent = < GaugeWidget
            configUrl = { '/gauge/ranges' }
            readingUrl = { '/gauge/reading' }
            polling = { false }
            value = { 185 }
            gauge = { Map() }
            getGaugeConfig = { spyFunction }
            renderReading = { spyFunction }
            fetchCurrentReading = { spyFunction }
            />
            wrapper = mount(widgetComponent, store);
            labelData = [0];
            rangeData = [{ "min": 0, "max": 25, "color": "#2962ff" }, {
                "min": 25,
                "max": 50,
                "color": "#00c853"
            }, { "min": 50, "max": 75, "color": "#ffd600" }, { "min": 75, "max": 200, "color": "#d50000" }]
            wrapper.setProps({ gauge: Map({ 'range': List(rangeData) }) });
        });
        describe("prop types required", () => {

            it('should have an initial value', function() {

                expect(wrapper.prop('value')).to.equal(185);
            });

            it('should have an initial polling', function() {
                expect(wrapper.prop('polling')).to.equal(false);
            });

            it('should have an initial readingUrl', function() {
                store.dispatch(getGaugeConfig(wrapper.prop('readingUrl'))).then(() => {
                    const gaugeComp = wrapper.find('GaugeSvg');

                    expect(gaugeComp.exists()).to.be.true;
                    expect(gaugeComp.prop('value')).to.be.equal(185);
                });
            });

            it('should have an initial configUrl', function() {

                store.dispatch(getGaugeConfig(wrapper.prop('configUrl'))).then(() => {
                    const gaugeComp = wrapper.find('GaugeSvg');

                    expect(gaugeComp.exists()).to.be.true;
                    expect(gaugeComp.prop('min')).to.be.equal(0);
                    expect(gaugeComp.prop('max')).to.be.equal(200);
                });
            });

        });

        describe("should render RaisedButton", () => {
            beforeEach(() => {
                wrapper.setProps({
                    gauge: Map({
                        'range': List(rangeData),
                        'currentValue': 84,
                        'buttonData': { x: 841, y: 393, label: 84 }
                    })
                });
            });

            it('default props value', () => {
                expect(wrapper.find('RaisedButton').prop('primary')).to.equal(true);
            });

            it('modified prop label', () => {
                expect(wrapper.find('RaisedButton').prop('label')).to.equal("84");
            });

            it("default property 'position' of prop style", () => {
                expect(wrapper.find('RaisedButton').prop('style')).to.have.property('position', 'absolute');
            });

            it("modified property 'top' of prop style", () => {
                expect(wrapper.find('RaisedButton').prop('style')).to.have.property('top', 393);
            });

            it("modified property 'left' of prop style", () => {
                expect(wrapper.find('RaisedButton').prop('style')).to.have.property('left', 841);
            });

        });

        describe("Should render GaugeSvg", () => {

            it('should exists', () => {
                expect(wrapper.find('GaugeSvg').exists()).to.equal(true);
            });

            it('should have default labelData', () => {
                expect(wrapper.find('GaugeSvg').prop('labels')).to.deep.equal(['0', '25', '50', '75', '200']);
            });

            it('should have default rangeData', () => {
                expect(wrapper.find('GaugeSvg').prop('rangeData')).to.deep.equal([{
                    value: 25,
                    color: '#2962ff'
                }, { value: 25, color: '#00c853' }, { value: 25, color: '#ffd600' }, { value: 125, color: '#d50000' }]);
            })

            it('should have default min', () => {
                expect(wrapper.find('GaugeSvg').prop('min')).to.equal(0);
            });

            describe("on modifying rangeData set", () => {
                beforeEach(() => {
                    rangeData = [{ "min": 50, "max": 100, "color": "#2962ff" }, {
                        "min": 100,
                        "max": 150,
                        "color": "#00c853"
                    }, { "min": 150, "max": 200, "color": "#ffd600" }]
                    wrapper.setProps({ gauge: Map({ 'range': List(rangeData) }) });
                });

                it('prop labelData get changed', () => {
                    expect(wrapper.find('GaugeSvg').prop('labels')).to.deep.equal(["50", "100", "150", "200"]);
                });

                it('prop rangeData get changed', () => {
                    expect(wrapper.find('GaugeSvg').prop('rangeData')).to.deep.equal([{
                        value: 50,
                        color: '#2962ff'
                    }, { value: 50, color: '#00c853' }, { value: 50, color: '#ffd600' }]);
                });

                describe("minimum value", () => {

                    it('Equal Case', () => {
                        expect(wrapper.find('GaugeSvg').prop('min')).to.equal(50);
                    });

                    it('Not Equal Case', () => {
                        expect(wrapper.find('GaugeSvg').prop('min')).not.to.equal(100);
                    });

                });

                describe("maximum value", () => {

                    it('Equal Case', () => {
                        expect(wrapper.find('GaugeSvg').prop('max')).to.equal(200);
                    });

                    it('Not Equal Case', () => {
                        expect(wrapper.find('GaugeSvg').prop('max')).not.to.equal(100);
                    });

                });

            });

        });

        describe("Should render Needle", () => {

            it('should exists', () => {
                expect(wrapper.find('Needle').exists()).to.equal(true);
            });

            it('should have default prop value', () => {
                expect(wrapper.find('Needle').prop('value')).to.equal(185)
            });

            it('on modifying current value props value get changed', () => {
                wrapper.setProps({ gauge: Map({ 'range': List(rangeData), 'currentValue': 21 }) });
                expect(wrapper.find('Needle').prop('value')).to.equal(21)
            });

            it('on setting polling to true', () => {
                wrapper.setProps({ polling: true });
                expect(wrapper.find('Needle').prop('value')).to.equal(0)
            });

            it('on modifying rangeData set unitAngleRotation value get changed', () => {
                rangeData = [{ "min": 0, "max": 20, "color": "#2962ff" }, {
                    "min": 20,
                    "max": 40,
                    "color": "#00c853"
                }, { "min": 40, "max": 100, "color": "#ffd600" }]
                wrapper.setProps({ gauge: Map({ 'range': List(rangeData) }) });
                expect(wrapper.find('Needle').prop('unitAngleRotation')).to.equal(1);
            });

        });
    });
});