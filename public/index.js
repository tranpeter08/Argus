'use strict';

function ajaxReq(url, method, data, handleSuccess, handleError, isPublic) {
  const settings = {
    url,
    dataType: 'json',
    contentType: 'application/json',
    method
  }

  if (data) {
    settings.data = JSON.stringify(data);
  }

  if (!isPublic) {
    settings.headers = {
      'Authorization': `Bearer ${authState.authToken}`
    }
  }

  $.ajax(settings)
  .done(handleSuccess)
  .fail(handleError);
}

function requestDataAPI(aFunction, method, id, data) {
  let url = '/employees';

  if (id) {
    url = url + '/' + id;
  }

  const settings = {
    url,
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(data),
    method: method,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + userState.authToken)
    }
  }

  $.ajax(settings)
  .done(aFunction)
  .fail((err)=>{
      console.log('Failed response',err);
  });
}

function resetStorage(){
  clearAllInputs();
  clearEquipList();
  resetState();
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

    const anID = employeeFormState.id;
    requestDataAPI(handleDelete,'DELETE',anID);

    delete employeeFormState.id;
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

    employeeFormState.id = employeeID;

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

    const employeeID = employeeFormState.id

    collectEmployeeName();
    collectEmployeeContact();
    collectCerts();
    collectNotes();
    requestDataAPI(
      successfulEditMsg, 'PUT', employeeID, employeeFormState
    );

    delete employeeFormState.id;

    clearAllInputs();
    clearEquipList();
    resetState();

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

  employeeFormState.equipment = equipment;
  employeeFormState.id = _id;

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


function resetState() {
  employeeFormState = {...employeeFormDefaults};
}

function cancelFormButton() {
  $('.js-cancel-form').on('click', () => {

    delete employeeFormState.id;

    clearAllInputs();
    clearEquipList();
    resetState();

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
    resetState();
  });
}

function closeCreatedMessageButton() {
  $('.js-message-box').on('click', '.js-close-created-button', () => {
      
    $('.js-message-box').empty();
    requestDataAPI(handleResGET, 'GET', null);
  });
}


function collectNotes() {
  employeeFormState.notes = $('.js-add-notes').val();
}

function collectCerts() {
  $('input[name=certs]:checked').each(function() {
    employeeFormState.certifications.push($(this).val());
  });
}

function clearEquipListDOM() {
  $('.js-equip-list').empty();
}

function clearEquipmentStore() {
  employeeFormState.equipment = [];
}



function deleteEquipItemButton() {
  $('.js-equip-list').on('click', '.js-item-delete', function(event) {
    const itemIndex = $(this)
      .closest('.js-equip-list')
      .attr('item-index');

    employeeFormState.equipment.splice(itemIndex, 1);
    renderAddEquipList(employeeFormState.equipment);

    if (employeeFormState.equipment.length === 0) {
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



function collectCerts() {
  $('input[name=certs]:checked').each(function() {
    employeeFormState.certifications.push($(this).val());
  });
}

function collectEmployeeContact() {
  const phone = $('#phone').val();
  const email = $('#email').val();
  employeeFormState.contact = {phone, email};
}

function collectEmployeeName() {
  const firstName = $('#first-name').val();
  const middleInit = $('#middle-initial').val();
  const lastName = $('#last-name').val();

  employeeFormState.employeeName = {firstName, middleInit, lastName};
}




function docReady() {
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