// script.js
$(document).ready(function() {
    // Create the grid
    const rowCount = 20;
    const colCount = 6;
    for (let i = 0; i < rowCount; i++) {
        const gridRow = $('<div class="grid-row"></div>');
        $('.grid-container').append(gridRow);
      
        const labelCell = $(`<input type="text" class="label-cell" teacher-data-cell-id="${i}">`);
        gridRow.append(labelCell);
      
        for (let j = 0; j < colCount; j++) {
          const gridCell = $(`<div class="grid-cell" data-cell-id="${i*colCount+j}"></div>`);
          gridRow.append(gridCell);
        }
      }
  
  
    // Make cards draggable and handle the drop
    function makeCardsDraggable() {
      $('.card').draggable({
        containment: '.grid-container',
        revert: 'invalid',
        zIndex: 100,
        start: function(event, ui) {
          ui.helper.data('originalPosition', ui.helper.position());
        }
      });
  
      $('.grid-cell').droppable({
        accept: '.card',
        drop: function(event, ui) {
          const droppedCard = ui.helper;
          const targetCell = $(this);
          const sourceCell = droppedCard.parent();
          const existingCard = targetCell.find('.card');
  
          if (existingCard.length) {
            sourceCell.append(existingCard);
            existingCard.css(droppedCard.data('originalPosition'));
          }
  
          targetCell.append(droppedCard);
          droppedCard.css({top: 0, left: 0});
        }
      });
    }

  // Add this code to script.js, below the existing code

// Add a new row to the control
function addNewRow() {
    const rowIndex = $('.row').length;
    const newRowId = Date.now();
    const newRowColor = randomPastelColor(rowIndex);
    const newRow = `
      <div class="row" data-row-id="${newRowId}" data-row-color="${newRowColor}">
        <input type="text" id="input-${newRowId}" placeholder="Card text" style="background-color: ${newRowColor};"> <!-- Add the background-color style here -->
        <button class="add-card" data-input-id="input-${newRowId}">Add Section</button>
        <span class="card-count" data-count-for="input-${newRowId}">0</span>
      </div>`;
  
    $('.rows-container').append(newRow);
  }
  
  // Add a card to the grid with custom text
// Replace the existing event handler for '.add-card' click in script.js
$('body').on('click', '.add-card', function() {
    const inputId = $(this).data('input-id');
    const rowId = $(this).parent().data('row-id');
    const cardText = $(`#${inputId}`).val() || 'Empty';
    const cardColor = $(this).parent().data('row-color');
  
    // Find the first empty cell
    const firstEmptyCell = $('.grid-cell:not(:has(.card))').first();
  
    if (firstEmptyCell.length) {
      const cardId = Date.now();
      firstEmptyCell.append(`<div class="card" data-card-id="${cardId}" data-row-id="${rowId}" style="background-color: ${cardColor};">${cardText}</div>`);
      makeCardsDraggable();
      updateCardCount(inputId); // Move this line to after appending the card
    } else {
      alert('No empty cells available.');
    }
  });

  $('body').on('click', '#add-grid-row', function() {
    const newRow = $('<div class="grid-row"></div>');
    const gridCols = $('.grid-row:first .grid-cell').length; // Calculate the number of columns in the grid
  
    for (let i = 0; i < gridCols; i++) {
      newRow.append('<div class="grid-cell"></div>');
    }
  
    $('.grid-container').append(newRow);
    makeCardsDraggable();
  });
  
  $('body').on('click', '#remove-grid-row', function() {
    const lastRow = $('.grid-row').last();
  
    if (lastRow.length) {
      lastRow.remove();
    } else {
      alert('No rows available to remove.');
    }
  });


  addNewRow(); // Call the function to add a new row on app start

  $('#add-row').on('click', function() {
    addNewRow();
  });

});


  // Add this function to script.js to update the card count
  function updateCardCount(inputId) {
    console.log(inputId)
    const rowId = $(`#${inputId}`).parent().data('row-id');
    const cardCount = $('.card').filter(function() {
      return $(this).data('row-id') === rowId;
    }).length;
    $(`.card-count[data-count-for="${inputId}"]`).text(cardCount);
  }
  
  // Add this event handler in script.js for updating card count when a card is added
  $('body').on('click', '.add-card', function() {
    const inputId = $(this).data('input-id');
    updateCardCount(inputId);
  });
  
  // Add this event handler in script.js for renaming cards when the text field value changes
  $('body').on('input', 'input', function() {
    const inputId = $(this).attr('id');
    const rowId = $(this).parent().data('row-id');
    const newCardText = $(this).val();
  
    $('.card').filter(function() {
      return $(this).data('row-id') === rowId;
    }).text(newCardText);
  
    updateCardCount(inputId);
  });

  // Add this event handler to script.js
  $('body').on('dblclick', '.card', function() {
    const cardId = $(this).attr('data-card-id');
    const rowId = $(this).attr('data-row-id');
    const countElement = $(`.card-count[data-count-for="input-${rowId}"]`);
    const currentCount = parseInt(countElement.text());
    console.log(rowId)
    // Update the count
    countElement.text(currentCount - 1);
  
    // Remove the card
    $(this).remove();
  });
    
  
  // Update the makeCardsDraggable function in script.js to refresh card counts when a card is dropped
  function makeCardsDraggable() {
    // ...
    $('.grid-cell').droppable({
      // ...
      drop: function(event, ui) {
        // ...
        droppedCard.css({top: 0, left: 0});
  
        const inputId = droppedCard.data('input-id');
        updateCardCount(inputId);
      }
    });
  }

  // Add this function to script.js
