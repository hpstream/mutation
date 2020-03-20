export interface MvvmOptions {
  el?: string; // 用来获取dom,
  data?: () => Record<string, any>;
  methods?: Record<string, Function>;
  render?: Function;
}

export abstract class BaseMVVM {
  protected $options: MvvmOptions;
  protected $data = {};
  protected _data = {}; // 代理使用
  methods?: Record<string, Function>;
}
