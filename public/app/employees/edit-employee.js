const editClassName = 'js-employee-form-edit';

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
  resetFormState();
  console.log('sucess')
}

function employeeEditErr() {
  console.log('error')

}

$(submitEdit());