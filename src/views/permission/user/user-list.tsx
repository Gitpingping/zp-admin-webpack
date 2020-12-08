import { defineComponent } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  setup () {
    console.log(useStore())
    return () => <>{new Array(100).fill('test').map(d => <p>{d}</p>)}</>
  }
})
