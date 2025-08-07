const FormHandler_RateBg = (function () {
  // Initialize Select2 dropdown for board games
  function loadBgDetails() {
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

    $("#bgSelection-rate").select2("open");
  }

  function checkFormFilling() {
    const isBGSelected =
      $("#bgSelection-rate").val() !== null &&
      $("#bgSelection-rate").val() !== "";
    let areFieldsFilled = true;

    $("#rate-bg-form .required:visible:enabled").each(function () {
      if ($(this).val().trim() === "") {
        areFieldsFilled = false;
      }
    });

    $("#confirm-rateBG").prop("disabled", !(isBGSelected && areFieldsFilled));
  }

  function sweetAlertSuccess(title_text, message_text) {
    Swal.fire({
      position: "center",
      confirmButtonText: "OK!",
      icon: "success",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  function sweetAlertError(title_text, message_text) {
    Swal.fire({
      position: "center",
      confirmButtonText: "OK!",
      icon: "error",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  function forceClearForm() {
    // Clear form
    $("#rate").val(null).addClass("current-data");

    // Block form submission button
    $("#confirm-rateBG").prop("disabled", true);

    // Clear board game selection
    $("#bgSelection-rate").val(null).trigger("change");
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

        $("#rate")
          .removeClass("current-data")
          .addClass("new-data")
          .trigger("focus");
      });

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
        success: function (resp) {
          if (resp.content !== null) {
            sweetAlertSuccess("Board game rated", resp.message);
          }
          if (resp.content === null) {
            sweetAlertError("Rating failed", resp.message);
          }

          // Reset form
          forceClearForm();
        },
        error: function (err) {
          sweetAlertError("Rating failed.", err);
        },
        complete: () => {
          // Re-enable button
          submitBtn.attr("disabled", true).text(originalBtnText);

          // Tell the Flipper module that we're done submitting
          if (window.Flipper) {
            Flipper.setSubmitting(false);
          }

          $("#bgSelection-rate").select2("open");
        },
      });
    });

    // React to board game selection
    $("#bgSelection-rate").on("select2:select", checkFormFilling);
    $("#bgSelection-rate").on("select2:clear", () => {
      checkFormFilling();
      forceClearForm();
    });
    // React to typing in any input
    $("#rate-bg-form input").on("input", checkFormFilling);
  }

  // Public API
  return {
    init: function () {
      // Listen for content changes from the Flipper module
      $(document).on("flipper:contentChanged", (event, templateId) => {
        // Initialize specific functionality based on which template was loaded
        if (templateId === "rate-bg-template") {
          $("#userOption-rateBg")
            .addClass("selectedUserMenuOption")
            .prop("disabled", true);

          loadBgDetails();
        } else {
          $("#userOption-rateBg")
            .removeClass("selectedUserMenuOption")
            .prop("disabled", false);
        }

        // Set up all form handlers
        this.setupAllForms();
      });

      // Also set up handlers on document ready to handle the initial load
      if ($("#rate-bg-template").length) {
        loadBgDetails();
        setupRateBgForm();
      }
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
