function argusButton(){
    $(".js-home").on("click", ()=>{
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
    })
}