export default class TuiEvents {
  _TuiEvents = {}
  emit(name,...data){
    if(!this._TuiEvents[name]){
      return
    }
    this._TuiEvents[name].forEach((v)=>{
      v.fun(...data)
      if(v.count > 0){
        v.count -= 1
      }
    })
    this._TuiEvents[name] = this._TuiEvents[name].filter((v)=>{
      return v.count != 0
    })
  }
  on(eName,fun,count = -1){
    if(!eName){
      return
    }
    let nameInfo = eName.split('.')
    let name = nameInfo[0]
    if(!this._TuiEvents[name]){
      this._TuiEvents[name] = []
    }
    this._TuiEvents[name].push({
      fun:fun,
      count:count,
      key:nameInfo[1],
    })
  }
  once(name,fun){
    this.on(name,fun,1)
  }
  off(eName,fun){
    if(!eName){
      return
    }
    let nameInfo = eName.split('.')
    let name = nameInfo[0]
    let key = nameInfo[1]
    if(!this._TuiEvents[name]){
      return
    }
    if(!key){
      if(!fun){
        this._TuiEvents[name] = undefined
        return
      }
      this._TuiEvents[name] = this._TuiEvents[name].filter((v)=>{
        return v.fun != fun
      })
      return
    }

    if(key){
      if(fun){
        this._TuiEvents[name] = this._TuiEvents[name].filter((v)=>{
          return v.key != key && v.fun == fun
        })
        return
      }
      this._TuiEvents[name] = this._TuiEvents[name].filter((v)=>{
        return v.key != key
      })
    }
  }
}

