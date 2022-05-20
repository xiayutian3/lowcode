import { defineComponent,computed,inject, onMounted ,ref} from "vue";

export default defineComponent({
  props: {
    block: {
      type: Object,
    },
  },
  setup(props) {
    const blockStyles = computed(()=>({
      top:`${props.block.top}px`,
      left:`${props.block.left}px`,
      zIndex: props.block.zIndex
    }))
    //获取传入的组件配置
    const config = inject('config')
    // console.log('config: ', config);

    const blockRef = ref(null)
    onMounted(()=>{
      //拖拽渲染组件的时候居中显示，调整位置
      let {offsetWidth,offsetHeight} = blockRef.value
      if(props.block.alignCenter){ //说明是拖拽松手的时候才渲染的，其他之前渲染的位置不需要改变
        props.block.left = props.block.left - offsetWidth/2
        props.block.top = props.block.top - offsetHeight/2 //原则上重新派发事件（vue3proxy，可以直接这么改）

        props.block.alignCenter = false
      }

    })

    return () => {
      //渲染key 对应的组件
      const component = config.componentMap[props.block.key]
      const RenderComponent = component.render()
      return <div class="editor-block" style={blockStyles.value} ref={blockRef}>
        {RenderComponent}
      </div>;
    };
  },
});
