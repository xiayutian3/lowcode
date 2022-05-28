import { events } from "./events";
import deepcopy from "deepcopy";
import { onUnmounted } from "vue";

export function useCommand(data) {
  const state = {
    //前进后退需要指针
    current: -1, //前进后退的索引值
    queue: [], //存放所有的操作命令
    commands: {}, // 制作命令和执行功能一个映射表 撤销 undo:()=>{}  重做redo:()=>{}
    commandArray: [], //存放所有的命令
    destroyArray: [], //销毁函数列表
  };

  const registry = (command) => {
    state.commandArray.push(command);
    state.commands[command.name] = () => {
      // 命令名字对应执行函数
      // debugger
      const { redo, undo } = command.execute();
      redo();
      //把redo之后的操作存到队列里去，方便能实现前进后退功能
      if (!command.pushQueue) {
        //不需要放到队列中
        return;
      }
      let { queue, current } = state;

      //如果先放了 组件1-》组件2-》组件3-》组件4-》撤回-》撤回-》组件3
      // 结果 ：组件1-》组件2-》组件3
      if (queue.length > 0) {
        queue = queue.slice(0, current + 1); //可能在放置过程中有撤销操作，所有根据当前最新的current值来计算新的 queue
        state.queue = queue;
      }

      queue.push({ redo, undo }); // 保存指令的前进（redo），后退（undo）
      state.current = current + 1;
      console.log(queue);
    };
  };

  // 注册我们需要的命令
  registry({
    name: "redo", //重做（前进）
    keyboard: "ctrl+y", //快捷键
    execute() {
      return {
        redo() {
          // console.log('重做')
          let item = state.queue[state.current + 1]; // 找到当前的下一步（就是还原操作）
          if (item) {
            item.redo && item.redo();
            state.current++;
          }
        },
      };
    },
  });
  registry({
    name: "undo", //撤销（后退）
    keyboard: "ctrl+z",
    execute() {
      return {
        redo() {
          // console.log('撤销')
          if (state.current == -1) return; //没有可以撤销的了
          let item = state.queue[state.current]; // 找到当前的上一步
          if (item) {
            item.undo && item.undo();
            state.current--;
          }
        },
      };
    },
  });
  //注册拖拽
  registry({
    //如果希望将操作放到队列中可以增加一个属性 标识等会操作要放到队列中
    name: "drag",
    pushQueue: true,
    init() {
      // 初始化操作 默认就会执行
      // debugger
      this.before = null;
      // 监控拖拽开始事件，保存状态
      const start = () => {
        //拖拽前，保存一份数据
        // debugger
        this.before = deepcopy(data.value.blocks);
      };
      // 拖拽之后需要触发对应的指令
      const end = () => {
        // debugger
        state.commands.drag();
      };
      events.on("start", start);
      events.on("end", end);

      //初始化完成后，返回关闭事件
      return () => {
        events.off("start", start);
        events.off("end", end);
      };
    },
    execute() {
      // state.commands.drag()
      // 之前的状态
      let before = this.before;
      // console.log('before: ', before);
      // 之后的状态
      let after = data.value.blocks;
      return {
        redo() {
          //默认一松手，就直接把当前事情做了 （之后）
          data.value = { ...data.value, blocks: after };
        },
        undo() {
          //前一步的 （之前）
          data.value = { ...data.value, blocks: before };
        },
      };
    },
  });

  // 绑定快捷键事件
  const keyboardEvent = (() => {
    const keyCodes = {
      90: "z",
      89: "y",
    };
    const onKeydown = (e) => {
      const { ctrlKey, keyCode } = e; //ctrl+z / ctrl+y
      let keyString = [];
      if (ctrlKey) keyString.push("ctrl");
      if (keyCode) keyString.push(keyCodes[keyCode]);
      keyString = keyString.join("+");

      state.commandArray.forEach(({ keyboard, name }) => {
        if (!keyboard) return;
        if (keyboard === keyString) {
          //调用相应指令对应的函数
          state.commands[name]();
          e.preventDefault(); //阻止默认行为
        }
      });
    };
    const init = () => {
      //初始化事件
      window.addEventListener("keydown", onKeydown);
      //返回销毁事件
      return () => {
        window.removeEventListener("keydown", onKeydown);
      };
    };
    return init;
  })();

  //收集销毁函数，并在组件卸载的时候执行销毁函数
  (() => {
    //监听键盘事件
    state.destroyArray.push(keyboardEvent());

    state.commandArray.forEach(
      (command) => command.init && state.destroyArray.push(command.init())
    );
  })();

  onUnmounted(() => {
    // 清理绑定的时间
    state.destroyArray.forEach((fn) => fn && fn());
  });

  return state;
}
