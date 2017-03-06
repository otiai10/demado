import ConfigureDecorator from './configure-decorator';

export default class Decorator {
  static of(decorator, context = window) {
    switch (decorator) {
    case 'configure': return new ConfigureDecorator(context);
    default: return {decorate: () => console.log('NO DECORATOR')};
    }
  }
}
