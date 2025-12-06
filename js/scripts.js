/***********************
 * PROJECTS: Isotope + Filters (no pagination)
 ***********************/
var $projects = $('#projects-grid').isotope({
  itemSelector: '.project',
  layoutMode: 'vertical'
});

$('#filters-project').on('click', '.filter-button', function () {
  $('#filters-project .filter-button').removeClass('active');
  $(this).addClass('active');

  var filterValue = $(this).attr('data-filter'); // "*" or ".adhd"
  $projects.isotope({ filter: filterValue });
});
