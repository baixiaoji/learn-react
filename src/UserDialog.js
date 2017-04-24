import React, {Component} from "react"
import "./UserDialog.css"
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
    signUp(e){}
    signIn(e){}
    changeUserName(e){
        
    }
    render(){
        let signUpForm = (
            <form className="signUP">
            {/*注册*/}
            <div className="row">
                <label>用户名</label>
                <input type="text"/>
            </div>
            <div className="row">
                <label>密码</label>
                <input type="text"/>
            </div>
            <div className="row actions">
                <button type="submit">注册</button>
            </div>
        </form>
        )

        let signInForm = (
            <form className="signIn">
            {/*登录*/}
            <div className="row">
                <label>用户名</label>
                <input type="text"/>
            </div>
            <div className="row">
                <label>密码</label>
                <input type="text"/>
            </div>
            <div className="row actions">
                <button type="submit">登录</button>
            </div>
        </form>
        )
        return (
            <div className="UserDialog-Wrapper">
                <div className="UserDialog">
                    <nav onChange={this.switch.bind(this)}>
                        <lable> <input type="radio" value="signUp" checked={this.state.selected === "signUp"}/>注册</lable>
                       <lable> <input type="radio" value="signIn" checked={this.state.selected === "signIn"}/>登录</lable>
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