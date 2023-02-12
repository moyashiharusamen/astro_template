/** ============================================================
 *  @fileoverview モーダルを制御するJS
 *  ============================================================ */

import { v4 } from 'uuid';

/**
 * @class Modal
 */
export default class Modal {
    /**
     * @property {string} BEM ブロック名
     */
    static baseName = 'modal';

    body:       HTMLBodyElement;
    modalBody: HTMLElement;
    button:     HTMLElement;
    buttonText: HTMLElement;
    focusableElement: NodeList;
    firstFocusableElement: HTMLElement;
    lastFocusableElement: HTMLElement;
    modalOverlay: HTMLDivElement;
    openClass: string;
    uniquId:    string;
    windowYPosition: number;

    /**
     * インスタンスを生成
     * @param {Object} element 基底要素ノード、またはそれを探すための文字列
     */
    constructor(element: Object) {
        const baseName = Modal.baseName;

        /**
         * @type {HTMLElement} 基底要素ノード
         */
        const base = <HTMLElement>element;

        /**
         * @type {HTMLElement} HTML の body 要素
         */
        this.body = <HTMLBodyElement>document.querySelector('body');

        /**
         * @type {HTMLElement} モーダルの開閉される本体要素
         */
        this.modalBody = <HTMLElement>base.querySelector(`.${baseName}__body`);

        /**
         * @type {HTMLElement} モーダルの開閉を制御するボタン要素
         */
        this.button = <HTMLElement>base.querySelector(`.${baseName}__button`);

        /**
         * @type {HTMLElement} ボタン内のテキスト要素
         */
        this.buttonText = <HTMLElement>base.querySelector(`.${baseName}__button__text`);

        /**
         * @type {NodeList} モーダル内のフォーカス可能な要素群
         */
        this.focusableElement = <NodeList>base.querySelectorAll('a[href], area[href], input, select, textarea, button, output, video, audio, object, embed, iframe, [tabindex], [onclick]');

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
         * @type {String} モーダルが開いたときに付与される class 属性名
         */
        this.openClass = '-modal-open';


        /**
         * @type {String} ユニークな識別子
         */
        this.uniquId = `${baseName}__${v4()}`;

        /**
         * @type {Number} window の縦軸位置が入る
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
    }

    /**
     * イベントのバインド登録
     * @return {Void}
     */
    bindEvents() {
        this.button.addEventListener('click', () => {
            this.button.getAttribute('aria-expanded') === 'false'
                ? this.open()
                : this.close();
        });
        this.modalOverlay.addEventListener('click', () => this.close());
        document.addEventListener('keydown', (e) => {
            if (
                (e.key === 'Escape' || e.key === 'Esc')
                &&
                this.modalBody.getAttribute('aria-hidden') === 'false'
            ) {
                this.close();
            };
        })
        this.firstFocusableElement.addEventListener('focusout', (e) => {
            // フォーカスした先がモーダル内の要素だった場合
            this.focusableElement.forEach((element: Object) => {
                if (Object.is(element, e.relatedTarget)) return;
            });

            this.lastFocusableElement.focus();
        })
        this.lastFocusableElement.addEventListener('focusout', (e) => {
            // フォーカスした先がモーダル内の要素だった場合
            this.focusableElement.forEach((element: Object) => {
                if (Object.is(element, e.relatedTarget)) return;
            });

            this.firstFocusableElement.focus();
        })
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
        this.button.setAttribute('aria-expanded', 'true');
        this.buttonText.textContent = '閉じる';
        this.firstFocusableElement.focus();
    }

    /**
     * モーダルを閉じる
     * @return {Void}
     */
    close() {
        this.body.classList.remove(this.openClass);
        this.body.style.top = '';
        this.modalBody.setAttribute('aria-hidden', 'true');
        this.button.setAttribute('aria-expanded', 'false');
        this.buttonText.textContent = '閉じる';
        window.scrollTo(0, this.windowYPosition);
    }
}
