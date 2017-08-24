import React from 'react';
import { shallow, mount } from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import { shallowWithContext,mountWithContext,renderWithContext } from '../../../src/utils/testing';

import Needle from '../../../src/components/GaugeWidget/Needle';

describe('Testing <Needle />', () => {
    describe('With config', () => {
        let wrapper;
        beforeEach(() => {
            const updateFunction = sinon.spy();
            const needleComponent = <Needle
                value={1}
                color={'#000'}
                startAngle={-30}
                unitAngleRotation={0.5}
                pivotPoint={{x: 0, y: 0}}
                needleLength={240}
                mouseover={updateFunction}
                mouseout={updateFunction}/>;
            wrapper = mountWithContext(needleComponent);
        });
        describe("for mouse event functions", () => {
            it('renders a needle - on mouseover of needle', () => {
                wrapper.find('path').simulate('mouseover');
                expect(wrapper.find('path').prop('onMouseOver')).to.have.been.called;
            });

            it('renders a needle - on mouseout of needle', () => {
                wrapper.find('path').simulate('mouseover');
                expect(wrapper.find('path').prop('onMouseOut')).to.have.been.called;
            });
        });
        describe("for Props", () => {
            it('renders a needle - should have a needle value', function () {
                expect(wrapper.props().value).to.equal(1);
            });
            it('renders a needle - should have a needle color', function () {
                expect(wrapper.props().color).to.equal('#000');
            });
            it('renders a needle - should have a needle length', function () {
                expect(wrapper.props().needleLength).to.equal(240);
            });
            it('renders a needle - should have a needle startAngle', function () {
                expect(wrapper.props().startAngle).to.equal(-30);
            });
            it('renders a needle - should have a needle unitAngleRotation', function () {
                expect(wrapper.props().unitAngleRotation).to.equal(0.5);
            });

            describe('should have pivotPoint', () => {
                it('renders a needle - should have property x of pivotPoint', () => {
                    expect(wrapper.props().pivotPoint).to.have.property('x', 0);
                });
                it('renders a needle - should have property y of pivotPoint', () => {
                    expect(wrapper.props().pivotPoint).to.have.property('y', 0);
                });
            });
        });

        it('renders an element - should have className needle', () => {
            expect(wrapper.find('g.needle').exists()).to.equal(true);
        });

        describe("should render path", () => {
            it('should have fill', () => {
                expect(wrapper.find('path').prop('fill')).to.equal('#000');
            });

            it('should reflect change after changing prop fill value', () => {
                wrapper.setProps({color: '#FFA07A'});
                expect(wrapper.find('path').prop('fill')).to.equal('#FFA07A');
            });
        });
    });
});


