//get database reqeust
 function requestDataAPI(aFunction, method, anID, data,){
     console.log(anID);
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

function showElement(selector){
    $(selector).show();
}

function hideElement(selector){
    $(selector).hide();
}

//function after delete
function handleDelete(){
    $(".js-verify-delete").html(`
        <p>Employee has been deleted</p>
        <button class="js-close-deleted">Close</button>
    `);
    requestDataAPI(renderHTML_GET,'GET',null,);
}

//no button on verify message
function verifyDeleteButtonNo(){
    $(".js-message-box")
    .on("click", ".js-verify-no", (event)=>{
        console.log("do not delete")

        requestDataAPI(renderHTML_GET,'GET',null,);
        $(".js-message-box").empty();
        
    });
}

//yes button on verify message
function verifyDeleteButtonYes(){
    $(".js-message-box")
    .on("click", ".js-verify-yes", ()=>{

        const anID = employeeStorage.id;
        requestDataAPI(handleDelete,"DELETE",anID);

        console.log("deleting", anID);

        delete employeeStorage.id;
        $(".js-message-box").empty();
    })
}

//message to verify delete
function renderVerifyDelete(employee){
    console.log("render verify delete")
    $(".js-message-box").html(`
        <div>
            <p>Are you sure you want to delete ${employee}?</p>
            <button class="js-verify-yes">Yes</button>
            <button class="js-verify-no">No</button>
        </div>
    `)
}

//button for deleting employee
function employeeDeleteButton(){
    $('.js-employees')
    .on("click", ".js-delete-employee", function(event){
        console.log("employee delete pressed")
        const employeeID = $(this)
            .closest(".js-employee-list")
            .attr("employee-id");

        employeeStorage.id = employeeID;

        const selectedEmployee =  $(this)
            .closest(".js-employee-list")
            .find(".js-employee-name").text();

        renderVerifyDelete(selectedEmployee);

        $(".js-employees").empty();
    })
}

//close edit message
function closeEditMsg(){
    $(".js-message-box").on("click",".js-close-edit-msg",()=>{
        
        requestDataAPI(renderHTML_GET,'GET',null,);
        $(".js-message-box").empty();
    })
}

//show a message successful edit
function successfulEditMsg(){
    $(".js-message-box").html(`
        <p>Employee update successful!</p>
        <button class="js-close-edit-msg">Close</button>
    `)
    console.log("successful add");
}

//submit updated employee info
function submitEditButton(){
    $(".js-button-box").on("click",".js-submit-edit",(event)=>{
        console.log("submit edit ran");
        event.preventDefault();

        const employeeID = employeeStorage.id

        collectEmployeeName();
        collectCerts();
        collectNotes();

        requestDataAPI(
            successfulEditMsg,"PUT",employeeID,employeeStorage
        );

        delete employeeStorage.id;

        clearAllInputs();
        clearEquipList();
        clearStorage();

        $(".js-button-box").empty();
        hideElement(".js-form");
    })
}

//render html for edit employee
function selectEmployeeCerts(certs){
    certs.forEach(cert=>{
        $(`#${cert}`).prop("checked", true);
    })
}

//get data by id and fill form
function fillEmployeeForm(data){
    console.log("filling form");

    $(".js-legend").text('Edit an emplyee');

    const {
        employeeName, certifications, equipment, _id, notes
    } = data;

    employeeStorage.equipment = equipment;
    employeeStorage.id = _id;

    $("#first-name").val(employeeName.firstName);
    $("#middle-initial").val(employeeName.middleInit);
    $("#last-name").val(employeeName.lastName);

    selectEmployeeCerts(certifications);
    renderAddEquipList(equipment);

    $(".js-add-notes").val(notes);
}


function renderSubmitEditButton(){
    
    $(".js-button-box").html(`
        <button 
            class="js-submit-edit submit-edit" 
            type="button">Submit Edit Employee
        </button>
    `)
    console.log("redner edit button ran");
}

//edit employee button
function editEmployeeButton(){
    $(".js-employees")
    .on("click", ".js-edit-employee-button", function(event){
        console.log('edit employee button ran');

        const employeeID = $(this)
        .closest(".js-employee-list").attr("employee-id");

        showElement(".js-form");
        renderSubmitEditButton();
        $(".js-employees").empty();
        
        requestDataAPI(fillEmployeeForm,"GET",employeeID, null);
        
    })
}

function listEquip(equipment){
    return equipment.map((item)=>`<li>${item}</li>`);
 }
 
 function listCerts(certs){
     return certs.map((aCert)=>`<li>${aCert}</li>`);
 }

//generate list from GET data
function handleData(anEmployee){
    console.log("handle GET data for HTML")
    const {
        certifications, employeeName, equipment, notes, id
    } = anEmployee;

    return `
        <hr>
        <li class="js-employee-list" employee-id="${id}">
            <h3 class="js-employee-name">${employeeName}</h3>
            <h4>Certifications</h4>
            <ul>
                ${listCerts(certifications).join('')}
            </ul>
            <h4>Equipment</h4>
            <ul>
                ${listEquip(equipment).join('')}
            </ul>
            <h4>Notes:</h4>
            <p>${notes}</p>
            <button 
            class="js-edit-employee-button" 
            type="button">
                Edit Employee
            </button>
            <button 
            class="js-delete-employee">
                Delete
            </button>
        </li>        
    `
}

//render data from GET request to HTML
function renderHTML_GET(data){
    console.log('render ran');
    $('.js-employees').html(`
        <div>
            <h2>Employees</h2>
            <ol>
                ${data.map(
                    (anEmployee)=> handleData(anEmployee)
                )
                .join('')}
            </ol>
        </div>
    `);
}
 
 //view employees in database
function viewEmployeesButton(){
    $('.js-view').on('click',()=>{
        console.log('view button ran');
        hideElement(".js-landing");
        requestDataAPI(renderHTML_GET,'GET',null, null);
    });
}

function clearStorage(){
    console.log("clear storage ran", employeeStorage);

    employeeStorage.employeeName.firstName = [];
    employeeStorage.employeeName.lastName = [];
    employeeStorage.employeeName.middleInit = [];
    employeeStorage.certifications = [];
    employeeStorage.equipment = [];
    employeeStorage.notes = "";

    console.log(employeeStorage);
}

function clearAllInputs(){
    $("input[type=text]").val("");
    $(".js-add-notes").val("");
    $("input[type=checkbox]").prop("checked", false);
}

//reset form
function formResetButton(){
    $(".js-reset").on('click', ()=>{
        console.log("formReset ran");
        clearAllInputs();
        clearEquipList();
        clearStorage();
    })
}

//close created message
function closeCreatedMessageButton(){
    $(".js-message-box").on("click", ".js-close-created-button",()=>{
        console.log('close created pressed');
        $(".js-message-box").empty();
        requestDataAPI(renderHTML_GET, "GET",null);
    })
}

//html string for showCreatedEmployee
function renderCreatedEmployee(data){
    console.log("render created employee ran",data);
    $('.js-message-box').html(`
        <div class="js-">
            <h2>Employee Created</h2>
            <p>${data.employeeName} has been created successfully!</p>
            <button 
            class="js-close-created-button" 
            type=button>
                Close
            </button>
        </div>
    `)
}

//collect notes
function collectNotes(){
    let inputNotes = $('.js-add-notes').val();
    employeeStorage.notes = inputNotes;
    console.log("collect notes ran",employeeStorage.notes);
}

//collect certificatin data
function collectCerts(){
    const {certifications} = employeeStorage
    $('input[name=certs]:checked')
        .each(function(){certifications.push($(this).val())});
    console.log(certifications);
}

//clear equipment list
function clearEquipList(storage){
    $(".js-equip-list").empty();
    console.log("clear equipment list ran");
}

//delete individual equipment items
function deleteEquipItemButton(){
    $(".js-equip-list").on("click", ".js-item-delete", function(event){

        let itemIndex = $(this)
            .closest('.js-equip-list').attr('item-index');

        console.log("deleting item at index:", itemIndex);

        employeeStorage.equipment.splice(itemIndex,1);
        renderAddEquipList(employeeStorage.equipment);

        console.log("",employeeStorage.equipment);

        if(employeeStorage.equipment.length === 0){
            clearEquipList();
        }
    });
}

//generate equipment list on form
function generateEquipList(item, index){
    return `
        <li class="js-equip-list" item-index="${index}">
            ${item} 
            <button 
            class="js-item-delete" 
            type="button">
                Delete
            </button>
        </li>
    ` 
}

//html for equipment list
function renderAddEquipList(equips){
    $(".js-equip-list").html(`
        <h3>Equipment List</h3>            
        <ol>
            ${(equips.map((item, index)=> 
                generateEquipList(item, index)))
            .join('')}
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

        console.log("collect equipment ran",employeeStorage.equipment);

        $('.js-equip-clear').val('');
        renderAddEquipList(equipment);
    };
}

//add equipment and make list on html 
function collectEquipmentButton(){
    $('.js-add-equip').on('click', ()=>{
        console.log("collect equipment button pressed");
        collectEquipment();

    });
}

//collect certificatin data
function collectCerts(){
    const {certifications} = employeeStorage
    $('input[name=certs]:checked')
        .each(function(){certifications.push($(this).val())});
    console.log("collect certs ran", employeeStorage.certifications);
}

//collect employee name for storage
function collectEmployeeName(){
    const {employeeName} = employeeStorage

    employeeName.firstName = $('#first-name').val();
    employeeName.middleInit = $('#middle-initial').val();
    employeeName.lastName = $('#last-name').val();

    console.log("collecting employee name", employeeStorage.employeeName);
}

//submit new employee
function createEmployeeSubmit(){
    $("#js-employee-form").on("submit", (event)=>{
        event.preventDefault();

        collectEmployeeName();
        collectCerts();
        collectNotes();

        console.log("Create employee submit ran",employeeStorage);

        requestDataAPI(renderCreatedEmployee,"POST",null,employeeStorage);

        clearAllInputs();
        clearEquipList();
        clearStorage();

        $(".js-button-box").empty();
        
        hideElement(".js-form");
    })
}


function renderSubmitButton(){
    $(".js-button-box").html(`
        <button 
            class="js-create create" 
            type="submit">Submit
        </button>
    `)
}

//create a new employee
function createEmployeeNavButton(){
    $(".js-create").on("click",()=>{
        console.log("creat a new employee nav pressed");
        hideElement(".js-landing");
        showElement(".js-form");
        renderSubmitButton();
        $(".js-legend").text("Create an Employee");
    })
}

function runThis(){
    argusButton();

    viewEmployeesButton();
    createEmployeeSubmit();
    createEmployeeNavButton();
    collectEquipmentButton();
    deleteEquipItemButton();
    formResetButton();
    closeCreatedMessageButton();
    editEmployeeButton();
    submitEditButton();
    closeEditMsg();
    employeeDeleteButton();
    verifyDeleteButtonNo();
    verifyDeleteButtonYes();
}

$(runThis);