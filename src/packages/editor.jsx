import { defineComponent, computed, inject, ref, emits } from "vue";
import "./editor.scss";
import EditorBlock from "./editor-block";
import deepcopy from "deepcopy";
import { useMenuDragger } from "./useMenuDragger";
import { useFocus } from "./useFocus";
import { useBlockDragger } from "./useBlockDragger";
import {useCommand} from "./useCommand";

export default defineComponent({
  props: {
    modelValue: {
      type: Object,
    },
  },
  emits: ["update:modelValue"], //要触发的事件
  setup(props, ctx) {
    const data = computed({
      get() {
        return props.modelValue;
      },
      set(newVal) {
        ctx.emit("update:modelValue", deepcopy(newVal));
      },
    });
    // console.log('props: ', data.value);

    const containerStyles = computed(() => ({
      width: data.value.container.width + "px",
      height: data.value.container.height + "px",
    }));

    //获取传入的组件配置
    const config = inject("config");

    const containerRef = ref(null);

    // 1.拖拽hook  菜单的拖拽功能
    const { dragstart, dragend } = useMenuDragger(containerRef, data);

    // 2.实现获取焦点，选中后可能直接就进行拖拽了

    let { blockMousedown, focusData, containerMousedown,lastSelectBlock } = useFocus(
      data,
      (e) => {
        //获取焦点后进行拖拽
        mousedown(e);
      }
    );
    // 2.1 实现组件拖拽,传入最后选中的组件，做辅助线
    const { mousedown,markLine } = useBlockDragger(focusData,lastSelectBlock,data);

    // 3.实现拖拽多个元素的功能
    // //内容区域点击，取消组件选中(已移动到 useFocus。js中)
    // const containerMousedown = () => {
    //   clearBlockFocus();
    // };


    //记录每次的操作，方便回退 ,将源数据传入
    const {commands} = useCommand(data)  //[]
    //中间上边区域的菜单项
    const buttons = [
      {label:"撤销",icon:'icon-back',handler:() =>commands.undo()},
      {label:"重做",icon:'icon-forward',handler:() =>commands.redo()},
    ]


    return () => (
      <div class="editor">
        <div class="editor-left">
          {/* 根据注册列表，渲染对应的内容  可以实现h5的拖拽*/}
          {config.componentList.map((component) => (
            <div
              class="editor-left-item"
              draggable
              onDragstart={(e) => dragstart(e, component)}
              onDragend={dragend}
            >
              <span>{component.label}</span>
              <div>{component.preview()}</div>
            </div>
          ))}
        </div>
        <div class="editor-top">
          {
            buttons.map((btn,index) => {
              return <div class="editor-top-button" onClick={btn.handler}>
                <i class={btn.icon}></i>
                <span>{btn.label}</span>
              </div>
            })
          }
        </div>
        <div class="editor-right"></div>
        <div class="editor-container">
          {/*  负责产生滚动条 */}
          <div class="editor-container-canvas">
            {/* 产生内容区域 */}
            <div
              class="editor-container-canvas__content"
              style={containerStyles.value}
              ref={containerRef}
              onMousedown={containerMousedown}
            >
              {data.value.blocks.map((block,index) => (
                <EditorBlock
                  class={block.focus ? "editor-block-focus" : ""}
                  block={block}
                  onMousedown={(e) => blockMousedown(e, block,index)}
                ></EditorBlock>
              ))}

              {/* 两根辅助线 */}
              {markLine.x !== null && <div class="line-x" style={{left:markLine.x + 'px'}}></div>}
              {markLine.y !== null && <div class="line-y" style={{top:markLine.y + 'px'}}></div>}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
