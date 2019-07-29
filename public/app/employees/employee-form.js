const employeeForm = `
  <section class="js-form">
    <form class="" id="js-employee-form" action="#" >
      <fieldset>
        <legend class="js-employee-form-legend main-legend"></legend>
        <div class="form-content">
          <div class="row">
            <div class="col-6">
              <h2>Employee Name</h2>
              <div>
              <label for="first-name" >First</label>
              <input
                class="name"
                type="text"
                name="first-name"
                id="first-name" required autofocus>
              </div>
              <div>
                <label for="middle-initial">Middle Initial</label>
                  <input 
                    class="name"
                    type="text" 
                    name="middle-initial" 
                    id="middle-initial" 
                    maxlength ="1">
              </div>
              <div>
                <label for="last-name">Last</label>
                <input 
                  class="name"
                  type="text" 
                  name="last-name" 
                  id="last-name" required>
              </div>
            </div>
            <div class="col-6">  
              <h2>Contact Information</h2>

              <label for="phone">Telephone</label>
              <input type="text" id="phone" name="phone"
                class="js-contact"
                placeholder="123-456-7890"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                required
              ><span class="validity"></span>
              <br>
              <label for="email">E-mail</label>
              <input type="email" id="email" name="email"
                class="js-contact"
                placeholder="name@domain.com"
                required
              ><span class="validity"></span>
            </div>
          </div>

          <div class="row">
            <div class="col-6">
              <h2>Equipment</h2>

              <label for="equipment-name">Description/Name</label>
              <input 
                class="js-equip-clear" 
                type="text" 
                id="equipment-name">
                <br>
              <label for="equipment-number">Part Number</label>
              <input 
                class="js-equip-clear"  
                type="text" 
                id="equipment-number">
                <br>
              <button 
                class="js-add-equip form-button add-equip" 
                type="button">add Equipment</button>

              <button 
                class="js-list-clear form-button" 
                type="button">Clear List</button>

              <div class="js-equip-list equip-list"></div>
            </div>
          
            <div class="col-6">


              <fieldset>
                <legend class="cert-legend">Certifications</legend>
                <label for="CWI" class="certs">
                  <input 
                  type= "checkbox" 
                  name="certs" 
                  id="CWI" 
                  value ="CWI">
                  Certified Welding Inspector (A.W.S.)</label>
                
                <label for="UT" class="certs">
                  <input 
                  type= "checkbox" 
                  name="certs" 
                  id="UT" 
                  value="UT">
                  Ultrasonic Testing</label>
                
                <label for="MT" class="certs">
                  <input 
                  type= "checkbox" 
                  name="certs" 
                  id="MT" 
                  value="MT">
                  Magnatic Particle Testing</label>
                
                <label for="GPR" class="certs">
                    <input 
                    type= "checkbox" 
                    name="certs" 
                    id="GPR" 
                    value="GPR">
                    Ground Penetrating Radar</label>
                
                <label for="soils" class="certs">
                    <input 
                    type= "checkbox" 
                    name="certs" 
                    id="soils" 
                    value="soils">
                    Soils Inspector</label>

                <label for="concrete" class="certs">
                    <input 
                    type= "checkbox" 
                    name="certs" 
                    id="concrete" 
                    value="concrete">
                    Concrete Inspector</label>
              </fieldset>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <h2>Notes</h2>

              <textarea 
                aria-label="textarea"
                class="js-add-notes" 
                name="" 
                id="" cols="30" rows="10"></textarea>
            </div>
          </div>
          <div class="row form-control">
            <div class="col-4">
              <button 
                class="js-reset form-button" 
                type="reset">Clear Form
              </button>
            </div>
            <div class="col-4">
              <button 
                type="button" 
                class="js-cancel-form form-button ">Cancel
              </button>
            </div>
            <div class="col-4">
              <div class="js-button-box" ></div>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  </section>
`;

function addEquipment() {
  $('#root').on('click', '.js-add-equip', () => {
    storeEquipment();
  });
}

function storeEquipment() {
  let equipName = $('#equipment-name').val();
  let equipNumber = $('#equipment-number').val();
  let equipDesc;

  if (!equipNumber) {
    equipNumber = 'N/A';
  }

  equipDesc = `${equipName} (${equipNumber})`;

  if (equipName) {
    employeeFormState.equipment.push(equipDesc);

    $('.js-equip-clear').val('');
    renderAddEquipList(employeeFormState.equipment);
  };
}

function clearEquipList() {
  $('#root').on('click', '.js-list-clear', () => {
    $('.js-equip-list').empty();
    employeeFormState.equipment = [];
  });
}

$(
  clearEquipList(),
  addEquipment()
);