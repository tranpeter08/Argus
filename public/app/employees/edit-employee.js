const editClassName = 'js-employee-form-edit';
const editOkMsg = `
  <div class='message-box'>
    <p>Employee update successful!</p>
    <button class="js-close-edit-msg close-edit">Close</button>
  </div>
`;

function renderEditForm() {
  $('#root').html(employeeForm);

  formClassName(editClassName);
  formSubmitBtnText('Edit Employee');
  scrollTop();
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

  formLegendText(`Editing ${firstName} ${middleInit} ${lastName}`);

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

function submitEdit() {
  const selector = `.${editClassName}`;
  $('#root').on('submit', selector, event => {
    event.preventDefault();

    const employeeID = employeeFormState.id;

    collectEmployeeName();
    collectEmployeeContact();
    collectCerts();
    collectNotes();

    ajaxReq(
      `employees/${employeeID}`,
      'PUT',
      employeeFormState,
      employeeEditOK,
      employeeEditErr
    );
  });
}

function employeeEditOK() {
  renderEditOk();
}

function employeeEditErr() {
  console.log('error')

}

function renderEditOk() {
  $('#root').html(editOkMsg);
}

function closeEditMsg() {
  $('#root').on('click', '.js-close-edit-msg', () => {
    getEmployees(scrollToEdited, employeesError);
  });
}

function scrollToEdited(data) {
  employeesSuccess(data);
  const elem = document.getElementById(employeeFormState.id);
  elem.scrollIntoView(true);
  resetFormState();
}

$(
  closeEditMsg(),
  submitEdit()
);