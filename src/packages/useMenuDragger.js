import {events} from './events'

export function useMenuDragger(containerRef, data) {
  //获取拖动的组件
  let currentComponent = null;
  const dragenter = (e) => {
    // 拖动类型， h5拖动的图标
    e.dataTransfer.dropEffect = "move";
  };
  const dragover = (e) => {
    //阻止默认行为
    e.preventDefault();
  };
  const dragleave = (e) => {
    // 拖动类型
    e.dataTransfer.dropEffect = "none";
  };
  const drop = (e) => {
    // console.log(currentComponent)

    let blocks = data.value.blocks; //内部已经渲染的组件
    //更新数据
    data.value = {
      ...data.value,
      blocks: [
        ...blocks,
        {
          top: e.offsetY,
          left: e.offsetX,
          zIndex: 1,
          key: currentComponent.key,
          alignCenter: true, //希望拖动松手的时候，组件居中显示
        },
      ],
    };

    //清空数据
    currentComponent = null;
  };

  //拖拽事件

  const dragstart = (e, component) => {
    // dragenter 进入元素中 添加一个移动的标识
    // dragover 在目标元素经过 必须要阻止默认行为 否则不能触发drop
    // dragleave 离开元素的时候 需要增加一个禁用标识
    // drop 松手的时候 根据拖拽的组件 添加一个组件
    containerRef.value.addEventListener("dragenter", dragenter);
    containerRef.value.addEventListener("dragover", dragover);
    containerRef.value.addEventListener("dragleave", dragleave);
    containerRef.value.addEventListener("drop", drop);
    currentComponent = component;
    //发布事件-start
    events.emit('start')
  };

  //拖拽结束,清除事件
  const dragend = () => {
    containerRef.value.removeEventListener("dragenter", dragenter);
    containerRef.value.removeEventListener("dragover", dragover);
    containerRef.value.removeEventListener("dragleave", dragleave);
    containerRef.value.removeEventListener("drop", drop);
    //发布事件-end
    events.emit('end')
  };

  return {
    dragstart,
    dragend
  }
}
