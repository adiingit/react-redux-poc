import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Map } from 'immutable'
import mockData from '../../mock/mockFetch'
import * as reduxMap from '../../../src/ducks/gauge'
const theme = require('material-ui/styles')


describe('test for redux - gauge', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)

    const reducer = reduxMap.default;

    const actionTypes = {
        FETCH_GAUGE_READING: reduxMap.FETCH_GAUGE_READING,
        TOGGLE_GAUGE_READING: reduxMap.TOGGLE_GAUGE_READING,
        GAUGE_RANGE_CONFIG_RECEIVED: reduxMap. GAUGE_RANGE_CONFIG_RECEIVED
    };

    const actionCreators = Object.keys(reduxMap).reduce((val, next) => {
        if (typeof(reduxMap[next]) === 'function') {
            return Object.assign({}, val, {
                [next]: reduxMap[next]
            });
        }
    }, {});

    describe('tests for actions', () => {

        it('action FETCH_GAUGE_READING occured - on fetchCurrentReading call', () => {
            const store = mockStore({ gauge: Map() });
            const expectedActions = [{
                type: actionTypes.FETCH_GAUGE_READING,
                gauge: '185'
            }];

            store.dispatch(actionCreators.fetchCurrentReading('/gauge/reading')).then(() => {
                expect(store.getActions()).to.deep.equal(expectedActions)
            });
        });
        it('action TOGGLE_GAUGE_READING - on renderReading call', () => {
            const store = mockStore({ gauge: Map() });
            const expectedActions = [
                { type: actionTypes.TOGGLE_GAUGE_READING, value: { x: 841, y: 393, label: 84 } }
            ];

            store.dispatch(actionCreators.renderReading({ x: 841, y: 393, label: 84 }));
            expect(store.getActions()).to.deep.equal(expectedActions)

        });
        it('action GAUGE_RANGE_CONFIG_RECEIVED - on getGaugeConfig call', () => {
            const store = mockStore({ gauge: Map() });
            const expectedActions = [{
                type: actionTypes.GAUGE_RANGE_CONFIG_RECEIVED,
                gauge: [
                    {min:0, max:25, color:theme.colors.blueA700},
                    {min:25, max:50, color:theme.colors.greenA700},
                    {min:50, max:75, color:theme.colors.yellowA700},
                    {min:75, max:200, color:theme.colors.redA700}
                ]
            }];

            store.dispatch(actionCreators.getGaugeConfig('/gauge/ranges')).then(() => {
                expect(store.getActions()).to.deep.equal(expectedActions)
            });
        });

    });
})