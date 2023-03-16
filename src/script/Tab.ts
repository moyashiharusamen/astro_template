/** ============================================================
 *  @fileoverview タブパネルを制御するJS
 *  ============================================================ */

import { v4 } from 'uuid';

/**
 * @class Tab
 */

export default class Tab {
  /**
   * @property {string} ブロック名
   */
  static baseName: string = 'tab';

  baseName: string;
  base: HTMLElement;
  buttonWrap: HTMLElement;
  buttons: NodeList;
  bodies: NodeList;
  defaultDisplayNumber: number;
  uniquId: string;

  /**
   * インスタンスを生成
   * @param {Object} element 基底要素ノード、またはそれを探すための文字列
   * @param {string} rootName 設定したいブロック名
   */
  constructor(element: Object, rootName: string = Tab.baseName) {
    const baseName = this.baseName = rootName;

    /**
     * @type {HTMLElement} 基底要素ノード
     */
    const base = this.base = <HTMLElement>element;

    /**
     * @type {HTMLElement} タブを制御するボタンを内包するラッパー要素
     */
    this.buttonWrap = <HTMLElement>base.querySelector(`.${baseName}__button__wrap`);

    /**
     * @type {NodeList} タブを制御するボタン要素
     */
    this.buttons = <NodeList>base.querySelectorAll(`.${baseName}__button`);

    /**
     * @type {NodeList} タブボタンで表示非表示される要素
     */
    this.bodies = <NodeList>base.querySelectorAll(`.${baseName}__body`);

    /**
     * @type {number} デフォルトで表示するタブの順番を表す数値
     */
    this.defaultDisplayNumber = Number(base.dataset.defaultDisplay) - 1;


    /**
     * @type {string} ユニークな識別子
     */
    this.uniquId = `${baseName}__${v4()}`;

    this.bindEvents();
    this.setAttr();
  }

  bindEvents() {
    this.buttons.forEach((button, i) => {
      button.addEventListener('click', e => {
        const target: any = e.target;
        if (target.getAttribute('aria-selected') === 'true') return;

          this.toggle(target, false);
      });

      button.addEventListener('keydown', e => {
        this.keyCtrl(e);
      });
    })
  }

  setAttr() {
    this.buttonWrap.setAttribute('role', 'tablist');
    this.buttons.forEach((button: any, i) => {
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', `${this.baseName}_${i + 1}`);

      if (this.defaultDisplayNumber === i) {
        button.setAttribute('aria-selected', 'true');
        button.setAttribute('tabindex', '0');
      } else {
        button.setAttribute('aria-selected', 'false');
        button.setAttribute('tabindex', '-1');
      }
    });
    this.bodies.forEach((body: any, i) => {
      body.setAttribute('role', 'tabpanel');
      body.setAttribute('id', `${this.baseName}_${i + 1}`);

      if (this.defaultDisplayNumber === i) {
        body.setAttribute('aria-hidden', 'false');
      }
    });
  }

  toggle(target: HTMLElement, inputKeyboard: boolean) {
    const currentTargetID = target.getAttribute('aria-controls');
    const targetElement = <HTMLElement>this.base.querySelector(`.${this.baseName}__body[id='${currentTargetID}'`);

    if (targetElement.getAttribute('aria-hidden') === 'false') return;

    this.buttons.forEach((button: any) => {
      button.setAttribute('aria-selected', 'false');
      button.setAttribute('tabindex', '-1');
    });
    target.setAttribute('aria-selected', 'true');
    target.setAttribute('tabindex', '0');
    this.bodies.forEach((body: any) => {
      body.setAttribute('aria-hidden', 'true');
    });
    targetElement.setAttribute('aria-hidden', 'false');

    if (inputKeyboard) target.focus();
  }

  keyCtrl(e: any) {
    let target;
    const currentTarget = e.target;

    if (
      (e.key === 'ArrowRight' || e.key === 'Right')
      || (e.key === 'ArrowDown' || e.key === 'Down')
    ) {
      target = currentTarget.nextElementSibling;

      // 次のタブがなければ最初のタブへ
      if (!target) target = this.buttons[0];
    } else if (
      (e.key === 'ArrowLeft' || e.key === 'Left')
      || (e.key === 'ArrowUp' || e.key === 'Up')
    ) {
      // 'left arrow key & up arrow key'
      target = currentTarget.previousElementSibling;

      // 前のタブがなければ最後のタブへ
      if (!target) target = this.buttons[this.buttons.length - 1];
    }

    if ((e.key === 'ArrowLeft' || e.key === 'Left')
      || (e.key === 'ArrowUp' || e.key === 'Up')
      || (e.key === 'ArrowRight' || e.key === 'Right')
      || (e.key === 'ArrowDown' || e.key === 'Down')
    ) {
      e.preventDefault()
      this.toggle(target, true);
    }
  }
}
