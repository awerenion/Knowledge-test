import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {
    async getQuestions ({ commit }) {
      const response = await fetch( 
        "https://opentdb.com/api.php?amount=10&type=multiple"
      )
      const quests = await response.json()
      commit('setQuestions', quests.results)
    },
    nextQuestion ({ commit }) {
      commit('nextQuestion')
    },
    addAnswer ({ commit }, answer) {
      commit('addAnswer', answer)
    }
  },
  mutations: {
    setQuestions (state, questions) {
      state.questions = questions
    },
    nextQuestion (state) {
      state.currentQuestion = ++state.currentQuestion
    },
    addAnswer(state, answer) {
      state.correctAnswers += answer
    }
  },
  state: { 
    questions: [],
    correctAnswers: 0,
    currentQuestion: 0 
   },
  getters: {
    questionsWithAnswers: state => state.questions.map( quest => { 
      const answers = [quest.correct_answer, ...quest.incorrect_answers].sort(() => Math.random() - 0.5)
      quest.answers = answers
      return quest
     }),
    currentQuest: state => state.currentQuestion,
    correctAnswers: state => state.correctAnswers
  }
})
