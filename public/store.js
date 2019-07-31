let authState = {
  loading: false,
  authToken: '',
  username: ''
};

let registerState = {userData: ''};

let employeesState = {employees: ''};

let employeeFormDefaults = {
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
  current: 1,
  pages: ''
};