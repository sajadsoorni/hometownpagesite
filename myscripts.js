let selectedCount = 0; // Counter for selected numbers
const maxSelection = 5; // Maximum numbers allowed to select
let isDrawn = false; // Flag to disable number selection after draw

// Spans for selected numbers
const selectedSpans = [
  document.getElementById("selectedNumber1"),
  document.getElementById("selectedNumber2"),
  document.getElementById("selectedNumber3"),
  document.getElementById("selectedNumber4"),
  document.getElementById("selectedNumber5"),
];

// Spans for the generated draw numbers
const drawSpans = [
  document.getElementById("darwNumber1"),
  document.getElementById("darwNumber2"),
  document.getElementById("darwNumber3"),
  document.getElementById("darwNumber4"),
  document.getElementById("darwNumber5"),
];

// Initialize the popup
const popup = document.getElementById("popup");
popup.style.display = "none"; // Hide the popup initially

function showPopup(message) {
  const popupMessage = document.getElementById("popup-message");
  popupMessage.textContent = message; // Set the message
  popup.style.opacity = "1"; // Make the popup visible
  popup.style.display = "flex"; // Use flex to center content
}

// Close the popup when the close button is clicked
document.getElementById("close-popup").onclick = function () {
  popup.style.display = "none"; // Hide the popup
};

// Close the popup when clicking outside of the popup content
window.onclick = function (event) {
  if (event.target === popup) {
    popup.style.display = "none";
  }
};

function highlightNumber(element) {
  if (isDrawn) return; // Disable number selection after draw

  const number = element.textContent; // Get the number from the clicked element

  // Check if the number is already highlighted
  if (element.classList.contains("highlight")) {
    // If it is, remove the highlight and decrease the count
    element.classList.remove("highlight");
    selectedCount--;

    // Remove the number from the selected spans
    for (let i = 0; i < selectedSpans.length; i++) {
      if (selectedSpans[i].textContent === number) {
        selectedSpans[i].textContent = ""; // Clear the span
        break; // Exit the loop
      }
    }
  } else {
    // Check if the maximum selection is reached
    if (selectedCount < maxSelection) {
      element.classList.add("highlight"); // Highlight the number
      selectedCount++; // Increase the count

      // Add the number to the next available span
      for (let i = 0; i < selectedSpans.length; i++) {
        if (selectedSpans[i].textContent === "") {
          selectedSpans[i].textContent = number; // Set the text of the span to the number
          break; // Exit the loop
        }
      }
    } else {
      showPopup(`You can only select up to ${maxSelection} numbers.`);
    }
  }
}

// Function to generate 5 random numbers between 1-10
function generateRandomNumbers() {
  const randomNumbers = [];
  while (randomNumbers.length < maxSelection) {
    const randomNumber = Math.floor(Math.random() * 10) + 1; // Generate number between 1 and 10
    if (!randomNumbers.includes(randomNumber)) {
      randomNumbers.push(randomNumber); // Ensure the number is unique
    }
  }
  return randomNumbers.sort((a, b) => a - b); // Sort the numbers
}

// Function to clear the selected and drawn numbers
function resetGame() {
  selectedCount = 0;
  isDrawn = false;
  document.getElementById("btn-draw").disabled = false; // Re-enable the Draw button

  // Unhighlight all the number elements
  document.querySelectorAll(".number-item").forEach((el) => {
    el.classList.remove("highlight");
  });

  // Clear the selected numbers
  selectedSpans.forEach((span) => {
    span.textContent = "";
    span.style.backgroundColor = ""; // Reset background color
  });

  // Clear the drawn numbers
  drawSpans.forEach((span) => {
    span.textContent = "";
    span.style.backgroundColor = ""; // Reset background color
  });
}

// Add an event listener for the Draw button
document.getElementById("btn-draw").addEventListener("click", function () {
  // Step 1: Collect the selected numbers
  const selectedNumbers = Array.from(selectedSpans)
    .map((span) => span.textContent)
    .filter((num) => num !== "") // Filter out empty spans
    .map(Number); // Convert to numbers

  // Step 2: Check if exactly 5 numbers are selected
  if (selectedNumbers.length < maxSelection) {
    showPopup(`Please select exactly ${maxSelection} numbers before drawing.`);
    return; // Stop further execution if fewer than 5 numbers are selected
  }

  // Disable the Draw button after it's clicked
  document.getElementById("btn-draw").disabled = true;

  // Step 3: Sort the selected numbers
  selectedNumbers.sort((a, b) => a - b); // Sort the selected numbers

  // Add the hidden class to initiate fade-out effect
  selectedSpans.forEach((span) => {
    span.classList.add("hidden");
  });

  // Update the selected spans with sorted numbers
  setTimeout(() => {
    selectedSpans.forEach((span, index) => {
      span.textContent =
        selectedNumbers[index] !== undefined ? selectedNumbers[index] : ""; // Set sorted numbers or clear if none
      span.classList.remove("hidden"); // Remove the hidden class to fade in
      span.classList.add("visible"); // Add visible class for fade-in
    });
  }, 500);

  // Step 4: Generate and display random draw numbers
  const randomNumbers = generateRandomNumbers();

  // Add the hidden class to the draw spans for fade-out effect
  drawSpans.forEach((span) => {
    span.classList.add("hidden");
  });

  // Count matching numbers
  let matchCount = 0;

  // Update the draw spans with sorted random numbers
  setTimeout(() => {
    drawSpans.forEach((span, index) => {
      span.textContent = randomNumbers[index]; // Set sorted random numbers
      span.classList.remove("hidden"); // Remove the hidden class to fade in
      span.classList.add("visible"); // Add visible class for fade-in

      // Step 5: Highlight matching numbers with background color #1dd1a1
      if (selectedNumbers.includes(randomNumbers[index])) {
        span.style.backgroundColor = "#1dd1a1"; // Highlight match
        matchCount++; // Increment match count
      }
    });

    // Step 6: Show a congratulatory popup if 3 or more numbers match
    if (matchCount >= 3) {
      showPopup(`Congratulations! You have ${matchCount} matching numbers!`);
    }
  }, 500);

  // Disable further number selection
  isDrawn = true;
});

// Add an event listener for the Restart button
document.getElementById("btn-restart").addEventListener("click", function () {
  resetGame(); // Clear the selected and drawn numbers
});
