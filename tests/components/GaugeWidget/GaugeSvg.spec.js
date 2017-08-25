import React from 'react';
import {expect} from 'chai';
import { shallowWithContext,mountWithContext,renderWithContext } from '../../../src/utils/testing';
import GaugeSvg from '../../../src/components/GaugeWidget/GaugeSvg';
import Needle from '../../../src/components/GaugeWidget/Needle';


describe('Testing <GaugeSvg />', () => {

    describe('With needle default config',() =>{
        let wrapper, _props;
        beforeEach(()=>{

            const needleData = {
                pivotPoint: {x: 0, y: 0},
                needleLength: 240,
                color: "#000",
                value: 1,
                startAngle: -30,
                unitAngleRotation: 0.5
            } ;
            const needleComponent=
                    <Needle
                        pivotPoint={needleData.pivotPoint}
                        needleLength={needleData.needleLength}
                        color={needleData.color}
                        value={needleData.value}
                        startAngle={needleData.startAngle}
                        unitAngleRotation={needleData.unitAngleRotation}
                    />
            const svgStyle = {
                overflow:'visible'
            }

            _props = {
                width : 300,
                height : 400,
                min : 0,
                max : 100,
                radius : 4,
                innerRadius : 1,
                startAngle : -30,
                endAngle : 70,
                rangeData: [{"min":0,"max":25,"color":"#2962ff"},{"min":25,"max":50,"color":"#00c853"},{"min":50,"max":75,"color":"#ffd600"},{"min":75,"max":200,"color":"#d50000"}],
                labels: ["0", "025", "02525", "0252525", "0252525125"],
                style: {svgStyle},
                needle: needleComponent
            }

            const gaugeSvgComponent = <GaugeSvg {..._props}/>
            wrapper = mountWithContext(gaugeSvgComponent);
        });
        it('renders a gaugeSvg - checks for a svg element', () => {
            expect(wrapper.find('svg').exists()).to.be.true;
        });
        it('renders a gaugeSvg - checks for a g element', () => {
            expect(wrapper.find('svg').children('g')).to.have.length(1);
        });

        it('renders a gaugeSvg - should have a gaugeSvg width', function () {
            expect(wrapper.prop('width')).to.equal(300);
        });

        it('renders a gaugeSvg - should have a gaugeSvg height', function () {
            expect(wrapper.prop('height')).to.equal(400);
        });

        it('renders a gaugeSvg - should have a gaugeSvg min', function () {
            expect(wrapper.prop('min')).to.equal(0);
        });

        it('renders a gaugeSvg - should have a gaugeSvg max', function () {
            expect(wrapper.prop('max')).to.equal(100);
        });

        it('renders a gaugeSvg - should have a gaugeSvg radius', function () {
            expect(wrapper.prop('radius')).to.equal(4);
        });

        it('rrenders a gaugeSvg - should have a gaugeSvg needle', () => {
            expect(wrapper.find('g').children('Needle')).to.have.length(1);
        });

        it('renders a needle - should have needleLength ', function () {
            expect(wrapper.find('Needle').prop('needleLength')).to.equal(240);
        });

        it('renders a needle - should have color ', function () {
            expect(wrapper.find('Needle').prop('color')).to.equal('#000');
        });

        it('renders a needle - should have startAngle', function () {
            expect(wrapper.find('Needle').prop('startAngle')).to.equal(-30);
        });

        it('renders a needle - should have unitAngleRotation', function () {
            expect(wrapper.find('Needle').prop('unitAngleRotation')).to.equal(0.5);
        });

        it('renders a needle - should have value', function () {
            expect(wrapper.find('Needle').prop('value')).to.equal(1);
        });

        it('renders a needle - should have pivotPoint', function () {
            expect(wrapper.find('Needle').prop('pivotPoint').x).to.be.equal(0);
            expect(wrapper.find('Needle').prop('pivotPoint').y).to.be.equal(0);
        });
    });
});
