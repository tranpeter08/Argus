let authState = {
  loading: false,
  authToken: '',
  username: ''
};

let registerState = {userData: ''};

let employeesState = {employees: ''};

const employeeFormDefaults = {
  employeeName: {
    firstName: '',
    middleInit: '',
    lastName: ''
  },
  contact: {
    phone: '',
    email: ''
  },
  certifications: [], 
  equipment: [],
  notes: ''
}

let employeeFormState = {...employeeFormDefaults};

let pageStorage = {
  start: 0,
  pages: 1
};