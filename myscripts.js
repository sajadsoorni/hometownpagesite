let selectedCount = 0; // Counter for selected numbers
const maxSelection = 5; // Maximum numbers allowed to select
let isDrawn = false; // Flag to disable number selection after draw

// Spans for selected numbers
const selectedSpans = Array.from({ length: maxSelection }, (_, i) =>
  document.getElementById(`selectedNumber${i + 1}`)
);

// Spans for the generated draw numbers
const drawSpans = Array.from({ length: maxSelection }, (_, i) =>
  document.getElementById(`darwNumber${i + 1}`)
);

// Update the alert message
const alertMsg = document.getElementById("alert-msg");

function updateMessage(message, type) {
  alertMsg.textContent = message; // Update the message
  alertMsg.className = ""; // Reset classes

  if (type === "warning") {
    alertMsg.classList.add("warning");
  } else if (type === "success") {
    alertMsg.classList.add("success");
  } else {
    alertMsg.classList.add("default"); // Default state
  }
}

function highlightNumber(element) {
  if (isDrawn) return; // Disable number selection after draw

  const number = element.textContent; // Get the number from the clicked element

  // Check if the number is already highlighted
  if (element.classList.contains("highlight")) {
    element.classList.remove("highlight");
    selectedCount--;

    // Remove the number from the selected spans
    for (let span of selectedSpans) {
      if (span.textContent === number) {
        span.textContent = ""; // Clear the span
        break;
      }
    }
  } else {
    if (selectedCount < maxSelection) {
      element.classList.add("highlight");
      selectedCount++;

      for (let span of selectedSpans) {
        if (span.textContent === "") {
          span.textContent = number; // Add number to span
          break;
        }
      }
    } else {
      updateMessage(
        `You can only select up to ${maxSelection} numbers.`,
        "warning"
      );
    }
  }

  // Show the button only if the max selection is reached
  document.getElementById("btn-draw").style.display =
    selectedCount === maxSelection ? "block" : "none";
}

// Function to generate 5 random numbers between 1-10
function generateRandomNumbers() {
  const randomNumbers = [];
  while (randomNumbers.length < maxSelection) {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    if (!randomNumbers.includes(randomNumber)) {
      randomNumbers.push(randomNumber);
    }
  }
  return randomNumbers.sort((a, b) => a - b);
}

// Function to clear the selected and drawn numbers
function resetGame() {
  selectedCount = 0;
  isDrawn = false;

  document.querySelectorAll(".number-item").forEach((el) => {
    el.classList.remove("highlight");
  });

  selectedSpans.forEach((span) => {
    span.textContent = "";
    span.style.backgroundColor = ""; // Reset background color
  });

  drawSpans.forEach((span) => {
    span.textContent = "";
    span.style.backgroundColor = ""; // Reset background color
  });

  document.getElementById("btn-draw").textContent = "Draw";
  document.getElementById("btn-draw").disabled = false;
  document.getElementById("btn-draw").style.display = "none";

  updateMessage("Please select exactly 5 numbers.", "default"); // Reset alert message
}

// Add an event listener for the Draw button
document.getElementById("btn-draw").addEventListener("click", function () {
  if (isDrawn) {
    resetGame();
    return;
  }

  const selectedNumbers = selectedSpans
    .map((span) => span.textContent)
    .filter((num) => num !== "")
    .map(Number);

  if (selectedNumbers.length < maxSelection) {
    updateMessage(
      `Please select exactly ${maxSelection} numbers before drawing.`,
      "warning"
    );
    return;
  }

  document.getElementById("btn-draw").disabled = true;
  const randomNumbers = generateRandomNumbers();

  let matchCount = 0;

  drawSpans.forEach((span, index) => {
    span.textContent = randomNumbers[index];
    span.style.backgroundColor = ""; // Reset background color for each draw span
  });

  // Display draw results with highlighting
  setTimeout(() => {
    drawSpans.forEach((span, index) => {
      if (selectedNumbers.includes(randomNumbers[index])) {
        span.style.backgroundColor = "#1dd1a1"; // Highlight match
        matchCount++;
      }
    });

    // Update the alert message based on matches
    if (matchCount < 3) {
      updateMessage("Your matches are less than 3.", "warning");
    } else {
      updateMessage(
        `Congratulations! You have ${matchCount} matching numbers!`,
        "success"
      );
    }
  });

  document.getElementById("btn-draw").textContent = "Restart draw";
  document.getElementById("btn-draw").disabled = false;
  isDrawn = true;
});
