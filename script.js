// script.js
$(document).ready(function() {
    // Create the grid
    const rowCount = 30;
    const colCount = 6;
    for (let i = 0; i < rowCount; i++) {
        const gridRow = $('<div class="grid-row"></div>');
        const uniqueCardCount = $(`<span class="unique-card-count" data-row-id="${i}">0</span>`);

        $('.grid-container').append(gridRow);
      
        const teacherLabelCell = $(`<input type="text" class="teacher-label-cell" teacher-data-cell-id="${i}">`);
      
        gridRow.append(teacherLabelCell);
        gridRow.append(uniqueCardCount);

        for (let j = 0; j < colCount; j++) {
          const gridCell = $(`<div class="grid-cell" data-cell-id="${i*colCount+j}"></div>`);
          gridRow.append(gridCell);
        }
      }
      updateUniqueCardCount()

  
  
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
          updateUniqueCardCount() 
          droppedCard.css({top: 0, left: 0});
        }
      });
    }

  $('body').on('input', '.color-picker', function() {
    const rowId = $(this).data('row-id');
    const newRowColor = $(this).val();
    $(this).parent().data('row-color', newRowColor);
    const inputElement = $(`#input-${rowId}`);
    inputElement.css('background-color', newRowColor);
  
    setContrastingTextColor(inputElement, newRowColor);
  
    const cards = $('.card').filter(function() {
      return $(this).data('row-id') === rowId;
    });
  
    cards.css('background-color', newRowColor);
  
    cards.each(function() {
      setContrastingTextColor($(this), newRowColor);
    });
  });
  

  function addNewRow() {
    const newRowId = Date.now();
    const newRowColor = randomPastelColor($('.row').length);
    const newRow = createNewRow(newRowId, newRowColor);
 
    $('.rows-container').append(newRow);
    $(`#input-${newRowId}`).focus();

  }
 
  
  // Add a card to the grid with custom text
