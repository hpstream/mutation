import Vue from "./../index";
import Dep from "./Dep";

let WatcherId = 1;
export default class Watcher {
	vm: Vue;
	getter: Function;
	WatcherId;
	public deps: Dep[] = [];
	id: number;
	cb?: Function;
	value:any;
	constructor(vm: Vue, getter: Function, cb?: Function) {
		this.vm = vm;
		this.getter = getter;
		this.cb = cb;
		this.id = WatcherId++;
		this.update();
	}

	/**
	 * addDep
	 */
	public addDep(dep:Dep) {
		this.deps.push(dep);
	}
	public update(){
		this.get();
	}
	public get(){
		Dep.target = this; //挂载watcher
		this.value = this.getter.call(this.vm, this.vm);
	}
}
