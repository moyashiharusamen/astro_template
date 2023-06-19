/** ============================================================
 *  @fileoverview トグルを制御するJS
 *  ============================================================ */

import Events from 'events';
import { v4 as uuidv4 } from 'uuid';

/**
 * @class Toggle
 */
export default class Toggle extends Events {
  base: HTMLElement;
  body: HTMLElement;
  button: HTMLElement;
  buttonMark: HTMLElement;
  uniquId: string;

  /**
   * @property {string} ブロック名
   */
  static baseName: string = 'toggle';

  /**
   * 現在の HTML ページ内にあるすべての Toggle ブロックをインスタンス化する
   */
  static createAll(name: string = Toggle.baseName) {
    document.querySelectorAll(`.${name}`).forEach((element: Object) => {
      return new Toggle(element, name);
    });
  }

  /**
   * インスタンスを生成
   * @param {Object} element 基底要素ノード、またはそれを探すための文字列
   * @param {string} name 設定したいブロック名
   */
  constructor(element: Object, name: string = Toggle.baseName) {
    super();

    const baseName = name;

    /**
     * @type {HTMLElement} 基底要素ノード
     */
    const base = (this.base = <HTMLElement>element);

    /**
     * @type {HTMLElement} トグルの開閉される本体要素
     */
    this.body = <HTMLElement>base.querySelector(`.${baseName}__body`);

    /**
     * @type {HTMLElement} トグルの開閉を制御するボタン要素
     */
    this.button = <HTMLElement>base.querySelector(`.${baseName}__button`);

    /**
     * @type {HTMLElement} ボタン内にあるマーク部分要素
     */
    this.buttonMark = <HTMLElement>base.querySelector(`.${baseName}__button__mark`);

    /**
     * @type {string} ユニークな識別子
     */
    this.uniquId = `${baseName}__${uuidv4()}`;

    this.bindEvents();
    this.setAttr();
  }

  /**
   * 属性の初期設定
   * @return {Void}
   */
  setAttr() {
    this.button.setAttribute('aria-expanded', 'false');
    this.button.setAttribute('aria-controls', this.uniquId);
    this.body.setAttribute('id', this.uniquId);
  }

  /**
   * イベントのバインド登録
   * @return {Void}
   */
  bindEvents() {
    this.button.addEventListener('click', e => {
      e.preventDefault();
      this.toggle();
    });
  }

  /**
   * トグルの開閉
   * @return {Void}
   */
  toggle() {
    this.isOpened() ? this.close() : this.open();
  }

  /**
   * トグルを開く
   * @return {Void}
   */
  open() {
    this.emit('open', this);
    this.body.setAttribute('aria-hidden', 'false');
    this.button.setAttribute('aria-expanded', 'true');
    this.buttonMark.textContent = '閉じる';
  }

  /**
   * トグルを開く
   * @return {Void}
   */
  close() {
    this.body.setAttribute('aria-hidden', 'true');
    this.button.setAttribute('aria-expanded', 'false');
    this.buttonMark.textContent = '開く';
  }

  /**
   * トグルが開いているかどうか
   * @returns {boolean}
   */
  isOpened() {
    return this.body.getAttribute('aria-hidden') !== 'true';
  }
}
