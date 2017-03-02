import React from 'react'
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
const cx = require('classnames');
const ee = require('event-emitter');

import style from './style.css'
import Form from './form'

class Store {
  constructor(){
    this.emitter = ee({});
  }

  loaded(){
	this.emitter.emit("loaded")
  }

  name(){
	return location.pathname
  }
}

class App extends React.Component {
  render(){
    return <div className={style.all}>
	  {this.props.children}
    </div>
  }
}


class Field extends React.Component{
  constructor(props){
	super(props);
	this.state = {html: ""}
	this.props.store.emitter.on("loaded", ()=>{ this.load() });
  }
  load(){
	const request = new XMLHttpRequest();
	request.open("GET", `/api/markdown?name=${this.props.store.name()}`, true);
	request.addEventListener("loadend", ()=>{
	  this.setState({html: request.responseText});
	  this.toc();
	});
	request.send(null);
  }
  toc(){
	let array = [];
	this.refs.markdown.querySelectorAll(".anchor").forEach((n)=>{
	  const h = n.parentNode;
	  const text = h.textContent.replace(/\n/g, "");
	  
	  let elm = document.createElement(h.tagName);
	  elm.textContent = text;
	  array.push(elm.outerHTML);
	});
	let state = this.state;
	state.toc = array.join("\n");
	this.setState(state);
  }
  render(){	
    return <div className={cx(style.full_height, style.left)}>
	  <div ref="toc" dangerouslySetInnerHTML={{__html: this.state.toc}} />
	  <div ref="markdown" dangerouslySetInnerHTML={{__html: this.state.html}} className={style.left_pad}>
	  </div>
    </div>  
  }
}

class Index extends React.Component {
  constructor(props){
	super(props)
	this.store = new Store();
  }
  render(){
    return <div className={style.full_height}>
      <Field store={this.store}/>
	  <Form store={this.store}/>
    </div>
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" name='app' component={App}>
	  <IndexRoute component={Index} />
      <Route path="*" component={Index}/>
    </Route>
  </Router>
  , document.getElementById('content')
)
