const FormHandler_EditRate = (function () {
  // Private variables
  let boardGameDB = {};
  // Initialize Select2 dropdown for board games
  function loadBgDetails() {
    console.log("Loading board game details...");

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
      templateSelection: (data) => data.text,
      minimumInputLength: 3,
      allowClear: true,
      theme: "classic",
      width: "100%",
      placeholder: "Type at least 3 characters to search",
    });

    $("#bgSelection-edit-rate").on("select2:select", function () {});
  }

  // Set up handlers for EDITING A RATE form
  function setupEditRateForm() {
    // Set up board game selection change handler
    $(document)
      .off("select2:select", "#bgSelection-edit-rate")
      .on("select2:select", "#bgSelection-edit-rate", function () {
        // Get selected boardGameId
        const boardGameId = $(this).val();
        console.log("Selected board game Id:", boardGameId);

        $.ajax({
          url: `https://localhost:7081/users/getrate?boardgameid=${boardGameId}`,
          type: "GET",
          xhrFields: { withCredentials: true },
          success: function (response) {
            $("#newRate").empty();
            // Fetch the old rating
            const oldRate = response.content.rate;

            // Pre-fill form fields with session data
            $("#newRate").val(oldRate);
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
          console.log("Rate edited:", response);
          alert(response.message);

          $("#bgSelection-edit-rate").val(null).trigger("change");
          $("#newRate").empty().trigger("change");
        },
        error: function (xhr, status, error) {
          console.error("Error editing rate:", error);
          console.log("Status:", status);
          console.log("Response:", xhr.responseText);
          alert("Failed to edit rate. Please try again.");
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
      console.log("Initializing >EDIT RATE< form handler...");

      // Listen for content changes from the Flipper module
      $(document).on("flipper:contentChanged", (event, templateId) => {
        console.log(
          `Form handler responding to template change: ${templateId}`
        );

        // Initialize specific functionality based on which template was loaded
        if (templateId === "edit-rate-template") {
          loadBgDetails();
        }

        // Set up all form handlers
        this.setupAllForms();
      });
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
