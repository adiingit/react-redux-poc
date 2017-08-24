import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Map } from 'immutable'
import mockData from '../../mock/mockFetch'
import * as reduxMap from '../../../src/ducks/machine'



describe('test for redux - machine', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)

    const reducer = reduxMap.default;

    //delete reduxMap.default;

    const actionTypes = {
        CURRENT_SYSTEM_LOADED: reduxMap.CURRENT_SYSTEM_LOADED,
        MACHINE_LOADED: reduxMap.MACHINE_LOADED,
        SENSOR_STATUS_RECEIVED: reduxMap.SENSOR_STATUS_RECEIVED,
        DISPLAY_SENSOR_VALUE: reduxMap.DISPLAY_SENSOR_VALUE
    };
    /*Object.keys(reduxMap).reduce((val,next) => {
        if (typeof(reduxMap[next]) === 'string') {
            return Object.assign({},val,{ [next]: reduxMap[next] });
        }
    },{});*/
    const actionCreators = Object.keys(reduxMap).reduce((val, next) => {
        if (typeof(reduxMap[next]) === 'function') {
            return Object.assign({}, val, {
                [next]: reduxMap[next]
            });
        }
    }, {});

    afterEach(() => {

    });

    describe('tests for actions', () => {

        it('action CURRENT_SYSTEM_LOADED occured - on fetchCurrentSystem call', () => {
            const store = mockStore({ machine: Map() });
            const expectedActions = [
                { type: actionTypes.CURRENT_SYSTEM_LOADED }
            ];

            store.dispatch(actionCreators.fetchCurrentSystem());
            expect(store.getActions()).to.deep.equal(expectedActions)
        });
        it('action DISPLAY_SENSOR_VALUE - on displaySensorValue call', () => {
            const store = mockStore({ machine: Map() });
            const expectedActions = [
                { type: actionTypes.DISPLAY_SENSOR_VALUE, id: 1 }
            ];

            store.dispatch(actionCreators.displaySensorValue(1));
            expect(store.getActions()).to.deep.equal(expectedActions)

        });
        it('action MACHINE_LOADED - on fetchMachineConfig call', () => {
            const store = mockStore({ machine: Map() });
            const expectedActions = [{
                type: actionTypes.MACHINE_LOADED,
                machine: {
                    name: '01',
                    image: 'images/Auto_pallet1.png',
                    sensors: [{ 'x': 200, 'y': 100 }, { 'x': 335, 'y': 42 }, { 'x': 150, 'y': 190 }],
                    id: 120,
                    label: 120,
                    url: `sensor/1/status`,
                    updateFreq: 2
                }
            }];

            store.dispatch(actionCreators.fetchMachineConfig('/machine/1')).then(() => {
                expect(store.getActions()).to.deep.equal(expectedActions)
            });
        });
        it('action SENSOR_STATUS_RECEIVED - on fetchSensorStatus call', () => {
            const store = mockStore({ machine: Map() });
            const expectedActions = [{
                type: actionTypes.SENSOR_STATUS_RECEIVED,
                sensorStatus: {
                    id: 1,
                    idle: true,
                    color: '#cacaca'
                }
            }];

            store.dispatch(actionCreators.fetchSensorStatus('/sensor/1/status')).then(() => {
                expect(store.getActions()).to.deep.equal(expectedActions)
            });

        });

    });

    describe('tests for reducers', () => {
        const initialState = Map();
        const state = {
            CURRENT_SYSTEM_LOADED: Map({ machineLoading: true }),
            MACHINE_LOADED: (function() {
                let nextState = initialState;
                nextState = nextState.setIn(['machineName'], 'name');
                nextState = nextState.setIn(['image'], 'image');
                nextState = nextState.setIn(['sensors'], []);
                nextState = nextState.setIn(['sensorData'], null);
                return nextState;
            })(),
            SENSOR_STATUS_RECEIVED: (function() {
                let nextState = initialState;
                nextState = nextState.setIn(['sensorData'], { '1': { id: '1', status: true } });
                return nextState;
            })(),
            DISPLAY_SENSOR_VALUE: (function() {
                let nextState = initialState;
                nextState = nextState.setIn(['sensorDisplay'], { '1': true });
                return nextState;
            })()
        }
        it('return the initial state', () => {
            expect(reducer(undefined, {}).equals(initialState)).to.be.equal(true);
        })


        it('should handle CURRENT_SYSTEM_LOADED', () => {
            expect(
                reducer(initialState, {
                    type: actionTypes.CURRENT_SYSTEM_LOADED
                }).equals(state.CURRENT_SYSTEM_LOADED)
            ).to.be.equal(true);
        });

        it('should handle MACHINE_LOADED', () => {
            expect(
                reducer(initialState, {
                    type: actionTypes.MACHINE_LOADED,
                    machine: {
                        name: 'name',
                        image: 'image',
                        sensors: []
                    }
                }).toObject()
            ).to.deep.equal(state.MACHINE_LOADED.toObject());
        });

        it('should handle SENSOR_STATUS_RECEIVED', () => {
            expect(
                reducer(initialState, {
                    type: actionTypes.SENSOR_STATUS_RECEIVED,
                    sensorStatus: { id: '1', status: true }
                }).toObject()
            ).to.deep.equal(state.SENSOR_STATUS_RECEIVED.toObject());
        });

        it('should handle DISPLAY_SENSOR_VALUE', () => {
            expect(
                reducer(initialState, {
                    type: actionTypes.DISPLAY_SENSOR_VALUE,
                    id: '1'
                }).toObject()
            ).to.deep.equal(state.DISPLAY_SENSOR_VALUE.toObject());
        });
    })
});