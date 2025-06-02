const FormHandler_EditRate = (function () {
  // Private variables
  let ratedboardgames = [];
  let ratingId = null;
  // Initialize Select2 dropdown for board games
  function loadBgDetails() {
    // First destroy any existing select2 instance to prevent duplicates
    if ($("#bgSelection-edit-rate").hasClass("select2-hidden-accessible")) {
      $("#bgSelection-edit-rate").select2("destroy");
    }

    $.ajax({
      url: `https://localhost:7081/users/listratedboardgames`,
      type: "GET",
      xhrFields: { withCredentials: true },
      success: function (response) {
        ratedboardgames = [];
        // Clear current options
        $("#bgSelection-edit-rate").empty();

        // Check if any board games are returned
        if (response.content != null) {
          ratedboardgames = response.content;

          $("#edit-rating-label").empty();

          $("#edit-rating-label").append(
            `<span>S</span>elect one of your <span>rated</span> Board Games <span>(${ratedboardgames.length})</span>`
          );

          // Add options dynamically
          let counter = 1;
          ratedboardgames.forEach((boardgame) => {
            counter++;

            // Create option with formatted date (if available) or fall back to session ID
            const optionText = `${boardgame.boardGameName} - your rating: ${boardgame.rate}`;
            const optionValue = boardgame.ratingId;

            $("#bgSelection-edit-rate").append(
              new Option(optionText, optionValue)
            );
          });

          // Add an empty default option with the placeholder text
          $("#bgSelection-edit-rate").append(
            new Option("Select a board game", "", true, true)
          );

          // Refresh select2 without triggering change event to avoid auto-selection
          if (
            $("#bgSelection-edit-rate").hasClass("select2-hidden-accessible")
          ) {
            $("#bgSelection-edit-rate").select2("destroy");
          }
          $("#bgSelection-edit-rate").select2({
            theme: "classic",
            width: "100%",
            allowClear: true,
            placeholder: "Pick a board game",
            templateSelection: (data) => {
              if (!data.id) return data.text;
              return $("<strong>").text(data.text);
            },
          });

          $("#bgSelection-edit-rate").select2("open");
        } else {
          $("edit-rate-template-title").append(
            `<p><span style="color: var(--yellowish)">No rated board games found</span></p>`
          );
          // Add empty option with "No sessions found" text
          $("#bgSelection-edit-rate").empty().addClass("current-data");

          // Refresh select2
          if (
            $("#bgSelection-edit-rate").hasClass("select2-hidden-accessible")
          ) {
            $("#bgSelection-edit-rate").select2("destroy");
          }
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching sessions:", error);
        console.log("Status:", status);
        console.log("Response:", xhr.responseText);
        sweetAlertError("Failed to fetch rated boardgames.");
      },
    });
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
      title: title_text || "",
      text: message_text || "",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  function checkFormFilling() {
    const isBGSelected =
      $("#bgSelection-edit-rate").val() !== null &&
      $("#bgSelection-edit-rate").val() !== "";

    if (isBGSelected === true) {
      $("#new-rating")
        .removeClass("current-data")
        .addClass("new-data")
        .trigger("focus");

      $("#delete-rating").prop("disabled", false);
    } else {
      $("#new-rating")
        .removeClass("new-data")
        .addClass("current-data")
        .val(null);

      $("#delete-rating").on("disabled", true);
    }

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
  function monitorFormFilling() {
    // React to board game selection
    $("#bgSelection-edit-rate").on("select2:select", checkFormFilling);
    $("#bgSelection-edit-rate").on("select2:clear", () => {
      checkFormFilling();
      forceClearForm();
    });
    // React to typing in any input
    $("#edit-rate-form input").on("input", checkFormFilling);
  }
  function forceClearForm() {
    // Clear form
    $("#newRate").val(null).addClass("current-data");
    $("#currentRate").val(null).addClass("current-data");

    // Block form submission button
    $("#confirm-newRateBG").prop("disabled", true);

    // Clear board game selection
    $("#bgSelection-edit-rate").val(null).trigger("change");
    loadBgDetails();
  }

  // Set up handlers for EDITING A RATING form
  function setupEditRateForm() {
    // Set up form submission handler
    $(document)
      .off("submit", "#edit-rate-form")
      .on("submit", "#edit-rate-form", function (e) {
        e.preventDefault();

        // Tell the Flipper module that we're submitting a form
        if (window.Flipper) {
          Flipper.setSubmitting(true);
        }

        // Disable submit button to prevent double submissions
        const submitBtn = $(this).find("button[type='submit']");
        const originalBtnText = submitBtn.text();
        submitBtn.attr("disabled", true).text("Submitting...");

        const buttons = $(this).find("button[type='button']");

        const rateID = $("#bgSelection-edit-rate").val();
        const updatedRate = $("#new-rating").val();

        $.ajax({
          url: "https://localhost:7081/users/editrating",
          type: "PUT",
          data: JSON.stringify({
            ratingId: rateID,
            rate: updatedRate,
          }),
          contentType: "application/json",
          xhrFields: { withCredentials: true },
          success: function (resp) {
            sweetAlertSuccess("Rating updated!", resp.message);

            // Clear form fields after successful update
            forceClearForm();
          },
          error: function (xhr, status, error) {
            console.error("Error updating rating:", error);
            console.log("Status:", status);
            console.log("Response:", xhr.responseText);
            sweetAlertError("Failed to edit rating.");
          },
          complete: () => {
            // Re-enable button
            submitBtn.attr("disabled", true).text(originalBtnText);

            //loadBgDetails();
            // Tell the Flipper module that we're done submitting
            if (window.Flipper) {
              Flipper.setSubmitting(false);
            }
          },
        });
      });

    monitorFormFilling();
  }
  // Set up handlers for the >DELETE RATING< form
  function setUpDeleteSession() {
    $(document)
      .off("select2:select", "#bgSelection-edit-rate")
      .on("select2:select", "#bgSelection-edit-rate", function () {
        let rateId = $("#bgSelection-edit-rate").val();

        $("#delete-rating").on("click", function (e) {
          e.preventDefault();

          $.ajax({
            url: `https://localhost:7081/users/deleterating?RateId=${rateId}`,
            type: "DELETE",
            xhrFields: { withCredentials: true },
            success: function (resp) {
              sweetAlertSuccess(resp.message);

              //Clear form
              forceClearForm();
            },
            error: function (err) {
              sweetAlertError(err);
            },
            complete: () => {
              // Tell the Flipper module that we're done submitting
              if (window.Flipper) {
                Flipper.setSubmitting(false);
              }
            },
          });
        });
      });
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
      setUpDeleteSession();
    },
  };
})();

// Initialize the form handler when the document is ready
$(function () {
  FormHandler_EditRate.init();
});
