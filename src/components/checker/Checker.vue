<template>
    <div>
        <div class="content" ref="content">
            <transition
                name="slide"
                @enter="slideEnter"
                @leave="slideLeave"
            >
                <div class="content__inner" :key="currentQuestionID">
                    <div class="num">
                        <p><span>Q</span> {{ currentQuestion.id }} </p>
                    </div>

                    <div class="title">
                        <p>{{ currentQuestion.title }}</p>
                    </div>

                    <div class="choice">
                        <button
                            type="button"
                            class="choice__button"
                            role="checkbox"
                            ref="choiceButton"
                            aria-checked="false"
                            :data-value-title="currentQuestion.title"
                            v-for="item in currentQuestion.choice"
                            :key="item"
                            :data-value-answer="item"
                            @click="clickChoiceButton($event)"
                        >
                            {{ item }}
                        </button>
                    </div>
                </div>
            </transition>
        </div>

        <div class="button">
            <button
                type="button"
                class="prev"
                :disabled="disabledPrevButton"
                :aria-disabled="disabledPrevButton"
                @click="clickPrevButton();"
            >前へ</button>

            <button
                type="button"
                class="next"
                :disabled="disabledNextButton"
                :aria-disabled="disabledNextButton"
                @click="clickNextButton();"
            >次へ</button>
        </div>

        <div class="link">
            <transition name="result">
                <a
                    href="/checker/result/"
                    v-if="isResultButton"
                    @click="setStorage()"
                >
                    結果画面へ
                </a>
            </transition>
        </div>
    </div>
</template>

<script>

/** @module Checker */
export default {
    name: 'Checker',

    data() {
        return {
            /**
             * @type {number} 現在の表示する設問の数
             */
            currentQuestionID: 0,

            /**
             * @type {object[]} 設問群
             */
            questions: [
                {
                    id: 1,
                    title: 'ケーキは好きですか',
                    choice: ['はい', 'いいえ', 'どちらでもない']
                },
                {
                    id: 2,
                    title: 'お寿司はネタはどれが好きですか',
                    choice: ['はまち', 'サーモン', 'いくら']
                },
                {
                    id: 3,
                    title: '動物は好きですか',
                    choice: ['はい', 'いいえ']
                },
                {
                    id: 4,
                    title: '好きな動物はなんですか',
                    choice: ['犬', '猫']
                },
                {
                    id: 5,
                    title: '好きなゲームはなんですか',
                    choice: ['Apex Legends', 'Escape From Tarkov', 'ポケモンSV']
                },
            ],

            /**
             * @type {object[]} 回答群
             */
            answerContent: [],

            /**
             * @type {boolean} 前へボタンを非活性にしたいときに true にする
             */
            disabledPrevButton: true,

            /**
             * @type {boolean} 次へボタンを非活性にしたいときに true にする
             */
            disabledNextButton: true,

            /**
             * @type {boolean} 結果ページへのボタンを表示したいときは true にする
             */
            isResultButton: false,
        }
    },

    mounted() {
        sessionStorage.removeItem('answer');
    },

    computed: {
        /**
         * 現在表示されるべき設問を返す
         * @return {object}
         */
        currentQuestion() {
            return this.questions[this.currentQuestionID];
        }
    },

    methods: {
        skipQuestion(from, to) {
            if (from !== this.currentQuestionID) return

            this.currentQuestionID = to;
        },

        /**
         * currentQuestionID の値をインクリメントする
         * @return {Void}
         */
        incrementId() {
            if (this.isLastQuestion()) return;

            this.currentQuestionID++;
            this.checkButton();
        },

        /**
         * currentQuestionID の値をデクリメントする
         * @return {Void}
         */
        decrementId() {
            if (this.isFirstQuestion()) return;

            this.currentQuestionID--;
            this.checkButton();
        },

        /**
         * 前へ次へボタンと結果ページリンクボタンのチェックを行う
         * 最初の設問を表示しているとき、または表示されているより前の設問に回答済みの場合は、前へボタンを非活性にする
         * 最後の設問を表示しているとき、または表示されているより後の設問に回答済みの場合は、次へボタンを非活性にする
         * 最後の設問を表示しているとき、結果ページへのリンクボタンを表示する
         * @return {Void}
         */
        checkButton() {
            this.disabledPrevButton = this.isFirstQuestion() || !this.answerContent[this.currentQuestionID - 1];
            this.disabledNextButton = this.isLastQuestion() || !this.answerContent[this.currentQuestionID];
        },

        judgeResultButton() {
            this.isLastQuestion() && this.answerContent[this.currentQuestionID]
                ? this.isResultButton = true
                : this.isResultButton = false;
        },

        /**
         * 選択済みのボタンを見つけ、 aria-checked を true にする
         * @return {Void}
         */
        checkedButton() {
            const currentAnswer = JSON.parse(this.answerContent[this.currentQuestionID]);

            this.$nextTick(() => {
                this.$refs.choiceButton.map(e => {
                    if (e.textContent !== currentAnswer.answer) return;

                    e.ariaChecked = true;
                })
            })
        },

        /**
         * 前へボタンを押したとき
         * @return {Void}
         */
        clickPrevButton() {
            if (this.isFirstQuestion()) return;

            this.decrementId();
            this.checkedButton();
            this.judgeResultButton();
        },

        /**
         * 次へボタンを押したとき
         * @return {Void}
         */
        clickNextButton() {
            if (this.isLastQuestion()) return;

            this.incrementId();
            this.checkedButton();
            this.judgeResultButton();
        },

        /**
         * 選択肢ボタンを押したとき
         * @return {Void}
         */
        clickChoiceButton(e) {
            this.saveAnswer(e);
            this.incrementId();
            this.choiceChecked(e);
            this.judgeResultButton();
        },

        /**
         * 回答をデータとして保存する
         * @return {Void}
         */
        saveAnswer(e) {
            const dataAnswer = e.target.dataset.valueAnswer;
            const dataTitle = e.target.dataset.valueTitle;
            const content = JSON.stringify({ title: dataTitle, answer: dataAnswer });

            if (this.answerContent[this.currentQuestionID]) {
                // 現在の設問分の回答が配列にあれば、その回答を上書き
                this.answerContent[this.currentQuestionID] = content;
            } else {
                // 現在の設問分の回答が配列になければ、その回答を順番に設定
                this.answerContent.splice(this.currentQuestionID, 0, content);
            }
        },

        /**
         * 最初の設問を表示している場合 true が返る
         * @return {boolean}
         */
        isFirstQuestion() {
            return this.currentQuestionID === 0;
        },

        /**
         * 最後の設問を表示している場合 true が返る
         * @return {boolean}
         */
        isLastQuestion() {
            return this.questions.length - 1 === this.currentQuestionID;
        },

        /**
         * 回答を sesstionStorage に設定する
         * @return {boolean}
         */
        setStorage() {
            sessionStorage.setItem('answer', `[${this.answerContent}]`);
        },

        /**
         * 選択肢ボタンが押されたとき、該当ボタンをチェック済みにする
         * @return {Void}
         */
        choiceChecked(e) {
            this.$refs.choiceButton.map(e => e.ariaChecked = false);
            e.target.ariaChecked = true;
        },

        // transition animation
        slideEnter(el) {
            // 表示される要素の高さを設定して、アニメーション時に親要素の高さが可変するのを防ぐ
            el.style.height = `${el.clientHeight}px`;
        },

        slideLeave(el, done) {
            // 非表示にする要素の高さが残ってしまうので、0 に設定する
            el.style.height = '0';
            done();
        },
    },
};
</script>

