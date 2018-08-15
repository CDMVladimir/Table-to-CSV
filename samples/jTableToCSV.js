//define(["jquery"],
	
	(
	
	function($){
		'use strict';

		var ElementToCSV = {
			private: {

				// init plugin
				init: function(wrapper, options){

					// store pased wrapper
					ElementToCSV.public.wrapper = wrapper;

					// apply passed options
					ElementToCSV.public.initOptions = ElementToCSV.private.applyOptions(options);

					// apply proper name for events
					ElementToCSV.public.initOptions.exportEvent = ElementToCSV.public.initOptions.prefix + '.export';

					// generate needed elements and insert them to page
					ElementToCSV.private.generateElements();

					// bind events
					ElementToCSV.private.bindEvents();
				},

				// apply passed options
				applyOptions: function(options){
					var opts = ElementToCSV.options;
					for(var k in options){
						if(opts.hasOwnProperty(k)){ opts[k] = options[k]; }
						else {
							if(ElementToCSV.options.debug){ console.warn('Invalid key passed for options: '+ k); }
						}
					}
					return opts;
				},

				// generate all needed elements
				generateElements: function(){

					// select wrapper for export button
					ElementToCSV.public.initOptions.exportButtonWrapper = ElementToCSV.private.findActionsWrapper('export');

					// select wrapper for download button
					ElementToCSV.public.initOptions.downloadButtonWrapper = ElementToCSV.private.findActionsWrapper('download');

					// generate and store wrapper for action buttons
					var actionWrapperClass = ElementToCSV.public.initOptions.prefix + 'triggers--wrapper';
					if(!ElementToCSV.public.initOptions.exportButtonWrapper){
						if(ElementToCSV.public.wrapper.siblings('.'+actionWrapperClass).length < 1){ $('<div class="' + actionWrapperClass + '"></div>').insertAfter($(ElementToCSV.public.wrapper)); }
						ElementToCSV.public.initOptions.exportButtonWrapper = ElementToCSV.public.wrapper.siblings('.'+actionWrapperClass);
					}
					if(!ElementToCSV.public.initOptions.downloadButtonWrapper){
						if(ElementToCSV.public.wrapper.siblings('.'+actionWrapperClass).length < 1){ $('<div class="' + actionWrapperClass + '"></div>').insertAfter($(ElementToCSV.public.wrapper)); }
						ElementToCSV.public.initOptions.downloadButtonWrapper = ElementToCSV.public.wrapper.siblings('.'+actionWrapperClass);
					}

					// insert Export Trigger
					var exportBtn = $( ElementToCSV.public.initOptions.exportButton ).attr('title', ElementToCSV.public.initOptions.exportButtonText);
					var exportContent = ElementToCSV.public.initOptions.exportButtonIcon + '<span>' + ElementToCSV.public.initOptions.exportButtonText + '</span>';
					exportBtn.addClass(ElementToCSV.public.initOptions.prefix + 'export--trigger').html(exportContent);
					ElementToCSV.public.initOptions.exportButtonWrapper.append(exportBtn);
					ElementToCSV.public.exportButton = ElementToCSV.public.initOptions.exportButtonWrapper.children('.' + ElementToCSV.public.initOptions.prefix + 'export--trigger:first');


					// insert Download Trigger
					var downloadBtn = $( ElementToCSV.public.initOptions.downloadButton ).attr('title', ElementToCSV.public.initOptions.downloadButtonText).css({ 'display': 'none'});
					var downloadContent = ElementToCSV.public.initOptions.downloadButtonIcon + '<span>' + ElementToCSV.public.initOptions.downloadButtonText + '</span>';
					downloadBtn.addClass(ElementToCSV.public.initOptions.prefix + 'download--trigger').html(downloadContent);
					ElementToCSV.public.initOptions.downloadButtonWrapper.append(downloadBtn);
					ElementToCSV.public.downloadButton = ElementToCSV.public.initOptions.downloadButtonWrapper.children('.' + ElementToCSV.public.initOptions.prefix + 'download--trigger:first');
				},

				// if it is defined, select action wrapper for each trigger
				findActionsWrapper: function(type){
					var wrap = false, actionWrapperClass = ElementToCSV.public.initOptions.prefix + 'triggers--wrapper';
					if(type == 'export'){ wrap = ElementToCSV.public.initOptions.exportButtonWrapper; }
					else if(type == 'download'){ wrap = ElementToCSV.public.initOptions.downloadButtonWrapper; }

					if(wrap){
						if(typeof wrap == 'string'){ wrap = $(document).find(wrap); }
						else if(typeof wrap == 'object'){ wrap = $(wrap); }
						else { wrap = false; }
					}
					return wrap;
				},

				// Bind Click on Export Button
				bindEvents: function(){

					// bind click on "Export" button
					ElementToCSV.public.exportButton.click(function(e){
						e.preventDefault();
						ElementToCSV.public.wrapper.trigger( ElementToCSV.public.initOptions.exportEvent );
					});

					// bind event for export
					ElementToCSV.public.wrapper.on(ElementToCSV.public.initOptions.exportEvent, function(e){
						var fileName = ElementToCSV.private.collectFileName();
						var data = ElementToCSV.private.collectData();

						// For IE (tested 10+)
						if (window.navigator.msSaveOrOpenBlob) {
							var blob = new Blob([decodeURIComponent(encodeURI(data))], { type: "text/csv;charset=utf-8;" });
							navigator.msSaveBlob(blob, fileName);
						} else {
							ElementToCSV.public.downloadButton.attr({ 'download' : fileName, 'href' : data, 'target' : '_blank' }).fadeIn(ElementToCSV.public.initOptions.animationTime);
						}
					});

					// bind download button click
					ElementToCSV.public.downloadButton.click(function(e){
						$(this).fadeOut(ElementToCSV.public.initOptions.animationTime);
					});

				},

				// Prompt user to enter name for the file
				collectFileName: function(){
					var outputFile = window.prompt("What do you want to name your output file?") || 'export';
					outputFile = outputFile.replace('.csv','') + '.csv';
					return outputFile;
				},

				// Read and collect data
				collectData: function(){
					var csvContent = '"';

					// Collect Header Data
					var header = ElementToCSV.public.wrapper.find(ElementToCSV.public.initOptions.headerSelector + ':first');
					header = header.find(ElementToCSV.public.initOptions.headerRowSelector + ':first');
					csvContent += ElementToCSV.private.formatRows(header.map(ElementToCSV.private.takeRow));
					
					// separate headings from content
					csvContent += ElementToCSV.options.rowDelimiter;

					// Collect Content Data
					var content = ElementToCSV.public.wrapper.find(ElementToCSV.public.initOptions.contentSelector + ':first');
					content = content.find(ElementToCSV.public.initOptions.rowSelector);
					csvContent += ElementToCSV.private.formatRows(content.map(ElementToCSV.private.takeRow)) + '"';


					// convert data to url string
					var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvContent);
					return csvData;
				},

				// Take single row, find its cells and format CSV string
				takeRow: function(i, row){
					var $row = $(row);
					var cellSelector = false;
					if($row.closest(ElementToCSV.public.initOptions.headerSelector).length > 0){ cellSelector = ElementToCSV.public.initOptions.headerCellSelector; }
					else { cellSelector = ElementToCSV.public.initOptions.cellSelector; }
					var $cols = $row.find(cellSelector); 
					return $cols.map(ElementToCSV.private.takeColumn).get().join(ElementToCSV.options.tempColumnDelimiter);
				},

				// Take single column content and return content back
				takeColumn: function(j,col){
					var $col = $(col), $text = $col.text();
					return $text.replace('"', '""'); // escape double quotes
				},

				// reformat content from rows and return back parsed string
				formatRows: function(rows, type){
					return rows.get()
						.join(ElementToCSV.options.tempRowDelimiter)
						.split(ElementToCSV.options.tempRowDelimiter)
						.join(ElementToCSV.options.rowDelimiter)
						.split(ElementToCSV.options.tempColumnDelimiter)
						.join(ElementToCSV.options.columnDelimiter);
				}


			},
			public: {
				// store passed wrapper for init
				wrapper: false,

				// init options that are parsed
				initOptions: false,
				exportButton: false,
				downloadButton: false
			},
			options: {

				// set it to false once dev is done
				debug: true,

				// css classes prefix
				prefix: 'ttcsv_',

				// allow users to insert their own element
				generateExportButton: true,

				// default export trigger
				exportButton: '<button type="button"></button>',

				// default Export Text
				exportButtonText: 'Export',

				// default export icon
				exportButtonIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M567.31 283.89l-71.78-68.16c-8.28-7.8-20.41-9.88-30.84-5.38-10.31 4.42-16.69 13.98-16.69 24.97V288h-64V131.97c0-12.7-5.1-25-14.1-33.99L286.02 14.1c-9-9-21.2-14.1-33.89-14.1H47.99C21.5.1 0 21.6 0 48.09v415.92C0 490.5 21.5 512 47.99 512h288.02c26.49 0 47.99-21.5 47.99-47.99V352h-31.99v112.01c0 8.8-7.2 16-16 16H47.99c-8.8 0-16-7.2-16-16V48.09c0-8.8 7.2-16.09 16-16.09h176.04v104.07c0 13.3 10.7 23.93 24 23.93h103.98v128H168c-4.42 0-8 3.58-8 8v16c0 4.42 3.58 8 8 8h280v52.67c0 10.98 6.38 20.55 16.69 24.97 14.93 6.45 26.88-1.61 30.88-5.39l71.72-68.12c5.62-5.33 8.72-12.48 8.72-20.12s-3.1-14.81-8.7-20.12zM256.03 128.07V32.59c2.8.7 5.3 2.1 7.4 4.2l83.88 83.88c2.1 2.1 3.5 4.6 4.2 7.4h-95.48zM480 362.88V245.12L542 304l-62 58.88z"></path></svg>',

				// wrapper for inserting export button
				exportButtonWrapper: false,

				// allow users to insert their own element
				generateDownloadButton: true,

				// default download trigger
				downloadButton: '<a href="javascript:void(0);"></a>',

				// default Download Text
				downloadButtonText: 'Download',

				// default download icon
				downloadButtonIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M369.9 97.98L286.02 14.1c-9-9-21.2-14.1-33.89-14.1H47.99C21.5.1 0 21.6 0 48.09v415.92C0 490.5 21.5 512 47.99 512h288.02c26.49 0 47.99-21.5 47.99-47.99V131.97c0-12.69-5.1-24.99-14.1-33.99zM256.03 32.59c2.8.7 5.3 2.1 7.4 4.2l83.88 83.88c2.1 2.1 3.5 4.6 4.2 7.4h-95.48V32.59zm95.98 431.42c0 8.8-7.2 16-16 16H47.99c-8.8 0-16-7.2-16-16V48.09c0-8.8 7.2-16.09 16-16.09h176.04v104.07c0 13.3 10.7 23.93 24 23.93h103.98v304.01zM208 216c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8v88.02h-52.66c-11 0-20.59 6.41-25 16.72-4.5 10.52-2.38 22.62 5.44 30.81l68.12 71.78c5.34 5.59 12.47 8.69 20.09 8.69s14.75-3.09 20.09-8.7l68.12-71.75c7.81-8.2 9.94-20.31 5.44-30.83-4.41-10.31-14-16.72-25-16.72H208V216zm42.84 120.02l-58.84 62-58.84-62h117.68z"></path></svg>',

				// wrapper for inserting download button
				downloadButtonWrapper: false,

				// export event Trigger
				exportEvent: false,

				// selector for header
				headerSelector: 'thead',

				// selector for header row
				headerRowSelector: 'tr',

				// selector for header cell
				headerCellSelector: 'th',

				// selector for main content
				contentSelector: 'tbody',

				// selector for body Row
				rowSelector: 'tr',

				// selector for body cell elements
				cellSelector: 'td',

				// vertical tab character
				tempColumnDelimiter: String.fromCharCode(11),

				// null character
				tempRowDelimiter: String.fromCharCode(0),

				// actual delimiter for CSV format,
				columnDelimiter: '","',

				// new line for CSV format
				rowDelimiter: '"\r\n"',

				// duration for animations
				animationTime: 250
			}
		};

		// JQuery Init Method
		$.fn.elementToCSV = function (options) {

			// Init Plugin
			ElementToCSV.private.init(this, options);
			return ElementToCSV.public;
		};
	}

	)(jQuery);

//);