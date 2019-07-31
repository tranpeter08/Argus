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

function addEmployeeSubmit() {
  $('#root').on('submit', '#js-employee-form', event => {
    event.preventDefault();

    collectEmployeeName();
    collectEmployeeContact();
    collectCerts();
    collectNotes();

    ajaxReq(
      '/employeess',
      'POST',
      employeeFormState,
      addEmployeeOK,
      addEmployeeErr
    );
  })
}

function addEmployeeOK() {
  resetFormState();
  renderAddSuccess();
}

function renderAddSuccess(data) {
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

function addEmployeeErr({responseJSON: {message}}) {
  $('.js-employee-form-error').html(`
    <p class='error'>${message}</p>
  `);
}

$(addEmployeeSubmit());