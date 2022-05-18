import { defineComponent,computed,inject } from "vue";

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

    return () => {
      //渲染key 对应的组件
      const component = config.componentMap[props.block.key]
      const RenderComponent = component.render()
      return <div class="editor-block" style={blockStyles.value}>
        {RenderComponent}
      </div>;
    };
  },
});
