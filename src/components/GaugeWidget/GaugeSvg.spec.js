import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import GaugeSvg from './GaugeSvg';



describe("GaugeSvg Component", function() {
    it("contains a single svg element", function() {
        const wrapper = shallow(<GaugeSvg />);
        expect(wrapper.find('svg').length).to.equal(1);
    });
});
