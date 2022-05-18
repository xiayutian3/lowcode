<template>
  <div class="app">
    <Editor v-model="state" />
  </div>
</template>

<script>
import data from './data.json'
import { ref ,provide} from 'vue'
import Editor from './packages/editor.jsx'
import {registerConfig as config} from './utils/editor-config.jsx'


export default {
  components:{
    Editor
  },
  setup(){
     const state = ref(data)

    //将组件的配合直接传出去
    provide('config',config)
    return {
      state
    }
  }
}
</script>

<style lang="scss">
.app{
  position:fixed;
  top:20px;
  left:20px;
  right:20px;
  bottom:20px;
}
</style>
