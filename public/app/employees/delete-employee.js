function renderVerifyDelete(name) {
  $('#root').html(`
    <div class='message-box'>
      <p>Are you sure you want to delete ${name}?</p>
      <button class="js-delete-yes verify">Yes</button>
      <button class="js-delete-no verify">No</button>
      <div class='js-employee-delete-error'></div>
    </div>
  `);
}

function deleteEmployeeYes() {
  $('#root').on('click', '.js-delete-yes', () => {
    ajaxReq(
      `/employees/${employeeId}`,
      'DELETE',
      null,
      deleteEmployeeOK,
      deleteEmployeeErr
    );
  });
}

function deleteEmployeeNo() {
  $('#root').on('click', '.js-delete-no', () => {
    employeesRender();
    const elem = document.getElementById(employeeId);
    elem.scrollIntoView(true);
    employeeId = '';
  });
}

function deleteEmployeeOK() {
  const {employees} = employeesState;
  const results = employees.filter(employee => employee.id !== employeeId);

  employeesState.employees = results;

  handlePaging();

  const {current, pages} = pageState;

  if (current > pages) {
    pageState.current--;
  }

  employeesRender();
}

function deleteEmployeeErr({responseJSON: {message}}) {
  $('.js-employee-delete-error').html(`
    <p class='error'>${message}</p>
  `);
}

$(
  deleteEmployeeYes(),
  deleteEmployeeNo()
);