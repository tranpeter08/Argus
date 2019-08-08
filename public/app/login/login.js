'use strict';

const loginForm = `
  <section>
    <form class="login-form" action="" id="js-login-form">
      <fieldset>
        <legend>Login</legend>
        <div class="login-inputs">
          <label for="login-username">Username</label><br>
          <input type="text" id="login-username" value='demoUser01'><br>
          <label for="login-password">Password</label><br>
          <input type="password" id="login-password" value='demoUser01'>
          <div class="js-login-err js-reg-clear reg-msg"></div>
        </div>
        <div class="reg-button-container">
          <button class='login-btn' type="submit">Login</button><br>
          <p>
            or 
            <a class="js-login-register login-register">register</a>
            today!
          </p>
        </div>
      </fieldset>
    </form>
  </section>
`;

function renderLogin() {
  $('#root').html(loginForm);
}

function loginButton() {
  $("#root").on('submit', '#js-login-form', event => {
    event.preventDefault();

    const username = $('#login-username').val();
    const password = $('#login-password').val();
    const data = {username, password};

    loginUserReq(data);
  });
}

function loginUserReq(data) {
  authState.loading = true;
  ajaxReq(
    '/employees/auth/login',
    'POST', 
    data, 
    loginSuccess,
    loginError
  );
}

function loginSuccess({authToken}) {
  authState.loading = false;
  authState.error = '';

  storeToken(authToken);
  renderNavLinks();
  renderEmployeesSect();
  getEmployees(employeesSuccess, employeesError);
}

function storeToken(token) {
  authState.authToken = token;
}

function loginError({responseJSON: {message}}) {
  const err = `<p class='login-error'>${message}</p>`
  $('.js-login-err').html(err);
}

function register() {
  $('#root').on('click', '.js-login-register', () => {
    renderRegister();
  });
}

$(
  loginButton(),
  register()
);