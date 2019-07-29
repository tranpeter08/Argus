'use strict';

const loginLink = `<li><a class="js-nav-login">Login/Register</a></li>`
const navLinksData = [
  {className: 'js-nav-view', label: 'View Employees'},
  {className: 'js-nav-add', label: 'Add Employee'},
  {className: 'js-nav-logout', label: 'Logout'}
];

function renderNavLinks() {
  $('.js-nav-links').html(handleLinks());
}

function handleLinks() {
  if (authState.authToken) {
    return secureLinks;
  }

  return loginLink;
}

function secureLinks() {
  return navLinksData.map(({className, label}) => `
    <li>
      <a class='${className}'>${label}</a>
    </li>
  `);
}

function collapseMenu() {
  const isCollapse = $('.js-nav-links').hasClass('collapse');

  if (isCollapse) {
    return;
  }

  $('.js-nav-links').addClass('collapse');
}

function homeButton() {
  $('.js-nav-home-btn').on('click', () => {
    resetState();
    renderLanding();
    collapseMenu();
  });
}

function loginButton() {
  $('.js-nav-login').on('click', () => {
    renderLogin();
    collapseMenu();
  });
}

function viewEmployees() {
  $('.js-nav-links').on('click', '.js-nav-view',()=>{
    getEmployees();
  });
}

function addEmployee() {
  $('.js-nav-links').on('click', '.js-nav-add', () => {
    // showElement('.js-form');
    // renderSubmitButton();
    // $('.js-legend').text('Create an Employee');
    // $('.js-empty').empty();
    // $('.js-about').hide();
    // resetStorage();
    renderAddForm();
  });
}

function logOutButton(){
    $(".js-logout").on("click", ()=>{
        if("id" in employeeState){
            delete employeeState.id;
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

function clickOut() {
  $(document).on('click', event => {
    const node = $(event.target);
    const navLinks = node.closest('.js-nav-links')[0];
    const navMenuBtn = node.closest('.js-nav-menu-btn')[0];
    const navHome = node.closest('.js-nav-home-btn')[0];

    if (!(navLinks || navMenuBtn || navHome)) {
      collapseMenu();
    }
  });
}

$(
  renderNavLinks(),
  homeButton(),
  loginButton(),
  viewEmployees(),
  addEmployee(),
  logOutButton(),
  menuButton(),
  clickOut()
)