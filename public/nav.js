function argusButton(){
    $(".js-home").on("click", ()=>{
        if("id" in employeeStorage){
            delete employeeDeleteButton.id;
        }

        clearAllInputs();
        clearEquipList();
        clearStorage();

        hideElement(".js-hide")
        showElement(".js-landing");
        

    })
}