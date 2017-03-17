import {MadoConfigureManager} from '../../services/mado';

export function MadoConfigure({url}) {
  return MadoConfigureManager.sharedInstance().open({url});
}

export function MadoShouldDecorate() {
  let configurer = MadoConfigureManager.sharedInstance();
  if (configurer.hasTarget(this.sender.tab.id)) {
    return {status:200, decorator:'configure'};
  }
  return true;
}
