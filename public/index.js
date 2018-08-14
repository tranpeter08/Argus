//ajax request
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

function resetStorage(){
    if("id" in employeeStorage){
        delete employeeStorage.id;
    }

    clearAllInputs();
    clearEquipList();
    clearStorage();
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
    requestDataAPI(handleResGET,'GET',null,);
}

//no button on verify message
function verifyDeleteButtonNo(){
    $(".js-message-box")
    .on("click", ".js-verify-no", (event)=>{
        console.log("do not delete")

        requestDataAPI(handleResGET,'GET',null,);
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

        $(".js-empty").empty();
    })
}

//close edit message
function closeEditMsg(){
    $(".js-message-box").on("click",".js-close-edit-msg",()=>{
        
        requestDataAPI(handleResGET,'GET',null,);
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
        let firstName = $("#first-name").val();
        let lastName = $("#first-name").val();


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
        $(".js-empty").empty();
        
        requestDataAPI(fillEmployeeForm,"GET",employeeID, null);
        
    })
}

function lastButton(){
    $('.last-box').on('click','.last',()=>{

        
        let totalPages= pageStorage.pages 
      pageStorage.start=totalPages-1;
      console.log(pageStorage.start);
      requestDataAPI(renderHTML_GET,'GET',null, null);
      renderPrevButton();
      renderStart();
      $('.next-box').empty();
      $('.last-box').empty();

    })
  }
  
  function startButton(){
    $('.start-box').on('click','.start',()=>{
        
        pageStorage.start = 0;
        console.log(pageStorage.start);
      requestDataAPI(renderHTML_GET,'GET',null, null);
      renderNextButton();
      $('.prev-box').empty();
      $('.start-box').empty();
      if(pageStorage.pages>2){
        renderLast();
      }
    })
  }
  
  function nextButton(){
    $(".next-box").on('click','.next',()=>{
        pageStorage.start += 1;
      console.log(pageStorage);
      requestDataAPI(renderHTML_GET,'GET',null, null);
      if(pageStorage.start ===pageStorage.pages-1){
        $('.next-box').empty();
        $('.last-box').empty();
      }
      if(pageStorage.start >0){
        renderPrevButton();
      }
      if(pageStorage.pages>2){
        renderStart();
      }
    })
  }
  
  function prevButton(){
    $(".prev-box").on('click','.prev',()=>{
        pageStorage.start -= 1;
      console.log(pageStorage);
      requestDataAPI(renderHTML_GET,'GET',null, null);
      if(pageStorage.start<1){
        renderNextButton();
        $('.prev-box').empty();
        $('.start-box').empty();
      }
      if(pageStorage.start<pageStorage.pages-1){
        renderNextButton();
      }
      if(pageStorage.pages>2){
        renderLast();
      }
    })
  }

function renderLast(){
    $('.last-box').html(`
      <button class="last">Last</button>
    `)
  }
  
  function renderStart(){
    $('.start-box').html(`
      <button class="start">Start</button>
    `)
  }
  
  function renderPrevButton(){
    $('.prev-box').html(`
      <button class="prev">Prev</button>
    `)
  }
  
  function renderNextButton(){
    $('.next-box').html(`
      <button class="next">Next</button>
    `)
  }

function renderPageNum(){
    $(".js-page-num")
      .text(`Page ${pageStorage.start+1} of ${pageStorage.pages}`)
}


function listEquip(equipment){
    return equipment.map((item)=>`<li>${item}</li>`);
 }
 
 function listCerts(certs){
     return certs.map((aCert)=>`<li>${aCert}</li>`);
 }

//generate list from GET data
function handleDataList(anEmployee,index){
    console.log("handle GET data for HTML");
    const {
        certifications, employeeName, equipment, notes, id
    } = anEmployee;

    return `
        <li class="js-employee-list" employee-id="${id}">
            <div class="card">
                <div class= "content">
                    <h3 class="js-employee-name name">${index+1}) ${employeeName}</h3>
                    <hr>
                    <h4>Certifications:</h4>
                    <ul class="form">
                        ${listCerts(certifications).join('')}
                    </ul>
                    <h4>Equipment:</h4>
                    <ul class="equip-list form">
                        ${listEquip(equipment).join('')}
                    </ul>
                    <h4>Notes:</h4>
                    <p>${notes}</p>
                    <hr>
                </div>
                <div class="employee-button-box">
                    <button 
                    class="js-edit-employee-button employee-button" 
                    type="button">
                        Edit Employee
                    </button>
                    <button 
                    class="js-delete-employee employee-button">
                        Delete
                    </button>
                </div>
            </div>
        </li>        
    `
};

