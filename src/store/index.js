import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state () {
        return {
            currMenu: {},
            isFold: false
        }
    },
    mutations: {
        setCurrMenu(state, currMenu){
            state.currMenu = currMenu
        },
        setFold(state, isFold){
            state.isFold = isFold
        }
    }
})