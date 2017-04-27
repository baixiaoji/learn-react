import React, { Component } from 'react';
import "normalize.css"
import "./reset.css"
import './App.css';
import TodoInput from "./TodoInput"
import TodoItem from "./TodoItem"
import UserDialog from "./UserDialog"
import AV,{ getCurrentUser, signOut } from "./leanCloud"
import deepCopy from "./deepCopy"

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: getCurrentUser() || {},
      newTodo: "",
      todoList: []
    }
  }
  render() {

    let todos = this.state.todoList
      .filter((item) => !item.deleted)
      .map((item, index) => {
        return (
          <li key={index}>
            <TodoItem todo={item} onToggle={this.toggle.bind(this)}
              onDeleted={this.delete.bind(this)} />
          </li>
        )
      })

    let main = (
     
      <div>
        <h1>{this.state.user.username || "我"}的代办
          {this.state.user.id ? <button onClick={this.signOut.bind(this)}>登出</button> : null}
        </h1>
        <div className="inputWrapper">
          <TodoInput content={this.state.newTodo}
            onChange={this.changeTitle.bind(this)}
            onSubmit={this.addTodo.bind(this)} />
        </div>
        <ol className="todoList">
          {todos}
        </ol>
      </div>
    )

    // console.log(todos)
    return (
       <div className="App">
        {this.state.user.id ?
          main :
          <UserDialog
            onSignUp={this.onSignUpOrSignIn.bind(this)}
            onSignIn={this.onSignUpOrSignIn.bind(this)} />}
      </div>
    );
  }
  signOut() {
    signOut()
    let stateCopy = deepCopy(this.state)

    stateCopy.user = {}

    this.setState(stateCopy)

  }
  onSignUpOrSignIn(user) {
    let stateCopy = deepCopy(this.state)

    stateCopy.user = user

    this.setState(stateCopy)
  }
  delete(event, todo) {
    todo.deleted = true
    this.setState(this.state)

    this.saveOrUpdateTodos()
  }
  componentWillMount(){
    this.fetchTodos()
  }
  componentDidUpdate() {

  }
  fetchTodos(){
    if(AV.User.current()){
      var query = new AV.Query("AllTodos")
      query.find()
            .then((todos)=>{
              const stateCopy = deepCopy(this.state)
              stateCopy.todoList = JSON.parse(todos[0].attributes.AllTodos)
              stateCopy.todoList.id = todos[0].id
              this.setState(stateCopy)

            },function(err){
              console.log(err)
            })
    }
  }
  saveTodos(){
    let dataString = JSON.stringify(this.state.todoList)
    var AVTodos = AV.Object.extend("AllTodos")
    var avTodos = new AVTodos()
    var acl = new AV.ACL()

    acl.setReadAccess(AV.User.current(), true)
    acl.setWriteAccess(AV.User.current(), true)

    avTodos.set("AllTodos",dataString)
    avTodos.setACL(acl)

    avTodos.save().then((todo) =>{
       let stateCopy = deepCopy(this.state)
       stateCopy.todoList.id = todo.id

       this.setState(stateCopy)
       console.log("保存成功")

    },(error)=>{
      console.log("保存失败")
    })
  }
 updateTodos(){
   let dataString = JSON.stringify(this.state.todoList)

   let avTodos = AV.Object.createWithoutData("AllTodos", this.state.todoList.id)

   avTodos.set("AllTodos",dataString)

   avTodos.save().then(()=>{
     console.log("更新成功")
   })
 }
 saveOrUpdateTodos(){
   if(this.state.todoList.id){
     this.updateTodos()
   }else{
     this.saveTodos()
   }
 }
  toggle(e, todo) {
    todo.status = todo.status === "completed" ? "" : "completed"
    this.setState(this.state)
    this.saveOrUpdateTodos()
  }
  changeTitle(event) {
    this.setState({
      newTodo: event.target.value,
      todoList: this.state.todoList
    })

    this.saveOrUpdateTodos()

  }
  addTodo(event) {
    this.state.todoList.push({
      id: idMaker(),
      title: event.target.value,
      status: null,
      deleted: false
    })
    this.setState({
      newTodo: '',
      todoList: this.state.todoList
    })

    this.saveOrUpdateTodos()
    
  }
}

export default App;

let id = 0;

function idMaker() {
  id += 1
  return id
}