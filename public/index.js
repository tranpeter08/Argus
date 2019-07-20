'use strict';

function requestDataAPI(aFunction, method, anID, data) {
  let url = '/employees';
  
  // let getID = anID
  // if(!anID){
  //     getID = '';
  // }
  console.log(anID === true);

  if (anId) {
    url = url + '/' + anID;
  }

  const settings= {
    url,
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(data),
    method: method,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + userStoreage.authToken)
    }
  }
  $.ajax(settings)
  .done(aFunction)
  .fail((err)=>{
      console.log('Failed response',err);
  });
}

function resetStorage(){
  if ('id' in employeeStorage) {
    delete employeeStorage.id;
  }

  clearAllInputs();
  clearEquipList();
  clearStorage();
}

function showElement(selector) {
  $(selector).show();
}

function hideElement(selector) {
  $(selector).hide();
}

function handleDelete() {
  $('.js-verify-delete').html(`
    <p>Employee has been deleted</p>
    <button class="js-close-deleted close">Close</button>
  `);
  requestDataAPI(handleResGET, 'GET', null);
}

function verifyDeleteButtonNo() {
  $('.js-message-box').on('click', '.js-verify-no', event => {
    requestDataAPI(handleResGET, 'GET', null);
    $('.js-message-box').empty();
  });
}

function verifyDeleteButtonYes() {
  $('.js-message-box').on('click', '.js-verify-yes', () => {

    const anID = employeeStorage.id;
    requestDataAPI(handleDelete,'DELETE',anID);

    delete employeeStorage.id;
    $('.js-message-box').empty();
  });
}

function renderVerifyDelete(employee) {
  $('.js-message-box').html(`
    <div class='message-box'>
      <p>Are you sure you want to delete ${employee}?</p>
      <button class="js-verify-yes verify">Yes</button>
      <button class="js-verify-no verify">No</button>
    </div>
  `);
}

function employeeDeleteButton() {
  $('.js-employees').on('click', '.js-delete-employee', function(event) {
    const employeeID = $(this)
      .closest('.js-employee-list')
      .attr('employee-id');

    employeeStorage.id = employeeID;

    const selectedEmployee =  $(this)
      .closest('.js-employee-list')
      .find('.js-employee-name').text();

    renderVerifyDelete(selectedEmployee);

    $('.js-empty').empty();
  });
}

function closeEditMsg() {
  $('.js-message-box').on('click', '.js-close-edit-msg', () => {
      
    requestDataAPI(handleResGET, 'GET', null);
    $('.js-message-box').empty();
  });
}

function successfulEditMsg() {
  $('.js-message-box').html(`
    <div class='message-box'>
      <p>Employee update successful!</p>
      <button class="js-close-edit-msg close-edit">Close</button>
    </div>
  `);
}

function submitEditButton() {
  $('.js-button-box').on('click','.js-submit-edit',(event)=>{
    event.preventDefault();
    let firstName = $('#first-name').val();
    let lastName = $('#first-name').val();

    const employeeID = employeeStorage.id

    collectEmployeeName();
    collectEmployeeContact();
    collectCerts();
    collectNotes();
    requestDataAPI(
      successfulEditMsg, 'PUT', employeeID, employeeStorage
    );

    delete employeeStorage.id;

    clearAllInputs();
    clearEquipList();
    clearStorage();

    $('.js-button-box').empty();
    hideElement('.js-form');
  });
}

function selectEmployeeCerts(certs) {
  certs.forEach(cert => {
    $(`#${cert}`).prop('checked', true);
  })
}

function fillEmployeeForm(data) {
  const {
      employeeName: {firstName, middleInit, lastName}, 
      contact: {phone, email}, 
      certifications, 
      equipment, 
      _id, 
      notes
  } = data;

  $('.js-legend').text(`
      Editing '${firstName} ${middleInit} ${lastName}'
  `);

  employeeStorage.equipment = equipment;
  employeeStorage.id = _id;

  $('#first-name').val(firstName);
  $('#middle-initial').val(middleInit);
  $('#last-name').val(lastName);
  $('#phone').val(phone);
  $('#email').val(email);

  selectEmployeeCerts(certifications);
  renderAddEquipList(equipment);

  $('.js-add-notes').val(notes);
}


function renderSubmitEditButton() {
  $('.js-button-box').html(`
    <button 
      class="js-submit-edit submit-edit form-button" 
      type="button"
    >
      Submit Edit Employee
    </button>
  `);
}

function editEmployeeButton() {
  $('.js-employees')
  .on('click', '.js-edit-employee-button', function(event){

    const employeeID = $(this)
    .closest('.js-employee-list').attr('employee-id');

    showElement('.js-form');
    renderSubmitEditButton();
    $('.js-empty').empty();
    
    requestDataAPI(fillEmployeeForm,'GET',employeeID, null);
  });
}

