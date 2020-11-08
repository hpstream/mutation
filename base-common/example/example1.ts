import {plugin1} from "../plugin1";
import {plugin2} from "../plugin2";
import { wb } from "../wbCore";


// 使用的两种形式
// 方式一
wb.install(plugin1.name, plugin1.fn).install(plugin2.name, plugin2.fn);

// 方式二
var pluginArr = [plugin1, plugin2];
wb.use(pluginArr);

wb.abc


