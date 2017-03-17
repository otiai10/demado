import ConfigureDecorator from './configure-decorator';

export default class Decorator {
  static of(decorator, context, client) {
    switch (decorator) {
    case 'configure': return new ConfigureDecorator(context, client);
    default: return {decorate: () => console.log('NO DECORATOR')};
    }
  }
}
