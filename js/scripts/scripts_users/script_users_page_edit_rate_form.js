const FormHandler_EditRate = (function () {
  // Private variables
  let boardGameDB = {};
  // Initialize Select2 dropdown for board games
  function loadBgDetails() {
    // First destroy any existing select2 instance to prevent duplicates
    if ($("#bgSelection-edit-rate").hasClass("select2-hidden-accessible")) {
      $("#bgSelection-edit-rate").select2("destroy");
    }

    // Initialize select2 for EDITING A RATE
    $("#bgSelection-edit-rate").select2({
      ajax: {
        url: "https://localhost:7081/explore/findboardgame",
        data: (params) => ({ boardGameName: params.term }),
        processResults: (data, params) => {
          return {
            results: data.content.map((item) => ({
              id: item.boardGameId,
              text: item.boardGameName,
            })),
          };
        },
      },
      templateResult: (data) => data.text,
      templateSelection: (data) => {
        if (!data.id) return data.text;
        return $("<strong>").text(data.text);
      },
      minimumInputLength: 3,
      allowClear: true,
      theme: "classic",
      width: "100%",
      placeholder: "Type at least 3 characters to search",
    });

    $("#bgSelection-edit-rate").on("select2:select", function () {});
  }

  function checkFormFilling() {
    const isBGSelected =
      $("#bgSelection-edit-rate").val() !== null &&
      $("#bgSelection-edit-rate").val() !== "";
    let areFieldsFilled = true;

    $("#edit-rate-form .required:visible:enabled").each(function () {
      if ($(this).val().trim() === "") {
        areFieldsFilled = false;
      }
    });

    $("#confirm-newRateBG").prop(
      "disabled",
      !(isBGSelected && areFieldsFilled)
    );
  }

  function forceClearForm() {
    // Clear form
    $("#newRate").val(null).addClass("current-data");
    $("#currentRate").val(null).addClass("current-data");

    // Block form submission button
    $("#confirm-newRateBG").prop("disabled", true);

    // Clear board game selection
    $("#bgSelection-edit-rate").val(null).trigger("change");
  }

  // Set up handlers for EDITING A RATE form
  function setupEditRateForm() {
    // Set up board game selection change handler
    $(document)
      .off("select2:select", "#bgSelection-edit-rate")
      .on("select2:select", "#bgSelection-edit-rate", function () {
        // Get selected boardGameId
        const boardGameId = $(this).val();

        $("#newRate").removeClass("current-data").addClass("new-data");

        $.ajax({
          url: `https://localhost:7081/users/getrate?boardgameid=${boardGameId}`,
          type: "GET",
          xhrFields: { withCredentials: true },
          success: function (response) {
            $("#newRate").empty();
            // Fetch the old rating
            const oldRate = response.content.rate;

            // Pre-fill form fields with session data
            $("#currentRate").val(oldRate);
          },
          error: function (xhr, status, error) {
            console.error("Error fetching rating:", error);
            console.log("Status:", status);
            console.log("Response:", xhr.responseText);
            alert("Failed to fetch rating. Try again later.");
          },
        });
      });

    // Set up form submission handler
    $(document);
    $("#edit-rate-form").on("submit", function (e) {
      e.preventDefault();

      // Tell the Flipper module that we're submitting a form
      if (window.Flipper) {
        Flipper.setSubmitting(true);
      }

      // Disable submit button to prevent double submissions
      const submitBtn = $(this).find("button[type='submit']");
      const originalBtnText = submitBtn.text();
      submitBtn.attr("disabled", true).text("Submitting...");

      // Get form values
      const selectedBoardGameId = $("#bgSelection-edit-rate").val();
      const updatedRate = $("#newRate").val();

      $.ajax({
        url: "https://localhost:7081/users/editrating",
        type: "PUT",
        data: JSON.stringify({
          boardGameId: selectedBoardGameId,
          rate: updatedRate,
        }),
        contentType: "application/json",
        xhrFields: { withCredentials: true },
        success: function (response) {
          alert(response.message);

          // Reset form
          forceClearForm();
        },
        error: function (xhr, status, error) {
          console.error("Error editing rate:", error);
          console.log("Status:", status);
          console.log("Response:", xhr.responseText);
          alert("Failed to edit rate. Please try again.");
        },
        complete: () => {
          // Re-enable button
          submitBtn.attr("disabled", true).text(originalBtnText);

          // Tell the Flipper module that we're done submitting
          if (window.Flipper) {
            Flipper.setSubmitting(false);
          }
        },
      });
    });

    // React to board game selection
    $("#bgSelection-edit-rate").on("select2:select", checkFormFilling);
    $("#bgSelection-edit-rate").on("select2:clear", () => {
      checkFormFilling();
      forceClearForm();
    });
    // React to typing in any input
    $("#edit-rate-form input").on("input", checkFormFilling);
  }

  // Public API
  return {
    init: function () {
      // Listen for content changes from the Flipper module
      $(document).on("flipper:contentChanged", (event, templateId) => {
        // Initialize specific functionality based on which template was loaded
        if (templateId === "edit-rate-template") {
          $("#userOption-editRate")
            .addClass("selectedUserMenuOption")
            .prop("disabled", true);

          loadBgDetails();
        } else {
          $("#userOption-editRate")
            .removeClass("selectedUserMenuOption")
            .prop("disabled", false);
        }

        // Set up all form handlers
        this.setupAllForms();
      });

      // Also set up handlers on document ready to handle the initial load
      if ($("#edit-rate-template").length) {
        loadBgDetails();
        setupEditRateForm();
      }
    },

    // Set up all form handlers
    setupAllForms: function () {
      setupEditRateForm();
    },
  };
})();

// Initialize the form handler when the document is ready
$(function () {
  FormHandler_EditRate.init();
});
