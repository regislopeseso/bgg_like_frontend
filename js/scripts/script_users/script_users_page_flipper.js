/**
 * Flipper Module - Handles the card flipping animation and content changes
 * This module is responsible for:
 * 1. Setting up the flip card animation
 * 2. Loading different templates when buttons are clicked
 * 3. Preventing multiple clicks during animations
 * 4. Managing the visible state of the card faces
 */

// Immediately-invoked Function Expression (IIFE) to avoid polluting global scope
const Flipper = (function () {
  // Private variables
  let isRotating = false; // Track if animation is in progress
  let isSubmitting = false; // Track if a form submission is in progress
  let currentAngle = 0; // Current rotation angle
  let isBackVisible = false; // Track which side is currently visible

  // Public API
  return {
    // Initialize the flipper
    init: function () {
      console.log("Initializing flipper...");
      this.setupAnimation();
      this.setupEventListeners();

      // Show user details by default on page load
      this.rotateTo("user-details-template");
    },

    // Set up the CSS transition for the flip animation
    setupAnimation: function () {
      // Add linear transition for smooth animation
      $(".flip-card-inner").css("transition", "transform 0.6s linear");
    },

    // Set up click listeners for all menu buttons
    setupEventListeners: function () {
      const menuButtons = [
        { id: "#toggleUserDetails", template: "user-details-template" },
        { id: "#userOption-playGame", template: "play-template" },
        { id: "#userOption-logSession", template: "log-session-template" },
        { id: "#userOption-editSession", template: "edit-session-template" },
        {
          id: "#userOption-deleteSession",
          template: "delete-session-template",
        },
        { id: "#userOption-rateBg", template: "rate-bg-template" },
        { id: "#userOption-editRate", template: "edit-rate-template" },
        {
          id: "#userOption-newLifeCounter",
          template: "new-life-counter-template",
        },
      ];

      // Cache menu button elements
      const $menuButtons = $(".user-menu-button");

      // Set up click handlers for each button
      menuButtons.forEach((button) => {
        $(button.id)
          .addClass("user-menu-button")
          .on("click", (e) => {
            e.preventDefault();
            this.rotateTo(button.template, $menuButtons); // Pass the button elements
          });
      });
    },

    // Function to rotate the card and show a specific template
    rotateTo: function (templateId, $menuButtons) {
      // Prevent multiple clicks during animation
      if (isRotating) {
        console.log("Rotation already in progress, ignoring request");
        return;
      }

      // Confirm before changing views if a form is being submitted
      if (isSubmitting) {
        if (
          !confirm(
            "You have a form submission in progress. Continuing will cancel it. Proceed?"
          )
        ) {
          return;
        }
        isSubmitting = false;
      }

      // Set the rotating flag to true to prevent multiple clicks
      isRotating = true;

      // Disable menu buttons
      $menuButtons?.prop("disabled", true).addClass("disabled");

      // Select which face to update (the one that's currently hidden)
      const target = isBackVisible
        ? "#flip-front-content"
        : "#flip-back-content";

      // Load the selected template into the target face
      $(target).html($(`#${templateId}`).html());

      // Rotate the card 180 degrees
      currentAngle += 180;
      $(".flip-card-inner").css("transform", `rotateY(${currentAngle}deg)`);

      // Listen for the end of the transition
      const transitionEndHandler = () => {
        // Remove the event listener to prevent multiple triggers
        $(".flip-card-inner").off("transitionend", transitionEndHandler);

        // Reset the rotating flag when animation completes
        isRotating = false;

        // Re-enable menu buttons
        $menuButtons?.prop("disabled", false).removeClass("disabled");

        // Notify other modules that content has changed
        this.onContentChanged(templateId);
      };

      // Add the transition end event listener
      $(".flip-card-inner").on("transitionend", transitionEndHandler);

      // As a fallback, also clear the flag after a set time
      // This helps if the transitionend event somehow doesn't fire
      setTimeout(() => {
        isRotating = false;
      }, 1000); // Assuming transition takes less than 1 second

      // Toggle which face is visible
      isBackVisible = !isBackVisible;
    },

    // Called when content has changed, used by other modules to know when to initialize components
    onContentChanged: function (templateId) {
      // Trigger a custom event that other modules can listen for
      $(document).trigger("flipper:contentChanged", [templateId]);
      console.log(`Content changed to: ${templateId}`);
    },

    // Methods to be called from other modules
    setSubmitting: function (value) {
      isSubmitting = value;
    },

    isCardFlipping: function () {
      return isRotating;
    },
  };
})();

// Initialize the flipper when the document is ready
$(document).ready(function () {
  // First check if the user is authenticated
  fetch("https://localhost:7081/users/validatestatus", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.content.isUserLoggedIn == true) {
        // If the user is logged in, initialize the flipper
        console.log("User is authenticated. Initializing flipper...");
        Flipper.init();
      } else {
        // If the user is not authenticated, redirect them to the authentication page
        console.log("User is not authenticated. Redirecting...");
        window.location.href = "users_authentication.html";
      }
    })
    .catch((error) => {
      console.error("Authentication check failed:", error);
      alert("Failed to verify login status. Please try again later.");
    });
});