function divColumns(data, index){
    console.log('div columns');
    const columns = [];
    for(let n =3*index;n<(3+3*index);n++){
        if(!data[n]){
            columns.push(`
                <div class="col-4"></div>
            `)
        }else{
            columns.push(`
                <div class="col-4">${handleDataList(data[n],n)}</div>
            `);
        };
    };
    return columns;
};

function divRows(data){
    console.log('div rows');
    const rows = [];
    
    for(let i=3*pageStorage.start; i<3+3*pageStorage.start;i++){
        rows.push(`
            <div class="row">
                ${divColumns(data,i).join('')}
            </div>
        `);
    };
    return rows;
};

//render data from GET request to HTML
function renderHTML_GET(data){
    console.log('render GET HTML ran');
    
    $('.js-employees').html(`
        <div class="">
            <h2 class="employees">Employees</h2>
            
            <ul class="employee-list">
                ${divRows(data).join('')}
            </ul>
        </div>
    `);
    renderPageNum();
}
 
function handleResGET(data){
  
    let total = data.length;
    let pages = Math.ceil(total/9);
    pageStorage.pages = pages;
    console.log(pageStorage);
    
    renderHTML_GET(data);
    pageStorage.start = 0;

    if(total > 9){
        renderNextButton();
    }

    if(pages > 2){
        renderLast();
    }
}

 //view employees in database
function viewEmployeesButton(){
    $('.js-view').on('click',()=>{
        console.log('view button ran',pageStorage.start);
        requestDataAPI(handleResGET,'GET',null, null);

        resetStorage();
        $(".js-about").hide();
        $(".js-form").hide();
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

function cancelFormButton(){
    $(".js-cancel-form").on("click", ()=>{

        delete employeeStorage.id;

        clearAllInputs();
        clearEquipList();
        clearStorage();

        hideElement(".js-form");

        console.log(employeeStorage);
    })
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
        requestDataAPI(handleResGET, "GET",null);
    })
}

//html string for showCreatedEmployee
function renderCreatedEmployee(data){
    console.log("render created employee ran");
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
    console.log("collect notes ran");
}

//collect certificatin data
function collectCerts(){
    const {certifications} = employeeStorage
    $('input[name=certs]:checked')
        .each(function(){certifications.push($(this).val())});
    console.log('collecting certs');
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

        console.log("collect equipment ran");

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
    console.log("collect certs ran");
}

//collect employee name for storage
function collectEmployeeName(){
    const {employeeName} = employeeStorage

    employeeName.firstName = $('#first-name').val();
    employeeName.middleInit = $('#middle-initial').val();
    employeeName.lastName = $('#last-name').val();

    console.log("collecting employee name");
}

//submit new employee
function createEmployeeSubmit(){
    $("#js-employee-form").on("submit", (event)=>{
        event.preventDefault();

        collectEmployeeName();
        collectCerts();
        collectNotes();

        console.log("Create employee submit ran");

        requestDataAPI(
            renderCreatedEmployee,"POST",null,employeeStorage
        );

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
        showElement(".js-form");
        renderSubmitButton();
        $(".js-legend").text("Create an Employee");
        $(".js-empty").empty();
        $(".js-about").hide();
        resetStorage();
    })
}

function runThis(){
    argusButton();

    viewEmployeesButton();
    nextButton();
    prevButton();
    startButton();
    lastButton();
    createEmployeeSubmit();
    createEmployeeNavButton();
    collectEquipmentButton();
    deleteEquipItemButton();
    formResetButton();
    cancelFormButton();
    closeCreatedMessageButton();
    editEmployeeButton();
    submitEditButton();
    closeEditMsg();
    employeeDeleteButton();
    verifyDeleteButtonNo();
    verifyDeleteButtonYes();
}

$(runThis);