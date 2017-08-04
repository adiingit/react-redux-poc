import {store} from './SICKPlatform'
import ducks from './ducks'


export function configureGaugeWidget(url){
  return store.dispatch(ducks.config.getGaugeConfig(url));
}

export function configureMachineWidget(url){
  return store.dispatch(ducks.config.getMachineSchematicConfig(url));
}