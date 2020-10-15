declare interface ABC {
  ():MM
}

declare interface MM {
  get:(a:number)=>number
}

// declare function e(): ABC

function abc(): MM{
  return  mm()
}


function mm():MM {
  return {
    get(a){
      return a;
    }
  }
}


export =  abc;
