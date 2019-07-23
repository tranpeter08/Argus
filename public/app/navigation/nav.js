'use strict';

const login = `<li><a class="js-nav-login">Login/Register</a></li>`
const navLinksData = [
  {className: 'js-nav-view', label: 'View Employees'},
  {className: 'js-nav-add', label: 'Add Employee'},
  {className: 'js-nav-logout', label: 'Logout'}
];

function renderNavLinks() {
  $('.js-nav-links').html(handleLinks());
}

function handleLinks() {
  if (userState.authToken) {
    return secureLinks;
  }

  return login;
}

function secureLinks() {
  return navLinksData.map(({className, label}) => `
    <li>
      <a class='${className}'>${label}</a>
    </li>
  `);
}

function argusButton(){
    $(".js-home").on("click", ()=>{
        if ("id" in employeeStorage) {
            delete employeeStorage.id;
        }

        clearAllInputs();
        clearEquipList();
        clearStorage();

        clearRegLoginForms();

        hideElement(".js-hide");
        $(".js-empty").empty();
        $(".js-about").show();

        $("#js-login-form").show();
        $("#js-register-form").hide();
    });
}

function loginRegisterButton() {
  $(".js-login-button").on("click", ()=>{
    $(".js-about").hide();
    clearRegLoginForms();
    $('.js-registration').show();
    $("#js-login-form").show();
    $("#js-register-form").hide();
  })
}

function logOutButton(){
    $(".js-logout").on("click", ()=>{
        if("id" in employeeStorage){
            delete employeeStorage.id;
        }

        clearAllInputs();
        clearEquipList();
        clearStorage();

        hideElement(".js-hide");
        $(".js-empty").empty();
        $(".js-about").show();
        $(".js-postlogin").hide();
        $(".js-logout").hide();
        $(".js-login-button").show();
        userStoreage.authToken = "";
    })
}

function menuButton() {
  $('.js-nav-menu-btn').on('click', event => {
    $(event.currentTarget).attr('aria-expanded', (i, val) => {
      return val === 'true' ? 'false' : 'true';
    });
    $('.js-nav-links').toggleClass('collapse');     
  });
}

$(
  renderNavLinks(),
  argusButton(),
  loginRegisterButton(),
  logOutButton(),
  menuButton()
)