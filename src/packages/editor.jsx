import { defineComponent, computed, inject, ref, emits } from "vue";
import "./editor.scss";
import EditorBlock from "./editor-block";
import deepcopy from 'deepcopy'

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
            alignCenter:true, //希望拖动松手的时候，组件居中显示
          },
        ],
      };

      //清空数据
      currentComponent = null;
    };

    //拖拽事件
    const containerRef = ref(null);
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
            >
              {data.value.blocks.map((block) => (
                <EditorBlock block={block}></EditorBlock>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