// Replace the existing event handler for '.add-card' click in script.js
$('body').on('click', '.add-card', function() {
  const inputId = $(this).data('input-id');
  const difference = updateCardCount(inputId);

  if (difference <= 0) {
    return
    const numberInputId = `number-input-${inputId.split('-')[1]}`;
    const enteredNumber = parseInt($(`#${numberInputId}`).val()) || 0;
    $(`#${numberInputId}`).val(enteredNumber + 1);
  }
  const rowId = $(this).parent().data('row-id');
  const cardText = $(`#${inputId}`).val() || 'Unnamed';
  const cardColor = $(this).parent().data('row-color');

  // Find the first empty cell
  const firstEmptyCell = $('.grid-cell:not(:has(.card))').first();

  if (firstEmptyCell.length) {
    const cardId = Date.now();
    const newCard = createCard(cardText, cardId, rowId, cardColor);
    firstEmptyCell.append(newCard);
    makeCardsDraggable();
    updateCardCount(inputId);
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

$('body').on('input', '.small-number-input', function() {
  const numberInputId = $(this).attr('id');
  const inputId = `input-${numberInputId.split('-')[2]}`;
});

$('body').on('change', '.small-number-input', function() {
  const numberInputId = $(this).attr('id');
  const inputId = `input-${numberInputId.split('-')[2]}`;
  const addButton = $(`.add-card[data-input-id="${inputId}"]`);

  // Get the previous value, which is stored in the data attribute.
  const prevValue = parseInt($(this).data('prevValue'), 10) || 0;

  // Get the current value from the input field.
  const currentValue = parseInt($(this).val(), 10) || 0;

  // Compare the current value to the previous value.
  if (currentValue > prevValue) {
    addButton.click();
  } else {
    updateCardCount(inputId)
  }

  // Update the previous value.
  $(this).data('prevValue', currentValue);
});



// Add this event handler in script.js for updating the row color when the "Change Color" button is clicked
// Add this event handler in script.js for updating the row color when the color picker's value changes
  addNewRow(); // Call the function to add a new row on app start

  $('#add-row').on('click', function() {
    addNewRow();
  });

  $('#scoot').on('click', function() {
    shiftCardsToLeft();
  });
});

function createCard(cardText, cardId, rowId, cardColor) {
  const newCard = $(`
    <div class="card scale-down" data-card-id="${cardId}" data-row-id="${rowId}" data-input-id="input-${rowId}" style="background-color: ${cardColor};">
      ${cardText}
    </div>
  `);
  setContrastingTextColor(newCard, cardColor);
  return newCard;
}

function createNewRow(newRowId, newRowColor, courseName = "", newRowNumber = 0) {
  const newRow = `
    <div class="row" data-row-id="${newRowId}" data-row-color="${newRowColor}">
    <button class="add-card" data-input-id="input-${newRowId}" style="visibility: hidden;">0</button>
    <span class="card-count" data-count-for="input-${newRowId}">0</span>
      <input type="number" id="number-input-${newRowId}" class="small-number-input" value=${newRowNumber} min="0" step="1">
      <input type="text" id="input-${newRowId}" class="text-input" value="${courseName}" placeholder="Enter Name..." style="background-color: ${newRowColor};">
      <input type="color" class="color-picker" data-row-id="${newRowId}" value="${newRowColor}">
    </div>`;

  setContrastingTextColor($(`#input-${newRowId}`), newRowColor);

  return newRow;
}

// Add this function to script.js
function shiftCardsToLeft() {
  $('.grid-row').each(function() {
    const gridCells = $(this).find('.grid-cell');
    let emptyIndex = -1;
    for (let i = 0; i < gridCells.length; i++) {
      const gridCell = gridCells.eq(i);
      const card = gridCell.find('.card');
      if (card.length) {
        if (emptyIndex !== -1) {
          gridCells.eq(emptyIndex).append(card);
          emptyIndex++;
          gridCell.addClass('empty');
        } else {
          gridCell.removeClass('empty');
        }
      } else {
        if (emptyIndex === -1) {
          emptyIndex = i;
        }
        gridCell.addClass('empty');
      }
    }
  });
}

// Update the card count function to show the difference between the entered number and the card count
function updateCardCount(inputId) {
  const rowId = $(`#${inputId}`).parent().data('row-id');
  const cardCount = $('.card').filter(function() {
    return $(this).data('row-id') === rowId;
  }).length;

  const numberInputId = `number-input-${inputId.split('-')[1]}`;
  $(`#${numberInputId}`).attr('min', cardCount);

  const enteredNumber = parseInt($(`#${numberInputId}`).val()) || 0;
  const difference = enteredNumber - cardCount;

  const cardCountElement = $(`.card-count[data-count-for="${inputId}"]`);
  cardCountElement.text(cardCount);

  // Set the color to red if the difference is positive, otherwise set it to the default color
  const addButton = $(`.add-card[data-input-id="${inputId}"]`);
  addButton.text(difference)
  console.log("diff", difference)
  if (difference > 0) {
    addButton.css('visibility', 'visible'); // Set the color to an empty string to use the default color
  } else {
    addButton.css('visibility', 'hidden'); // Set the color to an empty string to use the default color
  } 
  updateUniqueCardCount()
  return difference;
}

function updateUniqueCardCount() {
  $('.grid-row').each(function(index, row) {
    const rowId = index;
    const uniqueCardIds = new Set();
    $(row).find('.card').each(function() {
      const cardId = $(this).data('input-id');
      uniqueCardIds.add(cardId);
    });
    const uniqueCountElement = $(`.unique-card-count[data-row-id="${rowId-1}"]`);
    if(uniqueCardIds.size > 0)
    console.log("ucs", uniqueCardIds.size, rowId, uniqueCountElement)
    uniqueCountElement.text(uniqueCardIds.size);
    if (uniqueCardIds.size == 0) {
      uniqueCountElement.css('color', 'white');
    } else {
      uniqueCountElement.css('color', 'black'); // Set the color to an empty string to use the default color
    } 
  });
}

  
  // Add this event handler in script.js for updating card count when a card is added
  $('body').on('click', '.add-card', function() {
    const inputId = $(this).data('input-id');
    updateCardCount(inputId);

  });
  
  // Add this event handler in script.js for renaming cards when the text field value changes
$('body').on('input', '.text-input', function() {
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
  const inputId = `input-${rowId}`;

  // Remove the card
  $(this).remove();

  // Update the count
  updateCardCount(inputId);
});
    
// ____________________________________


  
  // Update the makeCardsDraggable function in script.js to refresh card counts when a card is dropped
  function makeCardsDraggable() {
    $('.card').draggable({
      containment: '.grid-container',
      revert: 'invalid',
      zIndex: 100,
      start: function(event, ui) {
        ui.helper.data('originalPosition', ui.helper.position());
      }
    });
  
    initializeDroppableGridCells();
  }
  


  function initializeDroppableGridCells() {
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
  
        const inputId = droppedCard.data('input-id');
        updateCardCount(inputId);
      }
    });
  }

  

  function randomPastelColor(index) {
    const hue = index * 137.508; // Use golden angle approximation
    const saturation = 60;
    const lightness = 85;
  
    return hslToHex(hue, saturation, lightness);
  }
  
  function hslToHex(h, s, l) {
    l /= 100;
    s /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
  
  function setContrastingTextColor(element, backgroundColor) {
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
    if (brightness > 128) {
      element.css('color', 'black');
    } else {
      element.css('color', 'white');
    }
  }
  


///// save/load code


// Add this event handler to script.js for saving the configuration to a file
$('#save-to-file').on('click', function() {
  saveStateToLocalStorage()
  /*
  const rowsData = $('.row').map(function() {
    const rowId = $(this).attr('data-row-id');
    const rowColor = $(this).attr('data-row-color');
    const inputText = $(`#input-${rowId}`).val();
    const numberInputValue = $(`#number-input-${rowId}`).val(); 
    return { rowId, rowColor, inputText, numberInputValue }; 
  }).toArray();

  const cardsData = $('.card').map(function() {
    const card = $(this);
    const cardId = card.attr('data-card-id');
    const rowId = card.attr('data-row-id');
    const cardText = card.text();
  
    // Get the absolute position of the cell
    const cell = card.parent();
    const cellPosition = parseInt(cell.attr('data-cell-id'));
  
    return { cardId, rowId, cardText, cellPosition };
  }).toArray();
  
  const labelCellData = $('.teacher-label-cell, .control-label-cell').map(function() {
    const cellId = $(this).attr('teacher-data-cell-id');
    const cellValue = $(this).val();
    return { cellId, cellValue };
  }).toArray();

  const configuration = { rowsData, cardsData, labelCellData };
  const configurationString = JSON.stringify(configuration);
  const configurationBlob = new Blob([configurationString], { type: 'application/octet-stream' });
  localStorage.setItem('scheduleConfiguration', configurationString);


  // Create a temporary link and trigger a download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(configurationBlob);
  link.download = 'schedule.bin';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  */
});



$('#load-from-file').on('click', function() {
 // $('#load-file-input').click();
 loadStateFromLocalStorage()
});

$('#load-file-input').on('change', function(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const configurationString = e.target.result;
        const configuration = JSON.parse(configurationString);
        const { rowsData, cardsData, labelCellData } = configuration;

        // Remove existing rows and cards
        $('.row').remove();
        $('.card').remove();

        // Update label cells
        for (const labelCellDatum of labelCellData) {
          const labelCell = $(`.teacher-label-cell[teacher-data-cell-id="${labelCellDatum.cellId}"], .control-label-cell[teacher-data-cell-id="${labelCellDatum.cellId}"]`);
          if (labelCell.length) {
            labelCell.val(labelCellDatum.cellValue);
          } else {
            const newLabelCell = $(`<input type="text" class="teacher-label-cell" teacher-data-cell-id="${labelCellDatum.cellId}" value="${labelCellDatum.cellValue}">`);
            $('.grid-labels').append(newLabelCell);
          }
        }

        // Load rows
        for (const rowData of rowsData) {
          const newRow = createNewRow(rowData.rowId, rowData.rowColor, rowData.inputText, rowData.numberInputValue);
          $('.rows-container').append(newRow);
        }


        // Load cards
        for (const cardData of cardsData) {
          const newCard = createCard(cardData.cardText, cardData.cardId, cardData.rowId, cardData.cardColor) 
        
          // Use cellPosition property to append the card to the correct grid cell
          $('.grid-cell[data-cell-id="' + cardData.cellPosition + '"]').append(newCard);

          // Update control side counts
          updateCardCount(`input-${cardData.rowId}`);
        }

        makeCardsDraggable()
        initializeDroppableGridCells()
      } catch (error) {
        console.error(error);
        alert(`Error loading configuration: ${error.message}`);
      }
    };
    reader.readAsText(file);
  }
});

