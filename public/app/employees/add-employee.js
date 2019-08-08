const addClassName = 'js-employee-form-add';

function renderAddForm() {
  $('#root').html(employeeForm);
  formClassName(addClassName);
  formLegendText('Add an Employee');
}

function addEmployeeSubmit() {
  const selector = `.${addClassName}`;
  $('#root').on('submit', selector, event => {
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

function addEmployeeOK(data) {
  resetFormState();
  renderAddSuccess(data);
}

function renderAddSuccess(data) {
  $('#root').html(`
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

function closeCreated() {
  $('#root').on('click', '.js-close-created-button', () => {
    getEmployees(renderLastPage, employeesError);
  });
}

function renderLastPage(data) {
  storeEmployees(data);
  handlePaging();
  pageState.current = pageState.pages;
  employeesRender();
}

$(
  addEmployeeSubmit(),
  closeCreated()
);