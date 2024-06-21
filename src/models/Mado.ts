import { Model } from 'jstorm/chrome/local';

const colorSet = [
  '#00D1B2',
  '#4258FF',
  '#66D1FF',
  '#FFB70F',
  '#FF6685',
  // '#2B2D42',
  // '#E86A92',
  // '#F7E733',
  // '#F7F7F9',
  // '#41E2BA',
];

export default class Mado extends Model {
  static override _namespace_ = 'Mado';
  static override _nextID_ = () => Math.random().toString(36).slice(2);
  public name!: string;
  public url!: string;
  public color!: string;

  private static colorcodeByIndex(index: number): string {
    return colorSet[index % colorSet.length];
  }

  public colorcodeByIndex(index: number): string {
    return this.color || Mado.colorcodeByIndex(index);
  }
}