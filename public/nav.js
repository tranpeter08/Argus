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

function loginRegisterButton(){
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

function hamburgerIcon() {
    $('.js-icon').on('click', (event)=>{
        $(event.currentTarget).attr('aria-expanded', (i, val)=>{
            return val === 'true'? 'false' : 'true';
        });
        $('.js-nav-box').toggleClass('nav-box-responsive');     
    })
}

$(
    argusButton(),
    loginRegisterButton(),
    logOutButton(),
    hamburgerIcon()
)