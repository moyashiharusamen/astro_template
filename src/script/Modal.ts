/** ============================================================
 *  @fileoverview モーダルを制御するJS
 *  ============================================================ */

import { v4 } from 'uuid';

/**
 * @class Modal
 */
export default class Modal {
  /**
   * @property {string} ブロック名
   */
  static baseName: string = 'modal';

  base: HTMLElement;
  body: HTMLBodyElement;
  modalBody: HTMLElement;
  button: HTMLElement;
  focusableElement: any;
  firstFocusableElement: HTMLElement;
  lastFocusableElement: HTMLElement;
  modalOverlay: HTMLDivElement;
  openClass: string;
  uniquId: string;
  windowYPosition: number;

  /**
   * インスタンスを生成
   * @param {Object} element 基底要素ノード、またはそれを探すための文字列
   * @param {string} rootName 設定したいブロック名
   */
  constructor(element: Object, rootName: string = Modal.baseName) {
    const baseName = rootName;

    /**
     * @type {HTMLElement} 基底要素ノード
     */
    const base = (this.base = <HTMLElement>element);

    /**
     * @type {HTMLElement} HTML の body 要素
     */
    this.body = <HTMLBodyElement>document.querySelector('body');

    /**
     * @type {HTMLElement} モーダルの開閉される本体要素
     */
    const modalBody = this.modalBody = <HTMLElement>base.querySelector(`.${baseName}__body`);

    /**
     * @type {HTMLElement} モーダルの開閉を制御するボタン要素
     */
    this.button = <HTMLElement>base.querySelector(`.${baseName}__button`);

    /**
     * @type {any} モーダル内のフォーカス可能な要素群
     */
    this.focusableElement = modalBody.querySelectorAll(
      'a[href], area[href], input, select, textarea, button, output, video, audio, object, embed, iframe, [tabindex], [onclick]'
    );
    if (this.focusableElement.length === 0) this.focusableElement = [this.modalBody];

    /**
     * @type {HTMLElement} モーダル内のフォーカス可能な要素群の中の最初の要素
     */
    this.firstFocusableElement = <HTMLElement>this.focusableElement[0];

    /**
     * @type {HTMLElement} モーダル内のフォーカス可能な要素群の中の最後の要素
     */
    this.lastFocusableElement = <HTMLElement>this.focusableElement[this.focusableElement.length - 1];

    /**
     * @type {HTMLElement} モーダル内の透過背景要素
     */
    this.modalOverlay = <HTMLDivElement>document.createElement('div');
    this.modalOverlay.classList.add(`${baseName}__overlay`);
    this.modalBody.appendChild(this.modalOverlay);

    /**
     * @type {string} モーダルが開いたときに付与される class 属性名
     */
    this.openClass = '-modal-open';

    /**
     * @type {string} ユニークな識別子
     */
    this.uniquId = `${baseName}__${v4()}`;

    /**
     * @type {number} window の縦軸位置が入る
     */
    this.windowYPosition = 0;

    this.setAttr();
    this.bindEvents();
  }

  /**
   * 属性の初期設定
   * @return {Void}
   */
  setAttr() {
    this.button.setAttribute('aria-expanded', 'false');
    this.button.setAttribute('aria-controls', this.uniquId);
    this.modalBody.setAttribute('role', 'dialog');
    this.modalBody.setAttribute('aria-modal', 'true');
    this.modalBody.setAttribute('aria-hidden', 'true');
    this.modalBody.setAttribute('id', this.uniquId);

    if (this.focusableElement.length === 0) this.modalBody.setAttribute("tabindex", "0");
  }

  /**
   * イベントのバインド登録
   * @return {Void}
   */
  bindEvents() {
    this.button.addEventListener('click', () => {
      this.button.getAttribute('aria-expanded') === 'false' ? this.open() : this.close();
    });
    this.modalOverlay.addEventListener('click', () => this.close());
    this.base.addEventListener('keyup', e => {
      if (
        (e.key === 'Escape' || e.key === 'Esc') &&
        this.modalBody.getAttribute('aria-hidden') === 'false'
      ) {
        this.close();
      }
    });
    this.base.addEventListener('keydown', e => {
      if (e.code === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === this.firstFocusableElement) {
            e.preventDefault();
            this.lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === this.lastFocusableElement) {
            e.preventDefault();
            this.firstFocusableElement.focus();
          }
        }
      }
    });
  }

  /**
   * モーダルを開く
   * @return {Void}
   */
  open() {
    this.windowYPosition = window.pageYOffset;
    this.body.classList.add(this.openClass);
    this.body.style.top = `${-this.windowYPosition}px`;
    this.modalBody.setAttribute('aria-hidden', 'false');
    this.modalBody.setAttribute("tabindex", "0");
    this.button.setAttribute('aria-expanded', 'true');
    this.firstFocusableElement.focus();
    window.addEventListener("keydown", () => this.focusIndex());
  }

  /**
   * モーダルを閉じる
   * @return {Void}
   */
  close() {
    this.body.classList.remove(this.openClass);
    this.body.style.top = '';
    this.modalBody.setAttribute('aria-hidden', 'true');
    this.modalBody.removeAttribute('tabindex');
    this.button.setAttribute('aria-expanded', 'false');
    window.scrollTo(0, this.windowYPosition);
    window.removeEventListener("keydown", () => this.focusIndex());
  }

  focusIndex() {
    const focusIndex = (() => {
      const arr: Array<unknown> = [];
      this.focusableElement.forEach(element => {
        arr.push(element);
      })

      return arr.findIndex(
        el => el === document.activeElement
      );
    })();

    if (focusIndex !== 0) {
      this.firstFocusableElement.focus();
    }
  }
}
