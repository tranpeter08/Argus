function argusButton(){
    $(".js-home").on("click", ()=>{
        console.log("going home");
        if("id" in employeeStorage){
            delete employeeStorage.id;
        }

        clearAllInputs();
        clearEquipList();
        clearStorage();

        clearRegLoginForms();

        //hide form, employee list, delete token
        hideElement(".js-hide");
        $(".js-empty").empty();
        $(".js-about").show();

        //show login
        $("#js-login-form").show();
        $("#js-register-form").hide();
    })
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
        console.log("going home");
        if("id" in employeeStorage){
            delete employeeStorage.id;
        }

        clearAllInputs();
        clearEquipList();
        clearStorage();

        //hide form, employee list, switch login/out buttons
        //delete token
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
    $('.js-icon').on('click', ()=>{
        $('.js-nav-box').toggleClass('nav-box-responsive');     
    })
}

$(
    argusButton(),
    loginRegisterButton(),
    logOutButton(),
    hamburgerIcon()
)