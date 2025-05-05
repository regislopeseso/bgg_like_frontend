const FormHandler_LogSession = (function () {
  // Format date from YYYY-MM-DD to DD/MM/YYYY for display
  function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }

  // Debug helper function to inspect objects
  function logObjectProperties(obj, name) {
    console.log(`----- ${name} Properties -----`);
    for (const key in obj) {
      console.log(`${key}: ${obj[key]}`);
    }
    console.log("-------------------------");
  }

  // Initialize Select2 dropdown for board games
  function loadBgDetails() {
    console.log("Loading board game details...");

    // First destroy any existing select2 instance to prevent duplicates
    if ($("#bgSelection-logSession").hasClass("select2-hidden-accessible")) {
      $("#bgSelection-logSession").select2("destroy");
    }

    // Initialize select2 for LOG SESSION
    $("#bgSelection-logSession").select2({
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
  }

  // Set up handlers for the log session form
  function setupLogSessionForm() {
    $(document)
      .off("submit", "#log-session-form")
      .on("submit", "#log-session-form", function (e) {
        e.preventDefault();

        // Tell the Flipper module that we're submitting a form
        if (window.Flipper) {
          Flipper.setSubmitting(true);
        }

        console.log("#log-session-form submitted");

        // Disable submit button to prevent double submissions
        const submitBtn = $(this).find("button[type='submit']");
        const originalBtnText = submitBtn.text();
        submitBtn.attr("disabled", true).text("Submitting...");

        $.ajax({
          type: "POST",
          url: "https://localhost:7081/users/logsession",
          data: $(this).serialize(),
          xhrFields: {
            withCredentials: true,
          },
          success: (resp) => {
            console.log("Success:", resp);
            alert("Session logged successfully!");

            // Reset form
            $(this)[0].reset();
            if (
              $("#bgSelection-logSession").hasClass("select2-hidden-accessible")
            ) {
              $("#bgSelection-logSession").val(null).trigger("change");
            }
          },
          error: (err) => {
            console.error("Error:", err);
            alert("Failed to log session. Please try again.");
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
      console.log("Initializing >LOG SESSION< form handler...");

      // Listen for content changes from the Flipper module
      $(document).on("flipper:contentChanged", (event, templateId) => {
        console.log(
          `Form handler responding to template change: ${templateId}`
        );

        // Initialize specific functionality based on which template was loaded
        if (templateId === "log-session-template") {
          console.log(">LOG SESSION< template loaded, initializing components");
          loadBgDetails();
          setupLogSessionForm();
        }
      });

      // Also set up handlers on document ready to handle the initial load
      if ($("#log-session-template").length) {
        console.log(">LOG SESSION< template found on initial load");
        loadBgDetails();
        setupLogSessionForm();
      }
    },

    // Set up all form handlers
    setupAllForms: function () {
      setupLogSessionForm();
    },
  };
})();

// Initialize the form handler when the document is ready
$(function () {
  FormHandler_LogSession.init();
});
