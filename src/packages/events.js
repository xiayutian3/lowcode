// vue3发布订阅库
import mitt from "mitt";
export const events = mitt(); //导出一个发布订阅的对象

// demo：
// events.emit(name)
// events.on(name,callback)
