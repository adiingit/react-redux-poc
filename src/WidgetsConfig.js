import {store} from './SICKPlatform'
import ducks from './ducks'

/**
 * This function calls a REST API for GaugeWidget Config.
 * @param {get} url  "Fetching range for GaugeWidget ${baseUrl}:3000/gauge/ranges"
 * @return Set of Ranges
 */
export function configureGaugeWidget(url){
	return store.dispatch(ducks.config.getGaugeConfig(url));
}

/**
 * This function calls a REST API for MachineWidget Config.
 * @param {get} url  "Fetching all the machine schematic"
 * @return Set of Machines
 */
export function configureMachineWidget(url){
	return store.dispatch(ducks.config.getMachineSchematicConfig(url));
}