/** ============================================================
 *  @fileoverview カルーセルを制御するJS
 *  ============================================================ */

import { Splide } from '@splidejs/splide';

/**
 * @class Carousel
 */

export default class Carousel {
  /**
   * @property {string} ブロック名
   */
  static baseName: string = 'carousel';

  /**
   * 現在の HTML ページ内にあるすべての Carousel ブロックをインスタンス化する
   */
  static createAll(name: string = Carousel.baseName) {
    document.querySelectorAll(`.${name}`).forEach((element: Object) => {
      new Carousel(element, name);
    });
  }

  /**
   * インスタンスを生成
   * @param {Object} element 基底要素ノード、またはそれを探すための文字列
   * @param {string} name 設定したいブロック名
   */
  constructor(element: Object, name: string) {
    const splide = new Splide('.splide', {
      padding: '20px',
      lazyLoad: 'nearby',
      type: 'loop',
    });
    splide.mount();
  }
}
