import Watcher from "./Watcher";
let depId = 1;
export default class Dep {
  public id: number;
  private subs: Watcher[] = [];
  public static target : Watcher;

  constructor(){

  }
  public add(watcher:Watcher):void{
    this.subs.push(watcher);
  }

  public depend():void{
    this.subs.forEach(sub => {
       const target = Dep.target;
       if(!target) return ;
       target.addDep(this)
       this.add(target)
    });
  }
  notify(){
    this.subs.forEach(n => n.update());
  }
}
