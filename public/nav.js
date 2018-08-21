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

        //hide form, employee list,
        hideElement(".js-hide");
        $(".js-empty").empty();
        $(".js-about").show();
    })
}

function loginRegisterButton(){
  $(".js-login-button").on("click", ()=>{
    $(".js-about").hide();
    $('.js-registration').show();
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

        //hide form, employee list,
        hideElement(".js-hide");
        $(".js-empty").empty();
        $(".js-about").show();
        $(".js-postlogin").hide();
        $(".js-logout").hide();
        $(".js-login-button").show();
    })
}

$(
    argusButton(),
    loginRegisterButton(),
    logOutButton()
)