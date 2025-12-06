/***********************
 * PROJECTS: Isotope + Filters + Pagination
 ***********************/
var itemsPerPageDefault = 5;
var currentNumberPages = 1;
var currentPage = 1;
var currentFilter = '*';
var pageAtribute = 'data-page-project';
var pagerClass = 'isotope-pager-project';

var $projects = $('#projects-grid').isotope({
  itemSelector: '.project',
  layoutMode: 'vertical'
});

function filterCategoryProjects(selector) {
  $projects.isotope({ filter: selector });
}

function setPaginationProjects() {
  $projects.children('.project').removeAttr(pageAtribute);

  var $filteredItems = (currentFilter === '*')
    ? $projects.children('.project')
    : $projects.children('.project').filter(currentFilter);

  var item = 1;
  var page = 1;

  $filteredItems.each(function () {
    if (item > itemsPerPageDefault) {
      page++;
      item = 1;
    }
    $(this).attr(pageAtribute, page);
    item++;
  });

  currentNumberPages = Math.max(page, 1);
}

function showPageProjects(n) {
  currentPage = n;

  var selector = '.project[' + pageAtribute + '="' + currentPage + '"]';
  if (currentFilter !== '*') selector += currentFilter;

  filterCategoryProjects(selector);
}

function updatePagerProjects() {
  var $pager = ($('.' + pagerClass).length === 0)
    ? $('<div class="' + pagerClass + '"></div>')
    : $('.' + pagerClass);

  $pager.html('');

  var $previous = $('<button class="pager" id="previous-page">&#8592; previous</button>');
  $previous.click(function () {
    if (currentPage > 1) {
      showPageProjects(currentPage - 1);
      updatePagerProjects();
      scrollToTopDiv('#projects');
    }
  });
  if (currentPage === 1) $previous.prop('disabled', true);

  var $next = $('<button class="pager" id="next-page">next &#8594;</button>');
  $next.click(function () {
    if (currentPage < currentNumberPages) {
      showPageProjects(currentPage + 1);
      updatePagerProjects();
      scrollToTopDiv('#projects');
    }
  });
  if (currentPage === currentNumberPages) $next.prop('disabled', true);

  var $indicator = $('<span class="current-page">&nbsp; page ' + currentPage + ' of ' + currentNumberPages + ' &nbsp;</span>');

  $previous.appendTo($pager);
  $indicator.appendTo($pager);
  $next.appendTo($pager);

  $projects.after($pager);
}

function initializeIsotopeProjects() {
  setPaginationProjects();
  showPageProjects(1);
  updatePagerProjects();

  $('#filters-project .filter-button').off('click').on('click', function () {
    $('#filters-project .filter-button').removeClass('active');
    $(this).addClass('active');

    currentFilter = $(this).attr('data-filter'); // "*" or ".adhd"

    setPaginationProjects();
    showPageProjects(1);
    updatePagerProjects();

    $projects.isotope('layout');
  });
}

// Re-layout when abstracts expand/collapse
$('.collapse').on('shown.bs.collapse hidden.bs.collapse', function () {
  $projects.isotope('layout');
});
