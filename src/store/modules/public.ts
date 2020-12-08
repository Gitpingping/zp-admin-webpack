import { ActionContext,MutationPayload } from 'vuex'
import * as PublicApis from '../../apis/public'
import * as PublicTypes from '../../interface/public'
export interface PublicState {
    loginInfo: {
        loginName: string,
        password: string
    },
    isLoginSuccess: boolean,
    userInfo: {}
}
export const LOGIN = 'LOGIN';

export const Public = {
  state: {
      loginInfo: {
          loginName: '',
          password: ''
      },
      // 是否登录成功
      isLoginSuccess: false,
      // 用户信息
      userInfo: {}
  },
  mutations: {
      [LOGIN](state:PublicState, payload: MutationPayload){
        state.userInfo = payload;
        state.isLoginSuccess = true;
      }
  },
  actions: {
    async [LOGIN] (context:ActionContext<PublicState,any>, payload:PublicTypes.login){
        // console.log(payload)
        const res = await PublicApis.login(payload)
        context.commit(LOGIN,res)
    }
  },
  modules: {
  }
}
