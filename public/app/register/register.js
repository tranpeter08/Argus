const registerForm = `
  <section>
    <form id="js-register-form" class='register-form'>
      <fieldset>
        <legend>Register</legend>
        <div class="login-inputs">
          <label for="username">Create a Username</label><br>
          <span class='register-format'>(8-20 characters)</span><br>
          <input type="text" id="username" ><br>
          <label for="password">Create a Password</label><br>
          <span class='register-format'>(min. 10 characters)</span><br>
          <input type="password" id="password" ><br>
        </div>
        <div class="js-reg-err js-reg-clear reg-msg"></div>
        <div class="reg-button-container">
          <button class='register-btn' type="submit">Register</button>
        </div>
      </fieldset>
    </form>
  </section>
`;

function renderRegister() {
  $('#root').html(registerForm);
}

function registerUser() {
  $('#root').on("submit", '#js-register-form', event => {
    event.preventDefault();
    let username = $("#username").val();
    let password = $("#password").val();

    const userData = {username, password};

    ajaxReq(
      '/employees/users', 
      'POST', 
      userData, 
      registerSuccess, 
      registerError
    );
  });
}

function registerSuccess(data) {
  $("#root").html(registerMsg(data.username));
}

function registerMsg(username) {
  return `
    <section>
      <div class="register-msg-ctnr"> 
        <p>User: ${username}</p>
        <p>Created successfully!</p>
        <button class="js-reg-msg-close reg-msg-close">Close</button>
      </div>
    </section>
  `;
}

function closeRegisterMsg(){
  $("#root").on("click", ".js-reg-msg-close", () => {
    console.log('ysy')
    // render employees
  });
}





function registerError(err){
  const{message, location} = err.responseJSON
  $(".js-reg-err").html(`
    <p class="registration-error">* ${location} ${message}</p>
  `);
}

$(
  closeRegisterMsg(),
  registerUser()
);