import ConfigureDecorator from './configure-decorator';
import AppDecorator       from './app-decorator';

export default class Decorator {
  static of(decorator, context, client) {
    switch (decorator) {
    case 'configure': return new ConfigureDecorator(context, client);
    case 'app':       return new AppDecorator(context, client);
    default: return {decorate: () => console.log('NO DECORATOR')};
    }
  }
}
