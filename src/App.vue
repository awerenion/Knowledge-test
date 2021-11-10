<template>
  <div id="app">
    <div v-if="quest">
      <h1 class="question">{{ normalizeText(quest.question) + '?' }}</h1>

      <div class="answer_list">
        <div
          class="container"
          v-for="answer in quest.answers"
          :key="answer"
        >
          <label class="answer_container">
            <input
              class="answer_input"
              type="radio"
              name="answer"
              :ref="answer"
              :value="answer"
            >
            <div class="answer">{{ normalizeText(answer) }}</div>
          </label>
        </div>
      </div>
      <div>
        <button
          class="btn"
          @click="nextQuestion"
         >
          <span>Next</span>
         </button>
      </div>
    </div>
    <div
      :send="send()"
      v-if="isShowResult"
    >
      Правильных ответов: {{ correctAnswers }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  async created() { 
    await this.$store.dispatch('getQuestions')
  },
  computed: {
    ...mapGetters({
      questions: 'questionsWithAnswers',
      indexQuest: 'currentQuest',
      correctAnswers: 'correctAnswers'
    }),
    quest() {
      return this.questions[this.indexQuest] || null
    },
    isShowResult() {
      if(this.questions.length > 1) {
        return this.questions.length <= this.indexQuest
      }
    }
  },
  methods: {
    normalizeText(text) {
      return text.replace(/(&quot|\;|&#039|\&degF|\&aacute|\.|\?|\&amp|\&eacute)/g,"")
    },
    nextQuestion() {
      const currentAnswer = Object.values(this.$refs).reduce( (acc, val) => { 
        if(val[0] && val[0].checked) {
          return acc + val[0].defaultValue
        } 
        return acc 
      }, '')
      if (currentAnswer) {
        this.checkAnswer(currentAnswer)
        this.$store.dispatch('nextQuestion')
      }
    },
    checkAnswer(answer) {
      this.$store.dispatch('addAnswer', this.quest.correct_answer === answer)
    },
    async send() {
      if(this.questions.length <= this.indexQuest) {
        const res = await fetch('http://localhost:8080/', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          correctAnswers: this.correctAnswers
        }),
      })
      console.log(res)
      }
    }
  }
}
</script>

<style>
html {
  overflow: hidden;
}

body {
  background: url('assets/img/trees.png');
  font-family: 'Poppins', sans-serif;
}

#app {
  margin-top: -5%;
  max-width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.answer_list {
  display: grid;
  grid-template-columns: repeat(2, 250px [col-start]);
  list-style-type: none;
  margin-left: calc(50% - 300px) ;  
  padding-left: 0;
  white-space: nowrap;
  position: relative;
  margin-top: 15px;
}

.answer_input { 
  box-sizing: border-box;
}

.answer_container {
  display: flex;
  margin-left: 42%;
  margin-top: 20px;
  align-items: center;
}

.answer {
  margin-left: 10px;
  max-width: 250px;
  font-size: 18px;
  text-align: center;
}

.btn {
  background-color: Transparent;
  background-repeat:no-repeat;
  background-image: linear-gradient(45deg, #6ab1d7 0%, #33d9de 55%, #002878 100%);
  background-position: 100% 0;
  background-size: 200% 200%;
  cursor:pointer;
  overflow: hidden;
  outline:none;
  display: inline-block;
  padding: 5px 20px;
  border-radius: 30px;
  font-size: 14px;
  color: white;
  box-shadow: 0 16px 32px 0 rgba(0, 40, 120, .35);
  transition: .5s;
  margin-top: 25px;
  border: none;
}

.btn:hover {
  box-shadow: 0 0 0 0 rgba(0, 40, 120, 0);
  background-position: 0 0;
}

.question {
  width: 100vw;
}

span {
  font-weight: 200;
}

</style>
