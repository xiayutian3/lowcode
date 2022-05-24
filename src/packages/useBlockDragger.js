export function useBlockDragger (focusData){
  //初始化位置
  let dragState = {
    startX: 0,
    startY: 0,
  };
  //绑定拖拽事件
  const mousedown = (e) => {
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      //记录每一个选中的位置
      startPos: focusData.value.focus.map(({ top, left }) => ({ top, left })),
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
    mousedown
  }
}