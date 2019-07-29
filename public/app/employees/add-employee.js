function renderAddForm() {
  $('#root').html(employeeForm);
  $('.js-employee-form-legend').text('Create an Employee');
  renderSubmitButton();
}

function renderSubmitButton() {
  $('.js-button-box').html(`
    <button 
      class="js-create-submit create form-button" 
      type="submit">Submit
    </button>
  `);
}

function createEmployeeSubmit() {
  $('#js-employee-form').on('submit', (event)=>{
    event.preventDefault();

    collectEmployeeName();
    collectEmployeeContact();
    collectCerts();
    collectNotes();

    requestDataAPI(
      renderCreatedEmployee, 'POST', null, employeeFormState
    );

    clearAllInputs();
    clearEquipList();
    resetState();

    $('.js-button-box').empty();
    
    hideElement('.js-form');
  })
}

$();