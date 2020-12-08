import { defineComponent, reactive, ref } from 'vue'
import { RouterView, useRouter, useRoute, RouteRecordRaw } from 'vue-router'
import { userRoutes } from '../router'
import './layout.less'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
const styles = {
  aLayoutSider: {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    width: '256px',
    left: 0
  },
  aLayout: {
    marginLeft: '200px',
    background: '#fff',
    transition: 'margin-left .15s ease-out',
    // transitionTimingFunction: ''
  },
  aLayout2: {
    marginLeft: '80px',
    background: '#fff',
    transition: 'margin-left .15s ease-out',

  },
  aLayoutHeader: {
    background: '#fff',
    padding: 0,
    paddingLeft: '22px',
    paddingRight: '36px',
    borderBottom: '1px solid #e2e2e2'
  },
  aLayoutContent: {
    // margin: '24px 16px 0',
    height: `calc(100vh - 124px)`,
    overflowY: `scroll`,
    padding: '16px'
  },
  mainContent: {
    padding: '24px',
    background: '#fff',
    textAlign: 'center'
  },
  aLayoutFooter: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    height: '60px'
  }
}

export const SubMenu = defineComponent({
  name: 'SubMenu',
  props: {
    menuInfo: {
      type: Object,
      default: () => ({})
    },
    collapsed: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props) {
    return () => <a-sub-menu key={props.menuInfo.key} title={<span><MenuUnfoldOutlined />{!props.collapsed?props.menuInfo.meta.title:''}</span>}>
      {/* <div>

      </div> */}
      {
        props.menuInfo.children.map((route: { path: string, meta: { title: string }, children: string[] }, index: string) => <div key={route.path}>
          {
            !route.children ? <div>
              <a-menu-item key={route.path}>
                <span>{route.meta ? route.meta.title : ''}</span>
              </a-menu-item>
            </div> :
              <div>
                <sub-menu menu-info={route} key={route.path} collapsed={props.collapsed}/>
              </div>
          }
        </div>)
      }
    </a-sub-menu>
  }
})
export default defineComponent({
  components: {
    'sub-menu': SubMenu
  },
  setup() {
    /**
     * 路由
     */
    // 路由变量
    const route = useRoute();
    const router = useRouter();
    // 路由钩子
    router.afterEach((to) => {
      selectedKeys = reactive([to.path])
    })
    // 路由
    // const userRoutes = reactive(router.getRoutes());
    console.log(userRoutes)
    /**
     * 变量reactive
     */
    // 选中的导航
    let selectedKeys:string[] = reactive([route.path])
    // 默认选中的导航
    const defaultSelectedKeys = reactive([route.path])
    // 默认打开的菜单
    const defaultOpenKeys = reactive([route.matched[0].path])
    /**
     * 变量ref
     */
    // 导航栏收缩
    let collapsed = ref(false)
    const text = ref('text')
    /**
     * 方法
     */
    // 路由跳转
    const goTo = (route: { key: string }) => {
      router.push(route.key)
    }
    // 导航栏收缩
    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value;
      // collapsed = ref(!collapsed.value)
    }
    // 退出
    const exit = () => {
      localStorage.clear();
      router.replace('/login')
    }
    return () => <>
    <a-layout id="components-layout-demo-fixed-sider">
      <a-layout-sider style={styles.aLayoutSider} collapsed={collapsed}>
        <div class="logo">{collapsed.value?'奇':'奇云CMS'}</div>
        <a-menu onClick={goTo} theme="dark" mode="inline" inline-collapsed={collapsed}  selectedKeys={selectedKeys} default-selected-keys={defaultSelectedKeys} default-open-keys={defaultOpenKeys}>
          {
            userRoutes.map((route, index) => <div key={route.path}>
              {
                !route.children ? <div>
                  <a-menu-item key="item.key">
                    <span>{route.meta ? route.meta.title: ''}</span>
                  </a-menu-item>
                </div> : <sub-menu menu-info={route} key={route.path} collapsed={collapsed.value} />
              }
            </div>)
          }
        </a-menu>
      </a-layout-sider>
      <a-layout style={collapsed.value?styles.aLayout2:styles.aLayout}>
        <a-layout-header style={styles.aLayoutHeader}>
          <a-button type="primary" onClick={toggleCollapsed} style="margin-bottom: 16px">
            {
              collapsed.value?<MenuUnfoldOutlined />:<MenuFoldOutlined />
            }
          </a-button>
          <div class="user">

            <a-dropdown overlay={<a-menu>
              <a-menu-item key="0">
                <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/"
                >个人信息</a
                >
              </a-menu-item>
              <a-menu-item key="1">
                <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/"
                >修改密码</a
                >
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="2" onClick={exit}>
                退出登录
              </a-menu-item>
            </a-menu>}>
              <a class="ant-dropdown-link" onClick={e => e.preventDefault()}><a-avatar size={36} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> ZhangpingCloud<DownOutlined /> </a>

            </a-dropdown>
          </div>
        </a-layout-header>
        <a-layout-content style={styles.aLayoutContent}>
            <RouterView />
        </a-layout-content>
        <a-layout-footer style={styles.aLayoutFooter}>
          Ant Design ©2018 Created by Ant UED
        </a-layout-footer>
      </a-layout>
    </a-layout>
    </>
  }
})
