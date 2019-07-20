'use strict';

function ajaxReq(data, url, method, callback, fail){
  const settings = {
    url: url,
    data: JSON.stringify(data || ''),
    dataType: 'json',
    contentType: 'application/json',
    method: method
  }

  $.ajax(settings)
  .done(callback)
  .fail(fail);
}

function goToLogin(){
  $('.js-go-register').on('click',()=>{
    clearRegLoginForms();
    $("#js-login-form").hide();
    $("#js-register-form").show();
  })
}

function clearRegLoginForms(){
  $(".js-registration-forms input").val("");
  $(".js-reg-clear").empty();

}

function handleLogin(){
  clearRegLoginForms();
  $(".js-registration").hide();
  $(".js-about").show();
  $(".js-login-button").hide();
  $(".js-logout").show();
  $(".js-postlogin").show();
}

function handleErrorJWT(err){
  $('.js-login-err').html(`
    <p class="reg-err">Incorrect username or password.</p>
  `);
}

function storeToken(aToken){
  userStoreage.authToken = aToken;
}

function handleJWT(data){
  storeToken(data.authToken);
  handleLogin();
}

//login submit
function loginButton(){
  $("#js-login-form").on("submit",(event)=>{
    event.preventDefault();

    let username = $("#username-login").val();
    let password = $("#password-login").val();

    const userData = {username, password};

    ajaxReq(
      userData,'/employees/auth/login','POST',handleJWT,handleErrorJWT
    );
    

  });
}

//handle error for registration
function registerError(err){
  const{message, location} = err.responseJSON
  $(".js-reg-err").html(`
      <p class="reg-err">${location} ${message}</p>
    `)
  //display error message on register
}

function registerCloseButton(){
  $(".js-registration-message")
    .on("click", ".js-reg-msg-close", ()=>{
      $(".js-registration-forms").show();
      $(".js-registration-message").empty();
    })
}

function handleRegistered(data){
  clearRegLoginForms();
  $(".js-registration-message").html(`
    <div class="message-box"> 
      <p>User: ${data.username}<br>created successfully!</p>
      <button class="js-reg-msg-close reg-msg-close">Close</button>
    </div> 
  `);

  $("#username").val("");
  $("#password").val("");
  $("#js-login-form").show();
  $("#js-register-form").hide();
  $(".js-registration-forms").hide();
}

//register button
function registerSubmitButton(){
  $("#js-register-form").on("submit", (event)=>{
    event.preventDefault();
    let username = $("#username").val();
    let password = $("#password").val();

    const userData = {username, password};

    ajaxReq(
      userData,'/employees/users','POST',handleRegistered,registerError
    );
    

  });
}

$(
  registerSubmitButton(),
  loginButton(),
  registerCloseButton(),
  goToLogin()
);