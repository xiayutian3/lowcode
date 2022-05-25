import { computed,ref } from "vue";
export function useFocus(data, callback) {
  //表示没有任何一个被选中(记录最后选中的组建的索引)
  const selectIndex = ref(-1);

  //最后选中的组件 (用来做辅助线)
  const lastSelectBlock = computed(()=>{
    return data.value.blocks[selectIndex.value]
  })

  //清空focus
  const clearBlockFocus = () => {
    data.value.blocks.forEach((block) => (block.focus = false));
  };
  //按下点击
  const blockMousedown = (e, block,index) => {
    e.preventDefault();
    e.stopPropagation();
    //按住shift + 点击事件
    if (e.shiftKey) {
      if (focusData.value.focus.length <= 1) {
        block.focus = true; //当前只有一个节点被选中时，再次按住shift键也不会切换状态
      } else {
        block.focus = !block.focus;
      }
    } else {
      //block上我们规划一个属性 focus 获取焦点后就将focus变为true
      if (!block.focus) {
        clearBlockFocus();
        block.focus = true; //要清空其他人的focus属性，在设置自己的focus
      } // 当自己已经被选中了，再次点击还输选中状态
    }
    selectIndex.value = index; 
    //按下完成后，获取选中的组件,调用回调
    callback(e);
  };

  //内容区域点击，取消组件选中
  const containerMousedown = () => {
    clearBlockFocus();
    selectIndex.value = -1; 
  };

  //移动获取焦点的组件
  //计算选中的组件
  const focusData = computed(() => {
    let focus = [];
    let unfocused = [];
    data.value.blocks.forEach((block) =>
      (block.focus ? focus : unfocused).push(block)
    );
    return {
      focus,
      unfocused,
    };
  });
  return {
    blockMousedown,
    focusData,
    // clearBlockFocus,
    containerMousedown,
    lastSelectBlock
  };
}
