const FormHandler_LogSession = (function () {
  // Initialize Select2 dropdown for board games
  function loadBgDetails() {
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

  function checkFormFilling() {
    const isBGSelected =
      $("#bgSelection-logSession").val() !== null &&
      $("#bgSelection-logSession").val() !== "";
    let areFieldsFilled = true;

    $("#log-session-form .required:visible:enabled").each(function () {
      if ($(this).val().trim() === "") {
        areFieldsFilled = false;
      }
    });

    $("#confirm-logNewSession").prop(
      "disabled",
      !(isBGSelected && areFieldsFilled)
    );
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
            alert(resp.message);

            // Reset form
            $(this)[0].reset();
            if (
              $("#bgSelection-logSession").hasClass("select2-hidden-accessible")
            ) {
              $("#bgSelection-logSession").val(null).trigger("change");
            }

            $("#confirm-logNewSession").prop("disabled", true);
          },
          error: (err) => {
            alert(err);
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

    // React to typing in any input
    $("#log-session-form input").on("input", checkFormFilling);

    // React to board game selection
    $("#bgSelection-logSession").on("select2:select", checkFormFilling);
    $("#bgSelection-logSession").on("select2:clear", checkFormFilling);
  }

  // Public API
  return {
    init: function () {
      // Listen for content changes from the Flipper module
      $(document).on("flipper:contentChanged", (event, templateId) => {
        // Initialize specific functionality based on which template was loaded
        if (templateId === "log-session-template") {
          loadBgDetails();
          setupLogSessionForm();
        }
      });
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
