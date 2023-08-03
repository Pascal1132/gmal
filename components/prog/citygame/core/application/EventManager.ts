export default class EventManager{
    private static _instance:EventManager;
    private _eventList:Map<string,Array<Record<string, Function>>>;
    constructor(){
        this._eventList = new Map<string,Array<Record<string, Function>>>();
    }
    public static getInstance():EventManager{
        if(!EventManager._instance){
            EventManager._instance = new EventManager();
        }
        return EventManager._instance;
    }
    public addEventListener(type:string,listener:Function, listenerId:string):void{
        if(!this._eventList.has(type)){
            this._eventList.set(type,[]);
        }
        let list:Array<Record<string, Function>> = this._eventList.get(type);
        if(list.findIndex((item)=>item[listenerId] == listener) == -1){
            list.push({[listenerId]:listener});
        }
    }

    public dispatchEvent(type:string,...args:any[]):void{
        if(this._eventList.has(type)){
            let list:Array<Record<string, Function>> = this._eventList.get(type);
            list.forEach((item)=>{
                for(let key in item){
                    item[key](...args);
                }
            });
        }
    }
    public hasEventListener(type:string):boolean{
        return this._eventList.has(type);
    }
    public removeAllEventListener():void{
        this._eventList.clear();
    }
}