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
    console.log('submit');
    event.preventDefault();

    collectEmployeeName();
    collectEmployeeContact();
    collectCerts();
    collectNotes();

    

    resetState();
  })
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

$(addEmployeeSubmit());