"use strict";

//POST database request 
 function postDataAPI(dataStore,aFunction){
    console.log(dataStore);
    const settings= {
        url: '/employees',
        dataType: 'json',
        contentType: 'application/json',
        data: dataStore,
        method: "POST"
    }
    $.ajax(settings)
    .done(aFunction)
    .fail(()=>{
        console.log('Failed POST response')
    });
 }

 //get database reqeust
function getDataAPI(aFunction){
    const settings= {
        url: '/employees',
        dataType: 'json',
        contentType: 'application/json',
    }
    $.ajax(settings)
    .done(aFunction)
    .fail(()=>{
        console.log('Failed GET response')
    });
}

function handleData(anEmployee){
    return `
        <hr>
        <li>
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
        </li>
    `
}

//render data from GET to HTML
function renderHTML_GET(data){
    console.log('render ran');
    console.log(data);
    $('.js-results').html(`
        <ol>
            ${data.map((anEmployee)=> handleData(anEmployee)).join('')}
        </ol>
    `)
}

 //view employees in database
function viewEmployees(){
    $('.view').on('click',(event)=>{
        console.log('view button ran');
       getDataAPI(renderHTML_GET);

    })
}

//collect notes for storage
function collectNotes(notes){
    let inputNotes = $('.js-add-notes').val();
    notes.push(inputNotes)
    console.log(notes);
}


function clearEquipList(storage){
    $(".js-equip-table").empty();
}

function clearEquipButton(storage){
   $(".js-list-clear").on("click", ()=>{
        console.log("clearEquip ran");
        console.log(storage);
        storage.equipment = [];
        clearEquipList()
    })
}

function clearAllInputs(storage){
    storage.employeeName.firstName = [];
    storage.employeeName.lastName = [];
    storage.certifications = [];
    storage.equipment = []
    storage.notes = [];
    clearEquipList();
    console.log(storage);
}

//clear data
function formReset(storage){
    $(".js-reset").on('click', ()=>{
        console.log("formReset ran",storage);
        clearAllInputs(storage);
    })

}

//delete individual item
function deleteEquipItem(storage){
    //push delete button

    $(".js-equip-table").on("click", ".js-item-delete", function(event){
        //get item index
        let itemIndex = $(this).closest('.js-equip-list').attr('item-index');
        //update equipment object
        console.log(storage.equipment)
        storage.equipment.splice(itemIndex,1);
        console.log(storage.equipment)
        //remove list from DOM
        renderAddList(storage.equipment);
        
    })
    
    
    
}

function listEquip(equipment){
   return equipment.map((item)=>`<li>${item}</li>`)
}

function listCerts(certs){
    return certs.map((aCert)=>`<li>${aCert}</li>`)
}

function generateList(item, index){
    return `
        <li class="js-equip-list" item-index="${index}">${item} <button class="js-item-delete" type="button">Delete</button></li>
    ` 
}

function renderAddList(equips){
    $(".js-equip-table").html(`
        <h3>Equipment List</h3>            
        <ol>Description (Part No.)
            ${(equips.map((item, index)=> generateList(item, index))).join('')}
        </ol>
    `);
}

//add equipment and make list on html

function collectEquipment(storage){
    $('.js-add-equip').on('click', ()=>{
        let equipName = $('#equipment-name').val();
        let equipNumber = $('#equipment-number').val();
        let equipDesc;
        if(equipNumber === ""){
            equipNumber = 'N/A'
        }
        equipDesc = `${equipName} (${equipNumber})`;
        if(equipName !== ""){
            storage.equipment.push(equipDesc);
            console.log(storage.equipment);
            $('.js-equip-clear').val('');
            renderAddList(storage.equipment);
        };
    });
}

//collect certificatin data
function collectCerts(storage){
    $('input[name=certs]:checked').each(function(){storage.push($(this).val())});
    console.log(storage);
}

function collectEmployeeName(employee){
    employee.firstName = $('#first-name').val();
    employee.lastName = $('#last-name').val();
}

//submits employee information to database
function createEmployee(){
    const postStorage = {
        employeeName:{
            firstName: "",
            lastName: ""
        },
        certifications: [], 
        equipment: [],
        notes: []
    }
    
    let {employeeName,certifications,equipment,notes} = postStorage
    
    collectEquipment(postStorage);
    deleteEquipItem(postStorage);
    clearEquipButton(postStorage);
    formReset(postStorage);

    //when user clicks submits
    $('#employee-data').on('submit', (event)=>{
        console.log('createEmployee ran');
        event.preventDefault();

        collectEmployeeName(employeeName)
        collectCerts(certifications);
        collectNotes(notes);

        console.log(postStorage);

        postDataAPI(postStorage);
    })
}

function runThis(){
    createEmployee();
    viewEmployees();
}

$(runThis);