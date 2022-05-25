export function useBlockDragger(focusData, lastSelectBlock) {
  //初始化位置
  let dragState = {
    startX: 0,
    startY: 0,
  };
  //绑定拖拽事件
  const mousedown = (e) => {
    const { width: BWidth, height: BHeight } = lastSelectBlock.value;

    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      //记录每一个选中的位置
      startPos: focusData.value.focus.map(({ top, left }) => ({ top, left })),
      lines: (() => {
        const { unfocused } = focusData.value; //获取其他没选中的，以他们的位置做辅助线

        let lines = { x: [], y: [] }; //计算横线的位置用y来存放（top值），x存的是纵向
        unfocused.forEach((block) => {
          const {
            top: ATop,
            left: ALeft,
            width: AWidth,
            height: AHeight,
          } = block;
          // 当此元素拖拽到和A元素top一致的时候，要显示这根辅助线，辅助线的位置就是ATop
          lines.y.push({showTop:ATop,top:ATop}); // 顶对顶
          lines.y.push({showTop:ATop,top:ATop - BHeight}) // 顶对底
          lines.y.push({showTop:ATop + AHeight/2,top:ATop + AHeight/2 - BHeight/2})  // 中对中
          lines.y.push({showTop:ATop + AHeight,top:ATop + AHeight}) // 底对顶
          lines.y.push({showTop:ATop + AHeight,top:ATop + AHeight - BHeight}) // 底对底

        });

      })(),
    };

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };
  //移动操作
  const mousemove = (e) => {
    let { clientX: moveX, clientY: moveY } = e;
    let durX = moveX - dragState.startX;
    let durY = moveY - dragState.startY;

    focusData.value.focus.forEach((block, idx) => {
      block.top = dragState.startPos[idx].top + durY;
      block.left = dragState.startPos[idx].left + durX;
    });
  };
  const mouseup = (e) => {
    //清空监听
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
  };
  return {
    mousedown,
  };
}
