import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Gauge  from './Gauge';
import Paper from 'material-ui/Paper'
import GaugeSvg from './GaugeSvg'
import Needle from './Needle'



describe("Gauge Component", function() {
    it("contains a div element with id #gauge-widget", function() {
        expect(mount(<Gauge />).find('#gauge-widget').length).to.equal(1);
    });

    it("contains a Paper Component", function() {
        expect(mount(<Gauge />).find(Paper).length).to.equal(1);
    });

    it("contains a GaugeSvg Component", function() {
        expect(mount(<Gauge />).find(GaugeSvg).length).to.equal(1);
    });

    it("contains a Needle Component", function() {
        expect(mount(<Gauge />).find(Needle).length).to.equal(1);
    });


    it('allows us to set props for GaugeSvg Component', () => {
        const gaugeProps = {
            height: 250,
            width: 500,
            radius:250,
            innerRadius:100,
            startAngle:-30,
            endAngle:70
        };

        const wrapper = shallow(<GaugeSvg
            width={gaugeProps.width}
            height={gaugeProps.height}
            radius={gaugeProps.radius}
            innerRadius={gaugeProps.innerRadius}
            startAngle={gaugeProps.startAngle}
            endAngle={gaugeProps.endAngle}
        />);

        expect(wrapper.props().radius).to.equal('250');
    });


});