<style scoped lang="scss">
    @use '../../style/global' as g;

    // ---------- 基底要素 ----------

    // ---------- コンテンツ要素 ----------
    .content {
        max-width: 1000px;
        margin: 0 auto;
        padding: 50px;
        border: 2px solid #333;
        overflow: hidden;

        display: flex;
        flex-wrap: wrap;
    }

    .content__inner {
        width: 100%!important;
    }

    // ---------- タイトル要素 ----------
    .num {
        font-size: 28px;
        text-align: center;
    }

    // ---------- 説明文要素 ----------
    .title {
        margin-top: 20px;
        font-size: 24px;
        text-align: center;
    }

    // ---------- 選択肢要素 ----------
    .choice {
        display: flex;
        justify-content: center;
        gap: 30px;
        margin-top: 60px;
    }

    .choice__button {
        width: calc((100% / 3) - 15px);
        padding: 20px 40px;
        text-align: center;
        border: 2px solid #333;
        border-radius: 10px;
        font-size: 18px;
        transition: border .2s ease, color .2s ease;
        position: relative;

        @include g.hover() {
            border-color: g.$base-color;
            color: g.$base-color;
        }

        // チェックアイコン
        &::before {
            content: "";
            display: block;
            width: 10px;
            height: 10px;
            margin: auto;
            background: #ddd;
            border-radius: 50vh;
            position: absolute;
            top: 0;
            left: 30px;
            bottom: 0;
            transition: background .2s ease;
        }
    }

    .choice__button[aria-checked="true"] {
        border-color: g.$base-color;
        color: g.$base-color;

        &::before {
        background: g.$base-color;
    }
    }

    // ---------- ボタン要素 ----------
    .button {
        width: 100%;
        max-width: 300px;
        margin: 50px auto 0;
        padding-bottom: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .button > button {
        display: grid;
        place-content: center;
        width: 50px;
        height: 50px;
        border: 1px solid #333;
        border-radius: 50vh;
        opacity: 1;
        cursor: pointer;
    }

    .button > button:disabled {
        opacity: .3;
        cursor: not-allowed;
    }

    .button > .prev {
        margin-right: auto;
    }

    .button > .next {
        margin-left: auto;
    }

    // ---------- リンク要素 ----------
    .link {
        display: flex;
        justify-content: center;
        margin: 0 0 50px;
    }

    .link > a {
        padding: 20px 50px;
        border: 2px solid #333;
        border-radius: 10px;
        font-size: 20px;
    }

    // ---------- アニメーション ----------
    // コンテンツ

    .slide-enter-active {
        transition: transform .5s, opacity 1s;
        transition-delay: .2s;
        transition-duration: cubic-bezier(.4,0,.6,1);
    }

    .slide-leave-enter,
    .slide-enter-to {
        transform: translateY(0);
        opacity: 1;
    }

    .slide-leave-to,
    .slide-enter-from {
        transform: translateY(30px);
        opacity: 0;
    }

    // 結果ボタン
    .result-enter-active {
        transition: transform .5s, opacity 1s;
        transition-delay: .2s;
        transition-duration: cubic-bezier(.4,0,.6,1);
    }

    .result-leave-enter,
    .result-enter-to {
        transform: translateX(0);
        opacity: 1;
    }

    .result-leave-to,
    .result-enter-from {
        transform: translateY(30px);
        opacity: 0;
    }

</style>
