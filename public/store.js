const employeeDefaults = {
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

let employeeState = {...employeeDefaults};

let pageStorage = {
  start: 0,
  pages: 1
};

let userState = {
  
};

let authState = {
  loading: false,
  authToken: '',
  username: ''
};