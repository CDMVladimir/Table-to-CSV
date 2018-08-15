# Table-to-CSV
jQuery plugin for exporting data to CSV

Init:
var tocsv = $('table').elementToCSV({
    headerSelector: 'thead',
    contentSelector: 'tbody'
});

Options:
  (bool) debug (default: true) -- Ouputs debug data through init and data collection run
  (string) prefix (default: 'ttcsv_') -- Used for prefixing elements and events raised by plugin
  
  (bool) generateExportButton (default: true) -- create Export button from plugin or not
  (string) exportButton (default: '<button type="button"></button>') -- Element to create for triggering export function
  (string) exportButtonText (default: 'Export') -- Text used for both button and title attribute
  (string) exportButtonIcon (default: 'SVG ICON CODE') -- too big to be listed here. Can easily be replaced by anything you want
  (string) exportButtonWrapper (default: false) -- if you want button to be placed somewhere specific, place jQuery/JS/string selector here
  
  (bool) generateDownloadButton (default: true) -- create download button from plugin
  (string) downloadButton (default: '<a href="javascript:void(0);"></a>') -- Element for triggering download of CSV
  (string) downloadButtonText (default: 'Download') -- Text used for both link and title attribute
  (string) downloadButtonIcon (default: 'SVG ICON CODE') -- too big to be listed here. Can easily be replaced by anything you want
  (string) downloadButtonWrapper (default: false) -- if you want button to be placed somewhere specific, place jQuery/JS/string selector here

  (string) headerSelector (default: 'thead') -- selector for wrapper with heading elements
  (string) headerRowSelector (default: 'tr') -- selector for row in heading section
  (string) headerCellSelector (default: 'th') -- selector for single cell in heading

  (string) contentSelector (default: 'tbody') -- selector for content area wrapper
  (string) rowSelector (default: 'tr') -- selector for each row in content area
  (string) cellSelector (default: 'td') -- selector for each cell in single row
  
  (string) tempColumnDelimiter (default: String.fromCharCode(11)) -- temporary delimeter used in data pre-parsing and preparation -- should not be changed unles you have some conflicts
  (string) tempRowDelimiter (default: String.fromCharCode(0)) -- temporary row delimeter used in data pre-parsing and preparation -- should not be changed unles you have some conflicts

  (string) columnDelimiter (default: '","') -- delimeter for each single column data -- #should not be changed
  (string) rowDelimiter (default: '"\r\n"') -- delimeter for each new row -- #should not be changed

  (int) animationTime (default: 250) -- value for animations speed


#Events
  exportEvent:
    by default it is 'ttcsv_.export' -- structure is OPTIONS.PREFIX + '.export' -- if you change prefix "OPTIONS.PREFIX" should be replaced also.
