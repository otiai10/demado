import {MadoConfigureManager} from '../../services/mado';

export function MadoConfigure(message) {
  let configurer = MadoConfigureManager.sharedInstance(message);
  return configurer.open();
}

export function MadoShouldDecorate() {
  let configurer = MadoConfigureManager.sharedInstance();
  if (configurer.hasTarget(this.sender.tab.id)) {
    return {status:200, decorator:'configure'};
  }
  return true;
}
