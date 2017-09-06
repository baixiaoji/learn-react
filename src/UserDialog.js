import React, { Component } from "react"
import "./UserDialog.css"
import { signUp, signIn, sendPasswordResetEmail } from "./leanCloud"

import ForgotPasswordForm from './ForgotPasswordForm'
import SignInOrSignUp from './SignInOrSignUp'

export default class UserDialog extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedTab: 'signInOrSignUp',
            formData: {
                email: '',
                username: "",
                password: "",
            }
        }
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
        return (
            <div className="UserDialog-Wrapper">
                <div className="UserDialog">
                    {this.state.selectedTab === 'signInOrSignUp' ?
                        <SignInOrSignUp
                            formData={this.state.formData}
                            onSignIn={this.signIn.bind(this)}
                            onSignUp={this.signUp.bind(this)}
                            onChange={this.changeFormDate.bind(this)}
                            onForgotPassword={this.showForgotPassword.bind(this)}
                        /> :
                        <ForgotPasswordForm
                            formData={this.state.formData}
                            onSubmit={this.resetPassword.bind(this)}
                            onChange={this.changeFormDate.bind(this)}
                            onSignIn={this.returnToSignIn.bind(this)} />}
                </div>
            </div>
        )
    }
    showForgotPassword() {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.selectedTab = 'forgotPassword'
        this.setState(stateCopy)
    }
    returnToSignIn() {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.selectedTab = 'signInOrSignUp'
        this.setState(stateCopy)
    }
    resetPassword(e) {
        e.preventDefault();
        sendPasswordResetEmail(this.state.formData.email)
    }
}