function saveStateToLocalStorage() {
  const rowsData = [];
  const cardsData = [];
  const labelCellData = [];
  const configurationString = localStorage.getItem('savedState');
  if (configurationString) {
    const shouldSave = confirm('This will overwrite the previous saved schedule. Confirm?');
    if (!shouldSave) {
      return
    }
  }
  try{
    $('.row').each(function() {
      const rowData = {
        rowId: $(this).data('row-id'),
        rowColor: $(this).data('row-color'),
        inputText: $(this).find('.text-input').val(),
        numberInputValue: $(this).find('.small-number-input').val()
      };
      rowsData.push(rowData);
    });

    $('.card').each(function() {
      const cardData = {
        cardId: $(this).data('card-id'),
        rowId: $(this).data('row-id'),
        cardText: $(this).text(),
        cellPosition: $(this).parent().data('cell-id')
      };
      cardsData.push(cardData);
    });

    $('.teacher-label-cell').each(function() {
      const labelCellDatum = {
        cellId: $(this).attr('teacher-data-cell-id'),
        cellValue: $(this).val()
      };
      labelCellData.push(labelCellDatum);
    });

    const configuration = {
      rowsData: rowsData,
      cardsData: cardsData,
      labelCellData: labelCellData
    };

    localStorage.setItem('savedState', JSON.stringify(configuration));
  } catch (error) {
    console.error(error);
    alert(`Error saving configuration: ${error.message}`);
  } 
}