function randomPastelColor(index) {
    const hue = Math.floor(Math.random() * 360);
    const pastelColor = `hsl(${index * 30}, ${80/(index / 30 + 1)}%, 90%)`;
    return pastelColor;
  }
  
// Add this event handler to script.js for saving the configuration to a file
$('#save-to-file').on('click', function() {
    const rowsData = $('.row').map(function() {
      const rowId = $(this).attr('data-row-id');
      const rowColor = $(this).attr('data-row-color');
      const inputText = $(`#input-${rowId}`).val();
      return { rowId, rowColor, inputText };
    }).toArray();
  
    const cardsData = $('.card').map(function() {
      const cardId = $(this).attr('data-card-id');
      const rowId = $(this).attr('data-row-id');
      const cardText = $(this).text();
      const position = $(this).parent().index();
      return { cardId, rowId, cardText, position };
    }).toArray();
  
    const configuration = { rowsData, cardsData };
    const configurationString = JSON.stringify(configuration);
    const configurationBlob = new Blob([configurationString], { type: 'application/octet-stream' });
  
    // Create a temporary link and trigger a download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(configurationBlob);
    link.download = 'gridCardAppConfiguration.bin';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

// Add this event handler to script.js for loading the configuration from a file
$('#load-from-file').on('click', function() {
    $('#load-file-input').click();
  });
  
  // Add this event handler to script.js for processing the selected file
  $('#load-file-input').on('change', function(event) {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const configurationString = e.target.result;
          const configuration = JSON.parse(configurationString);
          const { rowsData, cardsData } = configuration;
  
          // Remove existing rows and cards
          $('.row').remove();
          $('.card').remove();
  
          // Load rows
          for (const rowData of rowsData) {
            const newRow = `
              <div class="row" data-row-id="${rowData.rowId}" data-row-color="${rowData.rowColor}">
                <input type="text" id="input-${rowData.rowId}" value="${rowData.inputText}" style="background-color: ${rowData.rowColor};">
                <button class="add-card" data-input-id="input-${rowData.rowId}">Add Card</button>
                <span class="card-count" data-count-for="${rowData.rowId}">0</span>
              </div>`;
            $('.rows-container').append(newRow);
          }
  
          // Load cards
          for (const cardData of cardsData) {
            const rowColor = $(`.row[data-row-id="${cardData.rowId}"]`).attr('data-row-color');
            const newCard = $(`
              <div class="card" data-card-id="${cardData.cardId}" data-row-id="${cardData.rowId}" style="background-color: ${rowColor};">
                ${cardData.cardText}
              </div>
            `);
            $('.grid-cell').eq(cardData.position).append(newCard);
  
            // Update card count
            const countElement = $(`.card-count[data-count-for="${cardData.rowId}"]`);
            const currentCount = parseInt(countElement.text());
            countElement.text(currentCount + 1);
          }
  
          // Make cards draggable again
          makeCardsDraggable();
  
          alert('Configuration loaded!');
        } catch (error) {
          alert('Error loading configuration. Please make sure the selected file is valid.');
        }
      };
      reader.readAsText(file);
    }
  });
  















  // Add this event handler to script.js for saving the configuration
$('#save-configuration').on('click', function() {
    const rowsData = $('.row').map(function() {
      const rowId = $(this).attr('data-row-id');
      const rowColor = $(this).attr('data-row-color');
      const inputText = $(`#input-${rowId}`).val();
      return { rowId, rowColor, inputText };
    }).toArray();
  
    const cardsData = $('.card').map(function() {
      const cardId = $(this).attr('data-card-id');
      const rowId = $(this).attr('data-row-id');
      const cardText = $(this).text();
      const position = $(this).parent().index();
      return { cardId, rowId, cardText, position };
    }).toArray();
  
    const configuration = { rowsData, cardsData };
    localStorage.setItem('gridCardAppConfiguration', JSON.stringify(configuration));
    alert('Configuration saved!');
  });
  
  // Add this event handler to script.js for loading the configuration
  $('#load-configuration').on('click', function() {
    const configurationString = localStorage.getItem('gridCardAppConfiguration');
  
    if (configurationString) {
      const configuration = JSON.parse(configurationString);
      const { rowsData, cardsData } = configuration;
  
      // Remove existing rows and cards
      $('.row').remove();
      $('.card').remove();
  
      // Load rows
      for (const rowData of rowsData) {
        const newRow = `
          <div class="row" data-row-id="${rowData.rowId}" data-row-color="${rowData.rowColor}">
            <input type="text" id="input-${rowData.rowId}" value="${rowData.inputText}" style="background-color: ${rowData.rowColor};">
            <button class="add-card" data-input-id="input-${rowData.rowId}">Add Card</button>
            <span class="card-count" data-count-for="${rowData.rowId}">0</span>
          </div>`;
        $('.rows-container').append(newRow);
      }
  
      // Load cards
      for (const cardData of cardsData) {
        const rowColor = $(`.row[data-row-id="${cardData.rowId}"]`).attr('data-row-color');
        const newCard = $(`
          <div class="card" data-card-id="${cardData.cardId}" data-row-id="${cardData.rowId}" style="background-color: ${rowColor};">
            ${cardData.cardText}
          </div>
        `);
        $('.grid-cell').eq(cardData.position).append(newCard);
  
        // Update card count
        const countElement = $(`.card-count[data-count-for="${cardData.rowId}"]`);
        const currentCount = parseInt(countElement.text());
        countElement.text(currentCount + 1);
      }
  
      // Make cards draggable again
      makeCardsDraggable();
  
      alert('Configuration loaded!');
    } else {
      alert('No saved configuration found.');
    }
  });
  