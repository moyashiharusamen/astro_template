<template>
  <div class="wrap">
    <dl
      class="result"
      ref="result"
    >
      <div
        v-for="item in answers"
        :key="item"
      >
        <dt>
          <span class="num">{{ item.id }} .</span>
          <span class="text">{{ item.title }}</span>
        </dt>
        <dd>{{ item.answer }}</dd>
      </div>
    </dl>

    <div
      class="displayArea"
      ref="displayArea"
    ></div>

    <a
      href="/checker/"
      @click="removeStorage()"
    >
      診断ページに戻る
    </a>
  </div>
</template>

<script>
import html2canvas from "html2canvas";

/** @module CheckerResult */
export default {
  name: "CheckerResult",

  data() {
    return {
      /**
       * @type {string[]} 回答群
       */
      answers: []
    };
  },

  mounted() {
    this.getAnswers();
  },

  updated() {
    this.toImage(this.$refs.result, this.$refs.displayArea);
    this.removeContent(this.$refs.result);
  },

  methods: {
    /**
     * sessionStorage の回答を取得
     * @return {Void}
     */
    getAnswers() {
      if (!sessionStorage.getItem("answer")) {
        location.href = "/checker/";
        return;
      }

      const storage = sessionStorage.getItem("answer");
      const content = JSON.parse(storage);
      this.answers = content;
    },

    /**
     * sessionStorage を削除
     * @return {Void}
     */
    removeStorage() {
      sessionStorage.removeItem("answer");
    },

    /**
     * HTML を画像化し、それを表示する
     * @param {HTMLElement} [target] 画像化の対象となる HTML 要素
     * @param {HTMLElement} [displayArea] HTML を画像化したものを表示する場所となる要素
     * @return {Void}
     */
    toImage(target, displayArea) {
      html2canvas(target)
        .then(canvas => {
          const imgSrc = canvas.toDataURL("image/png", "1.0");
          const img = new Image();

          img.src = imgSrc;
          displayArea.appendChild(img);
        })
        .catch(error => {
          console.error("画像化できませんでした", error);
        });
    },

    /**
     * HTML 要素を削除する
     * @param {HTMLElement} [target] 削除の対象となる HTML 要素
     * @return {Void}
     */
    removeContent(target) {
      target.remove();
    }
  }
};
</script>

<style scoped lang="scss">
@use "../../style/global" as g;

// ---------- 基底要素 ----------
.wrap {
  padding: 0 0 50px;
}

// ---------- 結果要素 ----------
.result {
  width: 100%;
  max-width: 300px;
  margin: 30px auto;
  border: none !important;
}

.result dt,
.result dd {
  padding: 5px 10px 20px !important;
  border: none !important;
  word-break: break-all;
}

.result dt {
  font-weight: 700;
  background: #eee;
}

.result dt > .num {
  flex-shrink: 0;
}

.result dt > .text {
  margin-left: 0.5em;
}

// ---------- 結果表示要素 ----------
.displayArea {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}
</style>
