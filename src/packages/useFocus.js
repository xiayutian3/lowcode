import {computed} from 'vue'
export function useFocus(data,callback){
     //清空focus
     const clearBlockFocus = () => {
      data.value.blocks.forEach((block) => (block.focus = false));
    };
    //按下点击
    const blockMousedown = (e, block) => {
      e.preventDefault();
      e.stopPropagation();
      //按住shift + 点击事件
      if (e.shiftKey) {
        block.focus = !block.focus;
      } else {
        //block上我们规划一个属性 focus 获取焦点后就将focus变为true
        if (!block.focus) {
          clearBlockFocus();
          block.focus = true; //要清空其他人的focus属性，在设置自己的focus
        } else {
          block.focus = false;
        }
      }
      //按下完成后，获取选中的组件,调用回调
      callback()

    };

    //移动获取焦点的组件
    //计算选中的组件
    const focusData = computed(()=>{
      let focus = []
      let unfocused = []
      data.value.blocks.forEach(block => (block.focus?focus:unfocused).push(block))
      return {
        focus,
        unfocused
      }
    })
    return {
      blockMousedown,
      focusData,
      clearBlockFocus
    }
}