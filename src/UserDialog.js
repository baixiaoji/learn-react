import React, { Component } from "react"
import "./UserDialog.css"
import { signUp, signIn, sendPasswordResetEmail } from "./leanCloud"
import SignUpForm from './SignUpForm'
import SignInForm from './SignInForm'
import ForgotPasswordForm from './ForgotPasswordForm'

export default class UserDialog extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: "signUp",
            selectedTab: 'signInOrSignUp',
            formData: {
                email: '',
                username: "",
                password: "",
            }
        }
    }

    switch(e) {
        this.setState({
            selected: e.target.value
        })
    }
    signUp(e) {
        e.preventDefault()

        let { email, username, password } = this.state.formData

        let success = (user) => {
            this.props.onSignUp.call(null, user)
        }

        let error = (error) => {
            console.log(error.code)
            switch (error.code) {
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

        signUp(email, username, password, success, error)
    }
    signIn(e) {
        e.preventDefault()

        let { username, password } = this.state.formData
        let success = (user) => {
            this.props.onSignIn.call(null, user)
        }

        let error = (error) => {
            // console.log(error.code)
            switch (error.code) {
                case 100:
                    alert("无法链接数据库")
                    break
                case 124:
                    alert("请求超时")
                    break
                case 126:
                    alert("无效用户")
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
        signIn(username, password, success, error)
    }
    changeFormDate(key, e) {
        let stateCopy = JSON.parse(JSON.stringify(this.state))

        stateCopy.formData[key] = e.target.value

        this.setState(stateCopy)
    }

    render() {
        let signInOrSignUp = (
            <div className="signInOrSignUp">
                <nav>
                    <label>
                        <input type="radio" value="signUp"
                            checked={this.state.selected === 'signUp'}
                            onChange={this.switch.bind(this)}
                        />注册
                    </label>
                    <label>
                        <input type="radio" value="signIn"
                            checked={this.state.selected === 'signIn'}
                            onChange={this.switch.bind(this)}
                        />登录
                    </label>
                </nav>
                <div className="panes">
                    {this.state.selected === 'signUp' ? 
                    <SignUpForm formData={this.state.formData}  
                            onSubmit={this.signUp.bind(this)}
                            onChange={this.changeFormDate.bind(this)}/> : null}
                    {this.state.selected === 'signIn' ? 
                    <SignInForm 
                        formData={this.state.formData} 
                        onSubmit={this.signIn.bind(this)}
                        onchange={this.changeFormDate.bind(this)} 
                        onForgotPassword={this.showForgotPassword.bind(this)}/> : null}
                </div>
            </div>
        )
        return (
            <div className="UserDialog-Wrapper">
                <div className="UserDialog">
                    {this.state.selectedTab === 'signInOrSignUp'?signInOrSignUp:
                    <ForgotPasswordForm 
                        formData={this.state.formData}
                        onSubmit={this.resetPassword.bind(this)} 
                        onChange={this.changeFormDate.bind(this)}
                        onSignIn={this.returnToSignIn.bind(this)}/>}
                </div>
            </div>
        )
    }
    showForgotPassword(){
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.selectedTab = 'forgotPassword'
        this.setState(stateCopy)
    }
    returnToSignIn(){
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.selectedTab = 'signInOrSignUp'
        this.setState(stateCopy)
    }    
    resetPassword(e){
        e.preventDefault();
        sendPasswordResetEmail(this.state.formData.email)
    }
}