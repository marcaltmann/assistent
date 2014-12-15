/*
 * ajax.js
 * ajax stuff
*/

/*jslint           browser : true,   continue : true,
 devel  : true,     indent : 2,        maxerr : 50,
 newcap : true,      nomen : true,   plusplus : true,
 regexp : true,     sloppy : true,       vars : false,
 white  : true
*/
/*global $ */

$(document).ready( function () {
  'use strict';

  var
    // jQuery caches
    $taskButton, $taskList, $inputField,

    // DOM methods
    buildTaskList,

    // event handlers
    onClickButton, onClickList, onChangeInput
    ;


  $taskButton = $( '#get_tasks' );
  $taskList   = $( '#tasks'     );
  $inputField = $( '#new_task'  );


  // Begin DOM method /buildTaskList/
  buildTaskList = function( task_list ) {
    var $list_item;

    $taskList.empty();

    $.each( task_list, function ( idx, task ) {
      $list_item = $( '<li/>' );
      $list_item
        .html( task.name + ' <a href="#">x</a>' )
        .data( 'id', task._id )
        .appendTo( $taskList );
      console.log( task._id );
    });

  };
  // End DOM method /buildTaskList



  // Begin /onClickButton/
  onClickButton = function ( event ) {
    event.preventDefault();  // Needed??

    $.getJSON(
      '/task/list',
      function ( data ) { buildTaskList( data ); }
    );

    return false;
  };
  // End /onClickButton/


  // Begin /onClickList/
  onClickList = function ( event ) {
    var target = event.target,
      $list_item, id;

    event.preventDefault();
    if ( target.tagName !== 'A' & target.tagName !== 'a' ) {
      return false;
    }

    $list_item = $(target).parent();
    id = $list_item.data( 'id' );

    $.ajax
    ({
        type        : 'POST',
        url         : '/task/delete/' + id,
        data        : JSON.stringify( {} ),
        contentType : 'application/json',
        success     : function ( response ) {
          $list_item.slideUp( function () {
            $(this).remove();
          });
        }
    });


  };
  // End /onClickList/


  // Begin /onChangeInput/
  onChangeInput = function ( event ) {
    var
      $this     = $(this),
      input_str = $this.val().trim(),
      data
    ;

    if ( input_str === '' ) {
      $this.val( '' );
      return false;  // What does false do here???
    }

    $this.prop( 'disabled', true );

    data = {
      name    : input_str,
      is_done : false
    };

    $.ajax
    ({
        type        : 'POST',
        url         : '/task/create',
        contentType : 'application/json',
        data        : JSON.stringify( data ),
        success     : function ( response ) {
          $this.prop( 'disabled', false );
          $this.val( '' );

          var task_map = response[ 0 ];
          console.log( task_map );
        }
    });

    return true;  // true???
  };
  // End /onChangeInput/





  // Init section

  // Bind event handlers to DOM elements
  $taskButton.on( 'click',  onClickButton );
  $taskList.on(   'click',  onClickList   );
  $inputField.on( 'change', onChangeInput );
});
