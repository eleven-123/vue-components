import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state () {
        return {
            currMenu: {}
        }
    },
    mutations: {
        setCurrMenu(state, currMenu){
            state.currMenu = currMenu
        }
    }
})