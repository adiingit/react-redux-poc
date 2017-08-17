import { expect } from 'chai';
import { getGaugeConfig } from './config';

describe('Ranges received', () => {

    describe('getGaugeConfig(url)', () => {
        it('should return gauge reading', () => {

            let stateurl = "http://localhost:3000/gauge/reading";
            let fstate = getGaugeConfig(stateurl);
            expect(fstate).to.be.a('function');
        });

    });
});





