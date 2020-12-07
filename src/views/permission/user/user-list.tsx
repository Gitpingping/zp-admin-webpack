import { defineComponent } from 'vue'
export default defineComponent({
  setup () {
    return () => <>{new Array(100).fill('test').map(d => <p>{d}</p>)}</>
  }
})