function loadStateFromLocalStorage() {
  const configurationString = localStorage.getItem('savedState');
  const shouldLoad = confirm('Are you sure you want to load this file? This will overwrite your current schedule.');
  if (!shouldLoad) {
    return
  }
  if (configurationString) {
    try {
      const configuration = JSON.parse(configurationString);
      const { rowsData, cardsData, labelCellData } = configuration;

      // Remove existing rows and cards
      $('.row').remove();
      $('.card').remove();

      // Update label cells
      for (const labelCellDatum of labelCellData) {
        const labelCell = $(`.teacher-label-cell[teacher-data-cell-id="${labelCellDatum.cellId}"], .control-label-cell[teacher-data-cell-id="${labelCellDatum.cellId}"]`);
        if (labelCell.length) {
          labelCell.val(labelCellDatum.cellValue);
        } else {
          const newLabelCell = $(`<input type="text" class="teacher-label-cell" teacher-data-cell-id="${labelCellDatum.cellId}" value="${labelCellDatum.cellValue}">`);
          $('.grid-labels').append(newLabelCell);
        }
      }

      // Load rows
      for (const rowData of rowsData) {
        console.log(rowData)
        const newRow = createNewRow(rowData.rowId, rowData.rowColor, rowData.inputText, rowData.numberInputValue);
        $('.rows-container').append(newRow);
      }

    // Load cards
    for (const cardData of cardsData) {
      const rowColor = $(`.row[data-row-id="${cardData.rowId}"]`).data('row-color');
      const newCard = createCard(cardData.cardText, cardData.cardId, cardData.rowId, rowColor);

      // Use cellPosition property to append the card to the correct grid cell
      $('.grid-cell[data-cell-id="' + cardData.cellPosition + '"]').append(newCard);

      // Update control side counts
      const inputId = newCard.data('input-id');
      updateCardCount(inputId);
    }
            
    
      makeCardsDraggable();
      initializeDroppableGridCells();
    } catch (error) {
      console.error(error);
      alert(`Error loading configuration: ${error.message}`);
    }
  }
}    