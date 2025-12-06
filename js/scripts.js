/***********************
 * PROJECTS: Isotope + Filters + Pagination
 ***********************/

// Settings
var itemsPerPageDefault = 5;
var currentNumberPages = 1;
var currentPage = 1;
var currentFilter = '*';
var pageAtribute = 'data-page-project';
var pagerClass = 'isotope-pager-project';

// Initialize Isotope correctly
var $projects = $('#projects').isotope({
  itemSelector: '.project',
  layoutMode: 'vertical'
});

// Filter helper
function filterCategoryProjects(selector) {
  $projects.isotope({ filter: selector });
}

// Assign page numbers to filtered items
function setPaginationProjects() {
  // Clear previous page attributes
  $projects.children('.project').removeAttr(pageAtribute);

  // Pick only the items in the current filter
  var $filteredItems = (currentFilter === '*')
    ? $projects.children('.project')
    : $projects.children('.project').filter(currentFilter); // currentFilter like ".adhd"

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

// Show page N (and apply current filter)
function showPageProjects(n) {
  currentPage = n;

  // Always filter by current page attribute
  var selector = '.project[' + pageAtribute + '="' + currentPage + '"]';

  // Add category class filter if not "all"
  if (currentFilter !== '*') {
    selector += currentFilter; // e.g. ".machine-learning"
  }

  filterCategoryProjects(selector);
}

// Build/update pager UI
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

  // Put pager after the projects grid
  $projects.after($pager);
}

// Main init
function initializeIsotopeProjects() {
  setPaginationProjects();
  showPageProjects(1);
  updatePagerProjects();

  // Filter click handler
  $('#filters-project .filter-button').off('click').on('click', function () {
    $('#filters-project .filter-button').removeClass('active');
    $(this).addClass('active');

    // Read filter from button
    currentFilter = $(this).attr('data-filter'); // "*" or ".adhd"

    // Recompute pages and reset to page 1
    setPaginationProjects();
    showPageProjects(1);
    updatePagerProjects();

    // Optional: relayout
    $projects.isotope('layout');
  });
}

// Keep layout stable when expanding/collapsing abstracts
$('.collapse').on('shown.bs.collapse hidden.bs.collapse', function () {
  $projects.isotope('layout');
});
