import React from 'react'
const cx = require('classnames');
import style from './style.css'

export default class Form extends React.Component{
  constructor(props){
    super(props);
	this.queue = []
    this.load();
    this.loop();
  }

  load(){
	const request = new XMLHttpRequest();
	request.open("GET", `/api/raw?name=${this.props.store.name()}`, true);
	request.addEventListener("loadend", ()=>{
	  this.refs.area.value = request.responseText;
	  this.props.store.loaded();
	});
	request.send(null);
  }

  loop(){
	const text = this.queue.pop();
    if(!!text){
      this.queue = [];
      this.save(text);
    } else {
      setTimeout(()=>{ this.loop()}, 500)
    }
  }

  save(text){
    const request = new XMLHttpRequest();
    request.open("POST", `/api?name=${this.props.store.name()}`, true);
	request.setRequestHeader('Content-Type', 'application/json');
    request.onreadystatechange = ()=>{
      if(request.readyState === 4){
		this.props.store.loaded();
        setTimeout(()=>{ this.loop()}, 500)
      }
    }
	request.send(JSON.stringify({text: text}));
  }

  change(ev){
    const text = ev.target.value;
    this.queue.push(text);
  }

  render(){
    return <div className={cx(style.full_height, style.left)}>
      <textarea ref='area' className={style.textarea}  onChange={(ev)=> this.change(ev) }/>
    </div>
  }
}
