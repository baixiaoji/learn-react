import React, {Component} from "react"
import "./UserDialog.css"
import {signUp,signIn} from "./leanCloud"


export default class UserDialog extends Component{
    constructor(props){
        super(props)

        this.state = {
            selected : "signUp",
            formData: {
                username: "",
                password: "",
            }
        }
    }

    switch(e){
        this.setState({
            selected: e.target.value
        })
    }
    signUp(e){
        e.preventDefault()

        let {username, password} = this.state.formData

        let success = (user) => {
            this.props.onSignUp.call(null,user)
        }

    let error = (error) =>{
            console.log(error.code)
            switch(error.code){
                case 202:
                    alert("用户名已被占用")
                    break
                case 200:
                    alert("用户名为空")
                    break
                case 201:
                    alert("密码为空")
                    break
                default:
                    alert(error)
                    break
            }
        }

        signUp(username,password,success,error)
    }
    signIn(e){
        e.preventDefault()

        let {username, password} = this.state.formData
        let success = (user) => {
            this.props.onSignIn.call(null,user)
        }

        let error = (error) =>{
            // console.log(error.code)
            switch(error.code){
                case 100:
                    alert("无法链接数据库")
                    break
                case 124:
                    alert("请求超时")
                    break
                case 126:
                    alert("")
                    break
                case 210:
                    alert("用户名与密码不匹配")
                    break
                case 211:
                    alert("找不到用户")
                    break
                case 218:
                    alert("密码不能为空")
                    break
                default:
                    alert(error)
                    break
            }
        }
        signIn(username,password,success,error)
    }
    changeFormDate(key,e){
        let stateCopy = JSON.parse(JSON.stringify( this.state ))

        stateCopy.formData[key] = e.target.value

        this.setState(stateCopy)
    }
    
    render(){
        let signUpForm = (
            <form className="signUP" onSubmit={this.signUp.bind(this)}>
            {/*注册*/}
            <div className="row">
                <label>用户名</label>
                <input type="text"  value={this.state.formData.username} 
                onChange={this.changeFormDate.bind(this,"username")}/>
                {/* bind 不仅可以绑定 this，还可以绑定第一个参数 */}
            </div>
            <div className="row">
                <label>密码</label>
                <input type="password" value={this.state.formData.password} 
                onChange={this.changeFormDate.bind(this,"password")}/>
            </div>
            <div className="row actions">
                <button type="submit">注册</button>
            </div>
        </form>
        )

        let signInForm = (
            <form className="signIn" onSubmit={this.signIn.bind(this)}>
            {/*登录*/}
            <div className="row">
                <label>用户名</label>
                <input type="text"  value={this.state.formData.username} 
                onChange={this.changeFormDate.bind(this,"username")}/>
            </div>
            <div className="row">
                <label>密码</label>
                <input type="password" value={this.state.formData.password} 
                onChange={this.changeFormDate.bind(this,"password")}/>
            </div>
            <div className="row actions">
                <button type="submit">登录</button>
            </div>
        </form>
        )
        return (
            <div className="UserDialog-Wrapper">
                <div className="UserDialog">
                    <nav >
                        <lable> <input type="radio" value="signUp" 
                        checked={this.state.selected === "signUp"}
                        onChange={this.switch.bind(this)}
                        />注册</lable>
                       <lable> <input type="radio" value="signIn" 
                       checked={this.state.selected === "signIn"}
                       onChange={this.switch.bind(this)}
                       />登录</lable>
                    </nav>
                    <div className="panes">
                        {this.state.selected === "signUp"?signUpForm : null}
                        {this.state.selected === "signIn"?signInForm : null}
                        
                    </div>
                </div>
            </div>
        )
    }
}