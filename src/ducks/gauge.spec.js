import { expect } from 'chai';
import { fetchCurrentReading ,renderCurrentReading} from './gauge';

    describe('Gauge reading', () => {
        describe('fetchCurrentReading(url)', () => {
            it('should return gauge reading', () => {
                let stateurl = "http://localhost:3000/gauge/reading";
                let fstate = fetchCurrentReading(stateurl);
                expect(fstate).to.be.a('function');
            });
        });

        describe('renderCurrentReading()', () => {
            it('should render current gauge reading', () => {
                let fstate = renderCurrentReading();
                expect(fstate).to.not.be.a('');
            });
        });
    });





