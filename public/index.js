"use strict";

 //get database reqeust
 function requestDataAPI(aFunction, method, anID, data,){
     let getID = anID
    if(!anID){
        getID = "";
    }
    const settings= {
        url: `/employees/${getID}`,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        method: method
    }
    $.ajax(settings)
    .done(aFunction)
    .fail(()=>{
        console.log('Failed response')
    });
    console.log('reqDataAPI ran')
}


//function after delete
function handleDelete(){
    $(".js-verify-delete").html(`
        <p>Employee has been deleted</p>
    `);
    requestDataAPI(renderHTML_GET,'GET',null,);
}

//no button on verify
function verifyDeleteButtonNo(){
    $(".js-verify-delete").on("click", ".js-verify-no", (event)=>{
        console.log("do not delete")
        $(".js-verify-delete").empty();
    })
}

//yes button on verify message
function verifyDeleteButtonYes(anID){
    $(".js-verify-delete").on("click", ".js-verify-yes", ()=>{
        console.log(anID)
        requestDataAPI(handleDelete,"DELETE",anID);
        console.log("deleting");
    })
}

//message to verify delete
function renderVerifyDelete(){
    console.log("render verify")
    $(".js-verify-delete").html(`
        <div>
            <p>Are you sure you want to delete this employee?</p>
            <button class="js-verify-yes">Yes</button>
            <button class="js-verify-no">No</button>
        </div>
    `)
}

//button for deleting employee
function employeeDeleteButton(){
    $('.js-get-employees')
    .on("click", ".js-delete-employee", function(event){
        let employeeID = $(this)
            .closest(".js-employee-list").attr("employee-id")

        console.log(employeeID);
        renderVerifyDelete();
        verifyDeleteButtonYes(employeeID);
        console.log("employee delete pressed")
    })
}

//render html for edit employee
function selectEmployeeCerts(certs){
    certs.forEach(cert=>{
        console.log(cert);
        $(`#${cert}`).prop("checked", true);
    })
}

//get id
function getDataByID(data){
    let {employeeName, certifications, equipment, notes} = data;
    console.log(equipment);
    employeeStorage.equipment = equipment;
    console.log(employeeStorage.equipment);
    $("#first-name").val(employeeName.firstName);
    $("#middle-initial").val(employeeName.middleInit);
    $("#last-name").val(employeeName.lastName);
    selectEmployeeCerts(certifications);
    renderAddEquipList(employeeStorage.equipment);
}

//close created message
function closeCreatedMessageButton(){
    $(".js-added-employee").on("click", ".js-close-created-button",()=>{
        console.log('close created pressed');
        $(".js-added-employee").empty();
    })
}

//html string for showCreatedEmployee
function renderCreatedEmployee(data){
    console.log(data);
    $('.js-added-employee').html(`
        <div class="js-">
            <h2>Create Employee</h2>
            <p>${data.employeeName} has been created successfully!</p>
            <button class="js-close-created-button" type=button>Close</button>
        </div>
    `)
}

//do something after successful post
function showCreatedEmployee(data){
    $(".js-added-employee").show();
    renderCreatedEmployee(data);
}

function listEquip(equipment){
    return equipment.map((item)=>`<li>${item}</li>`)
 }
 
 
 function listCerts(certs){
     return certs.map((aCert)=>`<li>${aCert}</li>`)
 }
 

function handleData(anEmployee){
    const {certifications, equipment, notes} = anEmployee;
    if(certifications || equipment || notes)
    return `
        <hr>
        <li class="js-employee-list" employee-id="${anEmployee.id}">
            <h3>${anEmployee.employeeName}</h3>
            <h4>Certifications</h4>
            <ul>
                ${listCerts(anEmployee.certifications).join('')}
            </ul>
            <h4>Equipment</h4>
            <ul>
                ${listEquip(anEmployee.equipment).join('')}
            </ul>
            <h4>Notes:</h4>
            <p>${anEmployee.notes}</p>
            <button 
                class="js-edit-employee-button" 
                type="button"
            >Edit Employee</button>
            <button class="js-delete-employee">Delete</button>
        </li>        
    `
}


//render data from GET to HTML
function renderHTML_GET(data){
    console.log('render ran');
    $('.js-get-employees').html(`
        <ol>
            ${data.map((anEmployee)=> handleData(anEmployee)).join('')}
        </ol>
    `)
}

