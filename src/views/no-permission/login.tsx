import {defineComponent, reactive} from 'vue'
import { useRouter } from 'vue-router'
import './no-permission-style.less'
import { useForm } from '@ant-design-vue/use'
import formRules from '../../utils/formRules'
import { UserOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import { LOGIN } from '../../store/modules/public'
export default defineComponent({
  setup () {
    // 登录表单
    const loginInfo = reactive({
      loginName: 'admin',
      loginPassword: '123456',
      loginCode: '4436'
    })
    // 表单验证
    const loginRules = reactive({
      loginName: formRules.blur,
      loginPassword: formRules.blur
    })
    // 使用 Form.create 处理表单使其具有自动收集数据并校验的功能
    const { resetFields, validate, validateInfos } = useForm(loginInfo, loginRules);
    // 路由实例
    const router = useRouter();
    // vuex
    const store = useStore();
    const { dispatch, state } = store;
    const { Public } = state;
    // 提交表单
    const onSubmit = () => {
      validate().then(async value => {
        await dispatch(LOGIN,{
          username: value.loginName,
          password: value.loginPassword
        })
        if(Public.isLoginSuccess){
          localStorage.setItem('token', Public.userInfo.jwtToken);
          localStorage.setItem('userinfo', JSON.stringify(Public.userInfo));
          router.push('/board/dashboard')
        }
        // console.log(Public.isLoginSuccess)
        // router.push('/board/dashboard')
      }).catch(e => {
        console.log(e)
      })
    }
    
    
    return () => <div class="login-container">
      <div class="login-form-box">
        <h1>ZP-Admin</h1>
        <a-form wrapper-col={{span: 20, offset: 2}}>
        <a-form-item rules={validateInfos.loginName}>
          <a-input v-model={[loginInfo.loginName, 'value']} prefix={<UserOutlined/>} />
        </a-form-item>
          <a-form-item rules={validateInfos.loginPassword}>
            <a-input v-model={[loginInfo.loginPassword, 'value']} prefix={<EyeInvisibleOutlined />} />
          </a-form-item>
        {/*<a-form-item label="Activity zone" v-bind="validateInfos.region">*/}
        {/*  <a-select v-model:value="modelRef.region" placeholder="please select your zone">*/}
        {/*    <a-select-option value="shanghai">*/}
        {/*      Zone one*/}
        {/*    </a-select-option>*/}
        {/*    <a-select-option value="beijing">*/}
        {/*      Zone two*/}
        {/*    </a-select-option>*/}
        {/*  </a-select>*/}
        {/*</a-form-item>*/}
        {/*<a-form-item label="Activity type" v-bind="validateInfos.type">*/}
        {/*  <a-checkbox-group v-model:value="modelRef.type">*/}
        {/*    <a-checkbox value="1" name="type">*/}
        {/*      Online*/}
        {/*    </a-checkbox>*/}
        {/*    <a-checkbox value="2" name="type">*/}
        {/*      Promotion*/}
        {/*    </a-checkbox>*/}
        {/*    <a-checkbox value="3" name="type">*/}
        {/*      Offline*/}
        {/*    </a-checkbox>*/}
        {/*  </a-checkbox-group>*/}
        {/*</a-form-item>*/}
        <a-form-item >
        <a-button type="primary" onClick={onSubmit}>
        登录
      </a-button>
      <a-button style="margin-left: 10px;" onClick={resetFields}>
      重置
    </a-button>
  </a-form-item>
  </a-form>
      </div>
    </div>
  }
})
