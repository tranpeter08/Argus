function handlePaging() {
  const total = employeesState.employees.length;
  const pages = Math.ceil(total / 9);

  pageStorage.pages = pages;

  renderPageNum();

  if (total > 9) {
    renderNextButton();
  }

  if (pages > 2) {
    renderLast();
  }
}

function renderPageNum() {
  if (pageStorage.pages === 0) {
    $('.js-page-num').text(`Page 1 of 1`);
  } else {
    $('.js-page-num')
    .text(`Page ${pageStorage.start +1} of ${pageStorage.pages}`)
  }
}
  
function startButton() {
  $('#root').on('click', '.start', () => {
      
    pageStorage.start = 0;
    
    employeesRender();
    renderNextButton();
    $('.prev-box').empty();
    $('.start-box').empty();

    if (pageStorage.pages > 2) {
      renderLast();
    }

    window.scrollTo({
      top:0,
      behavior: 'smooth'
    });
  });
}
  
function nextButton() {
  $('#root').on('click', '.next', () => {
    pageStorage.start += 1;
    employeesRender();

    if (pageStorage.start === pageStorage.pages - 1) {
      $('.next-box').empty();
      $('.last-box').empty();
    }

    if (pageStorage.start > 0) {
      renderPrevButton();
    }

    if (pageStorage.pages > 2) {
      renderStart();
    }

    window.scrollTo({
      top:0,
      behavior: 'smooth'
    });
  });
}
  
function prevButton() {
  $('#root').on('click', '.prev', () => {
    pageStorage.start -= 1;
    employeesRender();

    if (pageStorage.start < 1) {
      renderNextButton();
      $('.prev-box').empty();
      $('.start-box').empty();
    }

    if (pageStorage.start < pageStorage.pages - 1) {
      renderNextButton();
    }

    if (pageStorage.pages > 2) {
      renderLast();
    }

    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  });
}

function lastButton() {
  $('#root').on('click', '.last', () => {

    let totalPages = pageStorage.pages;
    pageStorage.start = totalPages - 1;

    requestDataAPI(renderHTML_GET, 'GET', null, null);
    renderPrevButton();
    renderStart();
    $('.next-box').empty();
    $('.last-box').empty();

    window.scrollTo({
      top:0,
      behavior: 'smooth'
    });
  });
}

function renderLast() {
  $('.last-box').html(`<button class="last">Last</button>`);
}
  
function renderStart() {
  $('.start-box').html(`<button class="start">Start</button>`);
}

function renderPrevButton() {
  $('.prev-box').html(`<button class="prev">Prev</button>`);
}

function renderNextButton() {
  $('.next-box').html(`<button class="next">Next</button>`);
}