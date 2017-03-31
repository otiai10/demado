import {Model} from 'chomex';

export default class Config extends Model {
  static default = {
    'ask-before-unload': {value:true},
    'use-prisc': {value:false},
  }
}
