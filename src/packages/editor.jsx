import {defineComponent,computed,inject} from "vue"
import './editor.scss'
import EditorBlock from "./editor-block"

export default defineComponent({
  props:{
    modelValue: {
      type: Object
    }
  },
  setup(props) {
   
    const data = computed({
      get(){
        return props.modelValue
      },
      set(){

      }
    })
    // console.log('props: ', data.value);

    const containerStyles = computed(()=>({
      width:data.value.container.width + 'px',
      height:data.value.container.height + 'px'
    }))

    //获取传入的组件配置
    const config = inject('config')

    return ()=> <div class="editor" >
      <div class="editor-left">
        {/* 根据注册列表，渲染对应的内容 */}
        {config.componentList.map(component =>(
          <div class="editor-left-item">
            <span>{component.label}</span>
            <div>{component.preview()}</div>
          </div>
        ))}
       
      </div>
      <div class="editor-top"></div>
      <div class="editor-right"></div>
      <div class="editor-container">
         {/*  负责产生滚动条 */}
         <div class="editor-container-canvas">

            {/* 产生内容区域 */}
            <div class="editor-container-canvas__content" style={containerStyles.value}>
              {
                data.value.blocks.map(block => (
                  <EditorBlock block={block}></EditorBlock>
                ))
              }
            </div>
         </div>
      </div>
      
    </div>
  }
})