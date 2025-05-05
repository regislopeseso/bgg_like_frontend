/**
 * Forms Module - Handles all form-related functionality
 * This module is responsible for:
 * 1. Initializing Select2 dropdowns
 * 2. Setting up form submission handlers
 * 3. Managing session data loading/editing
 */

const FormHandler = (function () {
  // Debug helper function to inspect objects
  function logObjectProperties(obj, name) {
    console.log(`----- ${name} Properties -----`);
    for (const key in obj) {
      console.log(`${key}: ${obj[key]}`);
    }
    console.log("-------------------------");
  }

  // Set up handlers for the edit profile form
  function setupEditProfileForm() {
    $(document)
      .off("submit", "#editProfile-form")
      .on("submit", "#editProfile-form", function (e) {
        e.preventDefault();

        // Tell the Flipper module that we're submitting a form
        if (window.Flipper) {
          Flipper.setSubmitting(true);
        }

        // Disable submit button to prevent double submissions
        const submitBtn = $(this).find("button[type='submit']");
        const originalBtnText = submitBtn.text();
        submitBtn.attr("disabled", true).text("Submitting...");

        $.ajax({
          type: "PUT",
          url: "https://localhost:7081/users/editprofile",
          data: $(this).serialize(),
          xhrFields: {
            withCredentials: true,
          },
          success: function (response) {
            alert("Profile updated successfully!");
          },
          error: function (response) {
            alert("Failed to update profile. Please try again.");
          },
          complete: () => {
            // Re-enable button
            submitBtn.attr("disabled", false).text(originalBtnText);

            // Tell the Flipper module that we're done submitting
            if (window.Flipper) {
              Flipper.setSubmitting(false);
            }
          },
        });
      });
  }

  // Public API
  return {
    init: function () {
      console.log("Initializing form handlers...");

      // Listen for content changes from the Flipper module
      $(document).on("flipper:contentChanged", (event, templateId) => {
        console.log(
          `Form handler responding to template change: ${templateId}`
        );

        // Set up all form handlers
        this.setupAllForms();
      });
    },

    // Set up all form handlers
    setupAllForms: function () {
      setupEditProfileForm();

      // Additional forms can be set up here
    },
  };
})();

// Initialize the form handler when the document is ready
$(function () {
  FormHandler.init();
});
