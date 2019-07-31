const addClassName = 'js-employee-form-add';

function renderAddForm() {
  $('#root').html(employeeForm);
  formClassName(addClassName);
  formLegendText('Add an Employee');
  formSubmitBtnText('Add Employee');
}

function addEmployeeSubmit() {
  const className = `.${addClassName}`;
  $('#root').on('submit', className, event => {
    event.preventDefault();

    collectEmployeeName();
    collectEmployeeContact();
    collectCerts();
    collectNotes();

    ajaxReq(
      '/employees',
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