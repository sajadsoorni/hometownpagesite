let selectedCount = 0; // Tracks how many numbers have been selected by the user
const maxSelection = 5; // Defines the maximum allowed number of selections
let isDrawn = false; // Flag to prevent further selections after the draw is completed

// Create an array of span elements to hold the user's selected numbers.
// The spans are identified by their unique IDs ('selectedNumber1', 'selectedNumber2', etc.).
const selectedSpans = Array.from({ length: maxSelection }, (_, i) =>
  document.getElementById(`selectedNumber${i + 1}`)
);

// Create an array of span elements to hold the drawn (randomly generated) numbers.
// These spans are identified by their unique IDs ('drawNumber1', 'drawNumber2', etc.).
const drawSpans = Array.from({ length: maxSelection }, (_, i) =>
  document.getElementById(`darwNumber${i + 1}`)
);

// Reference to the alert message element, where feedback will be displayed to the user.
const alertMsg = document.getElementById("alert-msg");

/**
 * Updates the content and style of the alert message.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message ('warning', 'success', 'default').
 */
function updateMessage(message, type) {
  alertMsg.textContent = message; // Set the new alert message
  alertMsg.className = ""; // Remove any previously set class to reset the styling

  // Apply the appropriate class based on the message type
  if (type === "warning") {
    alertMsg.classList.add("warning");
  } else if (type === "success") {
    alertMsg.classList.add("success");
  } else {
    alertMsg.classList.add("default"); // Default state for neutral messages
  }
}

/**
 * Highlights the clicked number, allowing the user to select it.
 * If the number has already been selected, it will be deselected.
 * @param {HTMLElement} element - The clicked number element.
 */
function highlightNumber(element) {
  if (isDrawn) return; // Prevent further selections if the draw has already occurred

  const number = element.textContent; // Extract the number text from the clicked element

  // Check if the number is already selected (highlighted)
  if (element.classList.contains("highlight")) {
    element.classList.remove("highlight"); // Remove the highlight class
    selectedCount--; // Decrease the selected count

    // Remove the deselected number from the corresponding span
    for (let span of selectedSpans) {
      if (span.textContent === number) {
        span.textContent = ""; // Clear the span if it holds the deselected number
        break;
      }
    }
  } else {
    // If the number isn't highlighted and the selection limit isn't reached
    if (selectedCount < maxSelection) {
      element.classList.add("highlight"); // Add the highlight class to the selected number
      selectedCount++; // Increment the selected count

      // Add the selected number to the first available empty span
      for (let span of selectedSpans) {
        if (span.textContent === "") {
          span.textContent = number; // Store the selected number
          break;
        }
      }
    } else {
      // Display a warning message if the user tries to select more than allowed
      updateMessage(
        `You can only select up to ${maxSelection} numbers.`,
        "warning"
      );
    }
  }

  // Show the 'Draw' button only if the user has selected the maximum allowed numbers
  document.getElementById("btn-draw").style.display =
    selectedCount === maxSelection ? "block" : "none";
}

/**
 * Generates an array of unique random numbers within the range of 1 to 10.
 * @returns {number[]} - An array of 5 unique random numbers sorted in ascending order.
 */
function generateRandomNumbers() {
  const randomNumbers = [];
  // Continue generating numbers until the array contains 5 unique values
  while (randomNumbers.length < maxSelection) {
    const randomNumber = Math.floor(Math.random() * 10) + 1; // Generate a random number between 1 and 10
    if (!randomNumbers.includes(randomNumber)) {
      randomNumbers.push(randomNumber); // Add the number if it's not already in the array
    }
  }
  return randomNumbers.sort((a, b) => a - b); // Sort the numbers in ascending order
}

/**
 * Resets the game by clearing all selected and drawn numbers,
 * resetting the state and hiding the 'Draw' button.
 */
function resetGame() {
  selectedCount = 0; // Reset the count of selected numbers
  isDrawn = false; // Allow number selection again

  // Remove highlights from all number elements
  document.querySelectorAll(".number-item").forEach((el) => {
    el.classList.remove("highlight");
  });

  // Clear the content of all selected number spans
  selectedSpans.forEach((span) => {
    span.textContent = "";
    span.style.backgroundColor = ""; // Reset background color
  });

  // Clear the content of all draw number spans
  drawSpans.forEach((span) => {
    span.textContent = "";
    span.style.backgroundColor = ""; // Reset background color
  });

  // Reset the 'Draw' button to its initial state
  document.getElementById("btn-draw").textContent = "Draw";
  document.getElementById("btn-draw").disabled = false;
  document.getElementById("btn-draw").style.display = "none"; // Hide the button

  // Reset the alert message to its default state
  updateMessage("Please select exactly 5 numbers.", "default");
}

// Event listener for the 'Draw' button click event
document.getElementById("btn-draw").addEventListener("click", function () {
  if (isDrawn) {
    // If a draw has already occurred, reset the game when the button is clicked again
    resetGame();
    return;
  }

  // Get the user's selected numbers, filtering out any empty selections
  const selectedNumbers = selectedSpans
    .map((span) => span.textContent)
    .filter((num) => num !== "")
    .map(Number);

  // Check if the user has selected exactly 5 numbers
  if (selectedNumbers.length < maxSelection) {
    updateMessage(
      `Please select exactly ${maxSelection} numbers before drawing.`,
      "warning"
    );
    return;
  }

  document.getElementById("btn-draw").disabled = true; // Disable the draw button during the draw process
  const randomNumbers = generateRandomNumbers(); // Generate 5 random numbers for the draw

  let matchCount = 0; // Initialize match counter

  // Display the drawn numbers in the draw spans
  drawSpans.forEach((span, index) => {
    span.textContent = randomNumbers[index];
    span.style.backgroundColor = ""; // Reset background color for each draw span
  });

  // Delay to highlight matched numbers and update the message
  setTimeout(() => {
    drawSpans.forEach((span, index) => {
      if (selectedNumbers.includes(randomNumbers[index])) {
        span.style.backgroundColor = "#1dd1a1"; // Highlight matching numbers
        matchCount++; // Increment the match counter for each match
      }
    });

    // Update the alert message based on the number of matches
    if (matchCount < 3) {
      updateMessage("Your matches are less than 3.", "warning");
    } else {
      updateMessage(
        `Congratulations! You have ${matchCount} matching numbers!`,
        "success"
      );
    }
  });

  // Change the button text to 'Restart draw' after drawing
  document.getElementById("btn-draw").textContent = "Restart draw";
  document.getElementById("btn-draw").disabled = false; // Enable the button for restarting
  isDrawn = true; // Set the draw flag to true to prevent further selections
});
