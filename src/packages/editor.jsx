import { defineComponent, computed, inject, ref, emits } from "vue";
import "./editor.scss";
import EditorBlock from "./editor-block";
import deepcopy from "deepcopy";
import { useMenuDragger } from "./useMenuDragger";
import { useFocus } from "./useFocus";

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

    // 2.实现获取焦点
    let { blockMousedown, focusData,clearBlockFocus } = useFocus(data,()=>{
      console.log(focusData.value.focus)
    });

    // 3.实现拖拽多个元素的功能
    //内容区域点击，取消组件选中
    const containerMousedown = () => {
      clearBlockFocus();
    };

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
        <div class="editor-top"></div>
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
              {data.value.blocks.map((block) => (
                <EditorBlock
                  class={block.focus ? "editor-block-focus" : ""}
                  block={block}
                  onMousedown={(e) => blockMousedown(e, block)}
                ></EditorBlock>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
