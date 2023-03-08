/** ============================================================
 *  @fileoverview アコーディオンを制御するJS
 *  ============================================================ */

import Events from "events";
import _ from "lodash";
import Toggle from "./Toggle";

/**
 * @class Accordion
 */
export default class Accordion {
  /**
   * @property {string} ブロック名
   */
  static baseName: string = "accordion";

  events: Object;
  toggles: Toggle[];

  /**
   * インスタンスを生成
   * @param {Object} element 基底要素ノード、またはそれを探すための文字列
   */
  constructor(element: Object, rootName: string = Accordion.baseName) {
    const name = rootName;

    /**
     * @type {HTMLElement} 基底要素ノード
     */
    const base = <HTMLElement>element;

    /**
     * @type {HTMLElement} 基底要素ノード
     */
    const item = base.querySelectorAll(".accordionItem");

    this.events = new Events.EventEmitter();

    /**
     * @type {Toggle[]} Toggle のインスタンス群
     */
    this.toggles = [...item].map(element => new Toggle(element, "accordionItem"));

    this.bindEvents();
  }

  /**
   * イベントのバインド登録
   * @return {Void}
   */
  bindEvents() {
    this.toggles.forEach(toggle => {
      toggle.on("open", () => this.onOpen(toggle));
    });
  }

  /**
   * Toggle のいずれかが開かれたら、それ以外の Toggle を閉じる
   * @param {Object} toggle  "open" イベントが発生した（いま開かれた） Toggle インスタンス
   * @return {Void}
   */
  onOpen(toggle: object) {
    _.without(this.toggles, toggle).forEach((_toggle: any) => _toggle.close());
  }
}