function lastButton() {
  $('.last-box').on('click', '.last', () => {

    let totalPages = pageStorage.pages;
    pageStorage.start = totalPages - 1;

    requestDataAPI(renderHTML_GET, 'GET', null, null);
    renderPrevButton();
    renderStart();
    $('.next-box').empty();
    $('.last-box').empty();

    window.scrollTo({
      top:0,
      behavior: 'smooth'
    });
  });
}
  
function startButton() {
  $('.start-box').on('click', '.start', () => {
      
    pageStorage.start = 0;
    requestDataAPI(renderHTML_GET, 'GET', null, null);
    renderNextButton();
    $('.prev-box').empty();
    $('.start-box').empty();
    if (pageStorage.pages > 2) {
      renderLast();
    }

    window.scrollTo({
      top:0,
      behavior: 'smooth'
    });
  });
}
  
function nextButton() {
  $('.next-box').on('click', '.next', () => {
    pageStorage.start += 1;
    requestDataAPI(renderHTML_GET, 'GET', null, null);

    if (pageStorage.start === pageStorage.pages - 1) {
      $('.next-box').empty();
      $('.last-box').empty();
    }

    if (pageStorage.start > 0) {
      renderPrevButton();
    }

    if (pageStorage.pages > 2) {
      renderStart();
    }

    window.scrollTo({
      top:0,
      behavior: 'smooth'
    });
  });
}
  
function prevButton() {
  $('.prev-box').on('click', '.prev', () => {
    pageStorage.start -= 1;
    requestDataAPI(renderHTML_GET, 'GET', null, null);

    if (pageStorage.start < 1) {
      renderNextButton();
      $('.prev-box').empty();
      $('.start-box').empty();
    }

    if (pageStorage.start < pageStorage.pages - 1) {
      renderNextButton();
    }

    if (pageStorage.pages > 2) {
      renderLast();
    }

    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  });
}

function renderLast() {
    $('.last-box').html(`<button class="last">Last</button>`);
}
  
function renderStart() {
  $('.start-box').html(`<button class="start">Start</button>`);
}

function renderPrevButton() {
  $('.prev-box').html(`<button class="prev">Prev</button>`);
}

function renderNextButton() {
  $('.next-box').html(`<button class="next">Next</button>`);
}

function renderPageNum() {
  if (pageStorage.pages === 0) {
    $('.js-page-num').text(`Page 1 of 1`);
  } else {
    $('.js-page-num')
    .text(`Page ${pageStorage.start +1} of ${pageStorage.pages}`)
  }
}

function listEquip(equipment) {
  return equipment.map(item => `<li>${item}</li>`);
 }
 
function listCerts(certs) {
  return certs.map(cert => `<li>${cert}</li>`);
}

function handleDataList(anEmployee, index) {
  const {
    certifications, employeeName, equipment, notes, id, phone, email
  } = anEmployee;

  return `
    <li class="js-employee-list flex-item" employee-id="${id}">
      <div class="card">
        <div class= "content">
          <h3 class="js-employee-name name">#${index+1} ${employeeName}</h3>
          <hr>
          <h4>Contact Info:</h4>
          <p>Phone: ${phone}</p> 
          <p>E-mail: <a href="mailto:${email}">${email}</a></p>  
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
            class='js-edit-employee-button employee-button employee-button-edit'
            type='button'
          >
            Edit
          </button>
          <button 
            class="js-delete-employee employee-button"
          >
            Delete
          </button>
        </div>
      </div>
    </li>        
  `
};

function flexItems(data) {
  const items = [];
  for (let n = pageStorage.start * 9; n < pageStorage.start * 9 + 9; n++) {
    if (data[n]) {
      items.push(`${handleDataList(data[n], n)}`);
    }
  }

  return items;
}

function renderHTML_GET(data) {
  $('.js-employees').html(`
    <div class=''>
      <h2 class='employees'>Employees</h2>
      
      <ul class='employee-list flex-container'>
        ${flexItems(data).join('')}
      </ul>
    </div>
  `);

  renderPageNum();
}
 
function handleResGET(data) {
  let total = data.length;
  let pages = Math.ceil(total / 9);
  pageStorage.pages = pages;
  
  renderHTML_GET(data);
  pageStorage.start = 0;

  if (total > 9) {
    renderNextButton();
  }

  if (pages > 2) {
    renderLast();
  }
}

function viewEmployeesButton() {
  $('.js-view').on('click',()=>{

    requestDataAPI(handleResGET, 'GET', null, null);

    resetStorage();
    $('.js-about').hide();
    $('.js-form').hide();
  });
}

function clearStorage() {

    employeeStorage.employeeName.firstName = '';
    employeeStorage.employeeName.lastName = '';
    employeeStorage.employeeName.middleInit = '';
    employeeStorage.certifications = [];
    employeeStorage.equipment = [];
    employeeStorage.notes = '';
    employeeStorage.contact.phone = '';
    employeeStorage.contact.email = '';
}