//edit an employee
function editEmployeeButton(){
    
    $(".js-get-employees")
    .on("click", ".js-edit-employee-button", function(event){
        console.log('edit employee button ran');

        let employeeID = $(this)
        .closest(".js-employee-list").attr("employee-id");
        console.log(employeeID);

        requestDataAPI(getDataByID,"GET",employeeID, null);
    })
}


 //view employees in database
function viewEmployeesButton(){
    $('.view').on('click',(event)=>{
        console.log('view button ran');
       requestDataAPI(renderHTML_GET,'GET',null,);
    })
}


//collect notes for storage
function collectNotes(){
    let inputNotes = $('.js-add-notes').val();
    employeeStorage.notes.push(inputNotes)
    console.log(employeeStorage.notes);
}


function clearEquipList(storage){
    $(".js-equip-table").empty();
}


function clearEquipButton(){
   $(".js-list-clear").on("click", ()=>{
        console.log("clearEquip ran");
        employeeStorage.equipment = [];
        clearEquipList();
    })
}

function clearStorage(){
    let {employeeName,certifications,equipment,notes}=employeeStorage;
    employeeName.firstName = [];
    employeeName.lastName = [];
    employeeName.middleInit = [];
    certifications = [];
    equipment = [];
    notes = [];
    console.log(employeeStorage);
}

function clearAllInputs(){
    $("input[type=text]").val("");
    $(".js-add-notes").val("");
    $("input[type=checkbox]").prop("checked", false);
}


//clear data
function formResetButton(){
    $(".js-reset").on('click', ()=>{
        console.log("formReset ran");
        clearAllInputs();
        clearEquipList();
        clearStorage();
    })
}


//delete individual equipment items
function deleteEquipItemButton(){
    $(".js-equip-table").on("click", ".js-item-delete", function(event){
        console.log('actual',employeeStorage.equipment);

        let itemIndex = $(this).closest('.js-equip-list').attr('item-index');
        console.log("deleting item at index:", itemIndex);
        console.log('actual',employeeStorage.equipment);

        employeeStorage.equipment.splice(itemIndex,1);
        renderAddEquipList(employeeStorage.equipment);
        console.log('actual',employeeStorage.equipment);

        if(employeeStorage.equipment.length === 0){
            clearEquipList();
        }
    });

}

//generate list for equipment
function generateEquipList(item, index){
    return `
        <li class="js-equip-list" item-index="${index}">
            ${item} <button class="js-item-delete" type="button">Delete</button>
        </li>
    ` 
}

//html for equipment list
function renderAddEquipList(equips){
        $(".js-equip-table").html(`
            <h3>Equipment List</h3>            
            <ol>
                ${(equips.map((item, index)=> 
                    generateEquipList(item, index))).join('')}
            </ol>
        `);
}


//collect equipment data
function collectEquipment(){
    const {equipment} = employeeStorage;
    let equipName = $('#equipment-name').val();
    let equipNumber = $('#equipment-number').val();
    let equipDesc;
    if(equipNumber === ""){
        equipNumber = 'N/A'
    }
    equipDesc = `${equipName} (${equipNumber})`;
    if(equipName !== ""){
        equipment.push(equipDesc);
        console.log(equipment);
        $('.js-equip-clear').val('');
        renderAddEquipList(equipment);
    };

}


//add equipment and make list on html 
function collectEquipmentButton(){
    $('.js-add-equip').on('click', ()=>{
        collectEquipment();
    });
}


//collect certificatin data
function collectCerts(){
    const {certifications} = employeeStorage
    $('input[name=certs]:checked')
        .each(function(){certifications.push($(this).val())});
    console.log(certifications);
}

//collect employee names
function collectEmployeeName(){
    const {employeeName} = employeeStorage
    employeeName.firstName = $('#first-name').val();
    employeeName.middleInit = $('#middle-initial').val();
    employeeName.lastName = $('#last-name').val();
}


//submits employee information to database
function createEmployeeButton(){

    //when user submits
    $('#employee-data').on('submit', (event)=>{
        console.log('createEmployee ran');
        event.preventDefault();

        collectEmployeeName()
        collectCerts();
        collectNotes();
        console.log(employeeStorage);
        requestDataAPI(showCreatedEmployee,'POST',null, employeeStorage);
    })
}


function runThis(){
    createEmployeeButton();
    viewEmployeesButton();
    closeCreatedMessageButton()
    editEmployeeButton();
    collectEquipmentButton();
    deleteEquipItemButton();
    formResetButton();
    clearEquipButton();
    employeeDeleteButton();
    verifyDeleteButtonNo();
}

$(runThis);