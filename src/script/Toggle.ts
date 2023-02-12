/** ============================================================
 *  @fileoverview トグルを制御するJS
 *  ============================================================ */

import { v4 } from 'uuid';

/**
 * @class Toggle
 */
export default class Toggle {
    /**
     * @property {string} BEM ブロック名
     */
    static baseName: string = 'toggle';

    base:       HTMLElement;
    body:       HTMLElement;
    button:     HTMLElement;
    buttonMark: HTMLElement;
    uniquId:    string;

    /**
     * インスタンスを生成
     * @param {HTMLElement|String} element 基底要素ノード、またはそれを探すための文字列
     * @param {String} rootName 設定したい BEM ブロック名
     */
    constructor(element: any, rootName: string = Toggle.baseName) {
        const name = rootName;

        /**
         * @type {HTMLElement} 基底要素ノード
         */
        const base = this.base = element;

        /**
         * @type {HTMLElement} トグルの開閉される本体要素
         */
        this.body = base.querySelector(`.${name}__body`);

        /**
         * @type {HTMLElement} トグルの開閉を制御するボタン要素
         */
        this.button = base.querySelector(`.${name}__button`);

        /**
         * @type {HTMLElement} ボタン内にあるマーク部分要素
         */
        this.buttonMark = base.querySelector(`.${name}__button__mark`);

        /**
         * @type {String} ユニークな識別子
         */
        this.uniquId = `${name}__${v4()}`;

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
        })
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
     * @returns {Boolean}
     */
    isOpened() {
        return this.body.getAttribute('aria-hidden') !== 'true';
    }
}
