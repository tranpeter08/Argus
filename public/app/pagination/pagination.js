function handlePaging() {
  const total = employeesState.employees.length;
  const pages = Math.ceil(total / 9);

  pageStorage.pages = pages;
}

function renderPageNum() {
  const {current, pages} = pageStorage;
  if (pages === 0) {
    $('.js-page-num').text(`Page 1 of 1`);
  } else {
    $('.js-page-num')
    .text(`Page ${current} of ${pages}`)
  }
}

function scrollTop() {
  window.scrollTo({
    top:0,
    behavior: 'auto'
  });
}
  
function firstPage() {
  $('#root').on('click', '.start', () => {
    pageStorage.current = 1;
    employeesRender();
    scrollTop()
  });
}
  
function nextPage() {
  $('#root').on('click', '.next', () => {
    pageStorage.current += 1;
    employeesRender();
    scrollTop();
  });
}
  
function prevPage() {
  $('#root').on('click', '.prev', () => {
    pageStorage.current -= 1;
    employeesRender();
    scrollTop();
  });
}

function lastPage() {
  $('#root').on('click', '.last', () => {
    pageStorage.current = pageStorage.pages;
    employeesRender();
    scrollTop();
  });
}
  
function startBtn() {
  const {current, pages} = pageStorage;
  if (pages > 2 && current > 1) {
    return `<button class="start">Start</button>`;
  }

  return '';
}

function nextBtn() {
  const {current, pages} = pageStorage;
  if (current !== pages) {
    return `<button class="next">Next</button>`;
  }

  return '';
}

function prevBtn() {
  if (pageStorage.current > 1) {
    return `<button class="prev">Prev</button>`;
  }

  return '';
}

function lastBtn() {
  const {current, pages} = pageStorage;

  if (pages > 2 && current !== pages) {
    return `<button class="last">Last</button>`;
  }

  return '';
}

$(
  firstPage(),
  prevPage(),
  nextPage(),
  lastPage()
);