const FormHandler_RateBg = (function () {
  // Initialize Select2 dropdown for board games
  function loadBgDetails() {
    console.log("Loading board game details...");

    // First destroy any existing select2 instance to prevent duplicates
    if ($("#bgSelection-rate").hasClass("select2-hidden-accessible")) {
      $("#bgSelection-rate").select2("destroy");
    }

    // Initialize select2 for RATING A BOARD GAME
    $("#bgSelection-rate").select2({
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
  }

  // Set up handlers for the RATING a board game form
  // Set up handlers for the edit session form
  function setupRateBgForm() {
    // Set up board game selection change handler
    $(document)
      .off("select2:select", "#bgSelection-rate")
      .on("select2:select", "#bgSelection-rate", function () {
        // Get selected boardGameId
        const boardGameId = $(this).val();
        console.log("Selected board game Id:", boardGameId);
      });

    // Set up form submission handler
    $(document);
    $("#rate-bg-form").on("submit", function (e) {
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
        url: "https://localhost:7081/users/rate",
        type: "POST",
        data: $(this).serialize(),
        xhrFields: { withCredentials: true },
        success: function (response) {
          console.log("Board Game rated:", response);
          alert(response.message);
        },
        error: function (err) {
          console.error("Error:", err);
          alert("Rating failed. Please try again.");
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
      console.log("Initializing form handler...");

      // Listen for content changes from the Flipper module
      $(document).on("flipper:contentChanged", (event, templateId) => {
        console.log(
          `Form handler responding to template change: ${templateId}`
        );

        // Initialize specific functionality based on which template was loaded
        if (templateId === "rate-bg-template") {
          loadBgDetails();
        }

        // Set up all form handlers
        this.setupAllForms();
      });
    },

    // Set up all form handlers
    setupAllForms: function () {
      setupRateBgForm();
    },
  };
})();

// Initialize the form handler when the document is ready
$(function () {
  FormHandler_RateBg.init();
});
