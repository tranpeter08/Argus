'use strict';

function ajaxReq(data, url, method, callback, fail){
  const settings = {
    url: url,
    data: JSON.stringify(data || ""),
    dataType: 'json',
    contentType: 'application/json',
    method: method
  }

  $.ajax(settings)
  .done(callback)
  .fail(fail)
}

function clearRegLoginForms(){
  $(".js-registration-forms input").val("");
  $(".js-reg-clear").empty();

}

function handleLoginError(err){
 console.log(err);
}

function handleLogin(data){
  console.log(data);
  clearRegLoginForms();
  $(".js-registration").hide();
  $(".js-about").show();
  $(".js-login-button").hide();
  $(".js-logout").show();
  $(".js-postlogin").show();
}

function handleErrorJWT(err){
console.log(err);
  $('.js-login-err').html(`
    <p class="reg-err">Incorrect username or password.</p>
  `);
}

function handleJWT(data){
console.log(data);
//ajax with token
  const settings= {
    url: '/api/protected',
    dataType: 'json',
    contentType: 'application/json',
    method: 'GET',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + data.authToken)
    }
  }

  $.ajax(settings)
  .done(handleLogin)
  .fail(handleLoginError)
}

function loginButton(){
  $("#js-login-form").on("submit",(event)=>{
    event.preventDefault();

    let username = $("#username-login").val();
    let password = $("#password-login").val();

    const userData = {username, password};

    ajaxReq(
      userData,'/api/auth/login','POST',handleJWT,handleErrorJWT
    );
    
  });
}

//handle error for reg
function registerError(err){
  console.log(err);
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
  console.log(data);
  //pop up div created successfully
  //username
  clearRegLoginForms();
  $(".js-registration-message").html(`
    <p>Username: ${data.username} created successfully!</p>
    <button class="js-reg-msg-close">Close</button>   
  `);
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
      userData,'/api/users','POST',handleRegistered,registerError
    );
  });
}

$(
  registerSubmitButton(),
  loginButton(),
  registerCloseButton()
);