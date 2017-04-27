// 导入LeanCloud
import AV from "leancloud-storage"

var APP_ID = 'UgRO2nPJbvVAMRLIy2vs7z1e-gzGzoHsz';
var APP_KEY = 'pzWUrSOWB6euFMFpvs51UsXl';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

export default AV


export function signUp(username, password, successFn, errorFn) {
  var user = new AV.User();
  // console.log(user)
  user.setUsername(username)

  user.setPassword(password)

  user.signUp().then(function (loginedUser) {
    let user = getUserFromAVUser(loginedUser)

    successFn.call(null, user)
  }, function (error) {
    errorFn.call(null, error)
  })
}
export function signIn(username, password, successFn, errorFn) {
  AV.User.logIn(username, password).then(function (loginedUser) {
    let user = getUserFromAVUser(loginedUser)
    successFn.call(null, user)
  }, function (error) {
    errorFn.call(null, error)
  })
}
export function getCurrentUser() {
  let user = AV.User.current()

  if (user) {
    return getUserFromAVUser(user)
  } else {
    return null
  }
}

export function signOut() {
  AV.User.logOut()
  return undefined
}
function getUserFromAVUser(AVUser) {
  return {
    id: AVUser.id,
    ...AVUser.attributes
  }
}