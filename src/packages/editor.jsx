import {defineComponent} from "vue"
import './editor.scss'

export default defineComponent({
  props:{
    data: {
      type: Object
    }
  },
  setup(props) {
    console.log('props: ', props.data);

    return ()=> <div class="editor" >
      <div class="editor-left"></div>
      <div class="editor-top"></div>
      <div class="editor-right"></div>
      <div class="editor-container">
         {/*  负责产生滚动条 */}
         <div class="editor-container-canvas">

            {/* 产生内容区域 */}
            <div class="editor-container-canvas__content">
              内容区
            </div>
         </div>
      </div>
      
    </div>
  }
})