// external js: isotope.pkgd.js

//  initialize Isotope grid for sorting



// filter functions
var filterFns = {
  // show if number is greater than 50
  numberGreaterThan50: function() {
    var number = $(this).find('.number').text();
    return parseInt( number, 10 ) > 50;
  },
  // show if name ends with -ium
  ium: function() {
    var name = $(this).find('.name').text();
    return name.match( /ium$/ );
  }
};

// bind filter button click
$('#filters').on( 'click', 'button', function() {
  var filterValue = $( this ).attr('data-filter');
  // use filterFn if matches value
  filterValue = filterFns[ filterValue ] || filterValue;
  $grid.isotope({ filter: filterValue });
});

// bind sort button click
$('#sorts').on( 'click', 'button', function() {
  $grid = $('#outputarealeft').isotope({
    itemSelector: '.card-item',
    layoutMode: 'fitRows',
    getSortData: {
      defense: function( card ) {
        var defense = $( card).find('.defense').text();
        return parseFloat( defense.replace( /[\(\)]/g, '') * -1 );
      },
      attack: function( card ) {
        var attack = $( card).find('.attack').text();
        return parseFloat( attack.replace( /[\(\)]/g, '') * -1 );
      }
    }
  });
  // $grid.isotope( 'updateSortData' )
  var sortByValue = $(this).attr('data-sort-by');
  $grid.isotope({ sortBy: sortByValue });
  console.log('sort clicked')
});

// $('#attack').on( 'click', function() {
//   var sortByValue = $(this).attr('data-sort-by');
//   $grid.isotope({ sortBy: sortByValue });
//   console.log('attack sort clicked')
// });

// change is-checked class on buttons
$('.button-group').each( function( i, buttonGroup ) {
  var $buttonGroup = $( buttonGroup );
  $buttonGroup.on( 'click', 'button', function() {
    $buttonGroup.find('.is-checked').removeClass('is-checked');
    $( this ).addClass('is-checked');
  });
});
