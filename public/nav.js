function argusButton(){
    $(".js-home").on("click", ()=>{
        console.log("going home");
        if("id" in employeeStorage){
            delete employeeStorage.id;
        }

        clearAllInputs();
        clearEquipList();
        clearStorage();

        //hide form, employee list, show landing page
        hideElement(".js-hide");
        $(".js-empty").empty();
        showElement(".js-landing");
    })
}