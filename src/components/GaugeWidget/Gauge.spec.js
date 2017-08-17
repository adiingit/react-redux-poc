import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Gauge  from './Gauge';
import Paper from 'material-ui/Paper'
import GaugeSvg from './GaugeSvg'
import Needle from './Needle'



describe("Gauge Component", function() {
    it("contains div element with id #gauge-widget", function () {
        expect(mount(<Gauge />).find('#gauge-widget').length).to.equal(1);
    });

    it("contains Paper Component", function () {
        expect(mount(<Gauge />).find(Paper).length).to.equal(1);
    });

    it("contains GaugeSvg Component", function () {
        expect(mount(<Gauge />).find(GaugeSvg).length).to.equal(1);
    });

    it("contains Needle Component", function () {
        expect(mount(<Gauge />).find(Needle).length).to.equal(1);
    });

    describe("contains GaugeSvg Component", function() {
        describe("with default props value", function () {
            const wrapper = mount(<Gauge />).find(GaugeSvg).at(0).props()
            it('radius', function () {
                expect(wrapper.radius).to.equal(250);
            });

            it('height', function () {
                expect(wrapper.height).to.equal(250);
            });

            it('width', function () {
                expect(wrapper.width).to.equal(500);
            });

            it('innerRadius', function () {
                expect(wrapper.innerRadius).to.equal(100);
            });

            it('startAngle', function () {
                expect(wrapper.startAngle).to.equal(-30);
            });

            it('endAngle', function () {
                expect(wrapper.endAngle).to.equal(70);
            });

            it('minimum value', function () {
                expect(wrapper.min).to.equal(0);
            });


            it('maximum value', function () {
                expect(wrapper.max).to.equal(100);
            });

            it('rangeData', function () {
                expect(wrapper.rangeData).to.deep.equal([]);
            });
        });

        describe("without default props value", function () {
            const wrapper = mount(<Gauge />).find(GaugeSvg).at(0).props()
            it('radius', function () {
                expect(wrapper.radius).not.to.equal(260);
            });

            it('height', function () {
                expect(wrapper.height).not.to.equal(230);
            });

            it('width', function () {
                expect(wrapper.width).not.to.equal(520);
            });

            it('innerRadius', function () {
                expect(wrapper.innerRadius).not.to.equal(400);
            });

            it('startAngle', function () {
                expect(wrapper.startAngle).not.to.equal(60);
            });

            it('endAngle', function () {
                expect(wrapper.endAngle).not.to.equal(90);
            });

            it('minimum value', function () {
                expect(wrapper.min).not.to.equal(10);
            });

            it('maximum value', function () {
                expect(wrapper.max).not.to.equal(90);
            });

            it('rangeData', function () {
                expect(wrapper.rangeData).not.to.equal('');
            });

        });


        describe("contains Needle Component", function () {
            describe("with default props value", function () {
                const wrapper = mount(<Gauge />).find(Needle).at(0).props()
                it('pivotPoint', function () {
                    expect(wrapper.pivotPoint).to.deep.equal({x: 0, y: 0});
                });

                it('needleLength', function () {
                    expect(wrapper.needleLength).to.equal(240);
                });

                it('color', function () {
                    expect(wrapper.color).to.equal('#000');
                });

                it('value', function () {
                    expect(wrapper.value).to.equal(0);
                });

                it('startAngle', function () {
                    expect(wrapper.startAngle).to.equal(-30);
                });

                it('unitAngleRotation', function () {
                    expect(wrapper.unitAngleRotation).to.equal(1);
                });

            });

            describe("without default props value", function () {
                const wrapper = mount(<Gauge />).find(GaugeSvg).at(0).props()
                it('pivotPoint', function () {
                    expect(wrapper.pivotPoint).not.to.deep.equal({x: 10, y: 0});
                });

                it('needleLength', function () {
                    expect(wrapper.needleLength).not.to.equal(250);
                });

                it('color', function () {
                    expect(wrapper.color).not.to.equal('#fff');
                });

                it('value', function () {
                    expect(wrapper.value).not.to.equal(100);
                });

                it('startAngle', function () {
                    expect(wrapper.startAngle).not.to.equal(60);
                });

                it('unitAngleRotation', function () {
                    expect(wrapper.unitAngleRotation).not.to.equal(2);
                });

            });


        });


    });

});