function cancelFormButton() {
  $('.js-cancel-form').on('click', () => {

    delete employeeStorage.id;

    clearAllInputs();
    clearEquipList();
    clearStorage();

    requestDataAPI(handleResGET, 'GET', null, null);

    hideElement('.js-form');
  });
}

function clearAllInputs() {
  $('input[type=text]').val('');
  $('.js-add-notes').val('');
  $('.js-contact').val('');
  $('input[type=checkbox]').prop('checked', false);
}

function formResetButton() {
  $('.js-reset').on('click', () => {
    clearAllInputs();
    clearEquipList();
    clearStorage();
  });
}

function closeCreatedMessageButton() {
  $('.js-message-box').on('click', '.js-close-created-button', () => {
      
    $('.js-message-box').empty();
    requestDataAPI(handleResGET, 'GET', null);
  });
}

function renderCreatedEmployee(data) {
  $('.js-message-box').html(`
    <div class='message-box'>
      <h2>Employee Created</h2>
      <p>${data.employeeName} has been created successfully!</p>
      <button 
        class='js-close-created-button close-created' 
        type='button'
      >
        Close
      </button>
    </div>
  `);
}

function collectNotes() {
  employeeStorage.notes = $('.js-add-notes').val();
}

function collectCerts() {
  $('input[name=certs]:checked')
    .each(function() {
      employeeStorage.certifications.push($(this).val());
    });
}

function clearEquipList(storage) {
  $('.js-equip-list').empty();
}

function clearEquipListButton() {
  $('.js-list-clear').on('click', () => {
    clearEquipList();
    employeeStorage.equipment = [];
  });
}

function deleteEquipItemButton() {
  $('.js-equip-list').on('click', '.js-item-delete', function(event) {
    const itemIndex = $(this)
      .closest('.js-equip-list')
      .attr('item-index');

    employeeStorage.equipment.splice(itemIndex, 1);
    renderAddEquipList(employeeStorage.equipment);

    if (employeeStorage.equipment.length === 0) {
      clearEquipList();
    }
  });
}

function generateEquipList(item, index) {
  return `
    <li class="js-equip-list" item-index="${index}">
      ${item} 
      <button 
        class="js-item-delete delete-equip form-button" 
        type="button"
      >
        Delete
      </button>
    </li>
  ` 
}

function renderAddEquipList(equips) {
  $('.js-equip-list').html(`
    <h3>Equipment List</h3>            
    <ol>
      ${
        (equips.map((item, index) => generateEquipList(item, index))).join('')
      }
    </ol>
  `);
}

function collectEquipment() {
  let equipName = $('#equipment-name').val();
  let equipNumber = $('#equipment-number').val();
  let equipDesc;

  if (!equipNumber) {
    equipNumber = 'N/A';
  }

  equipDesc = `${equipName} (${equipNumber})`;

  if (equipName) {
    employeeStorage.equipment.push(equipDesc);

    $('.js-equip-clear').val('');
    renderAddEquipList(equipment);
  };
}

function collectEquipmentButton() {
  $('.js-add-equip').on('click', ()=>{
    collectEquipment();
  });
}

function collectCerts() {
  $('input[name=certs]:checked').each(function() {
    employeeStorage.certifications.push($(this).val());
  });
}

function collectEmployeeContact() {
  const phone = $('#phone').val();
  const email = $('#email').val();
  employeeStorage.contact = {phone, email};
}

function collectEmployeeName() {
  const firstName = $('#first-name').val();
  const middleInit = $('#middle-initial').val();
  const lastName = $('#last-name').val();

  employeeStorage.employeeName = {firstName, middleInit, lastName};
}

function createEmployeeSubmit() {
  $('#js-employee-form').on('submit', (event)=>{
    event.preventDefault();

    collectEmployeeName();
    collectEmployeeContact();
    collectCerts();
    collectNotes();

    requestDataAPI(
      renderCreatedEmployee, 'POST', null, employeeStorage
    );

    clearAllInputs();
    clearEquipList();
    clearStorage();

    $('.js-button-box').empty();
    
    hideElement('.js-form');
  })
}

function renderSubmitButton() {
  $('.js-button-box').html(`
    <button 
      class="js-create-submit create form-button" 
      type="submit">Submit
    </button>
  `);
}

function createEmployeeNavButton() {
  $('.js-create').on('click', () => {
    showElement('.js-form');
    renderSubmitButton();
    $('.js-legend').text('Create an Employee');
    $('.js-empty').empty();
    $('.js-about').hide();
    resetStorage();
  });
}

function docReady() {
  viewEmployeesButton();
  nextButton();
  prevButton();
  startButton();
  lastButton();
  createEmployeeSubmit();
  createEmployeeNavButton();
  collectEquipmentButton();
  clearEquipListButton();
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

$(docReady);