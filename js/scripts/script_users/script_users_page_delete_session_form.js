/**
 * Forms Module - Handles all form-related functionality
 * This module is responsible for:
 * 1. Initializing Select2 dropdowns
 * 2. Setting up form submission handlers
 * 3. Managing session data loading/editing
 */

const FormHandler_DeleteSession = (function () {
  // Private variables
  let sessionsDB = []; // Store sessions data globally

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }

  // Initialize Select2 dropdown for board games
  function loadBgDetails() {
    // First destroy any existing select2 instance to prevent duplicates
    if ($("#bgSelection-deleteSession").hasClass("select2-hidden-accessible")) {
      $("#bgSelection-deleteSession").select2("destroy");
    }

    // Initialize select2 for DELETE SESSION
    $("#bgSelection-deleteSession").select2({
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
      $("#bgSelection-deleteSession").val() !== null &&
      $("#bgSelection-deleteSession").val() !== "";

    const isSessionSelected =
      $("#sessionSelection-delete").val() !== null &&
      $("#sessionSelection-delete").val() !== "";

    $("#confirm-deleteSession").prop(
      "disabled",
      !(isBGSelected && isSessionSelected)
    );
  }

  // Set up handlers for the DELETE SESSION form
  // Set up handlers for the edit session form
  function setupDeleteSessionForm() {
    // Set up board game selection change handler
    $(document)
      .off("select2:select", "#bgSelection-deleteSession")
      .on("select2:select", "#bgSelection-deleteSession", function () {
        // Get selected boardGameId
        const boardGameId = $(this).val();

        if (!boardGameId) {
          // Clear the second select if nothing is selected
          $("#sessionSelection-delete").empty().trigger("change");
          return;
        }

        // Fetch sessions based on selected boardGameId
        $.ajax({
          url: `https://localhost:7081/users/getsessions?boardgameid=${boardGameId}`,
          type: "GET",
          xhrFields: { withCredentials: true },
          success: function (response) {
            // Clear current options
            $("#sessionSelection-delete").empty();

            // Check if any sessions are returned
            if (response.content && response.content.sessions) {
              sessionsDB = response.content.sessions;
              console.log("Sessions found:", sessionsDB);

              $("#delete-session-label").empty();

              $("#delete-session-label").append(
                `<span style="color: var(--reddish)">S</span>elect a Board Game <span style="color: var(--reddish)">(${sessionsDB.length})</span>`
              );

              // Add options dynamically
              let counter = 1;
              response.content.sessions.forEach((session) => {
                // Get the date from the session object, handling different property names
                const sessionDate = session.date || session.Date;

                counter++;

                // Create option with formatted date (if available) or fall back to session ID
                const optionText = sessionDate
                  ? formatDateToDDMMYYYY(sessionDate)
                  : `Session ${session.id || session.Id}`;
                const optionValue = session.id || session.Id;

                $("#sessionSelection-delete").append(
                  new Option(optionText, optionValue)
                );
              });

              // Add an empty default option with the placeholder text
              $("#sessionSelection-delete").append(
                new Option("Select a session", "", true, true)
              );

              // Refresh select2 without triggering change event to avoid auto-selection
              if (
                $("#sessionSelection-delete").hasClass(
                  "select2-hidden-accessible"
                )
              ) {
                $("#sessionSelection-delete").select2("destroy");
              }
              $("#sessionSelection-delete").select2({
                theme: "classic",
                width: "100%",
                placeholder: "Select a session",
                templateSelection: (data) => {
                  if (!data.id) return data.text;
                  return $("<strong>").text(data.text);
                },
              });
            } else {
              $("#sessionSelection-delete")
                .append(new Option("No sessions found", ""))
                .trigger("change");
            }
          },
          error: function (response) {
            alert("Failed to delete sessions. Try again later.", response);
          },
        });
      });

    // Set up session selection change handler
    $(document)
      .off("select2:select", "#sessionSelection-delete")
      .on("select2:select", "#sessionSelection-delete", function () {
        const sessionId = $(this).val();

        if (!sessionId) return;

        // Find selected session from our cached data
        const selectedSession = sessionsDB.find(
          (session) => session.id == sessionId || session.Id == sessionId
        );

        if (selectedSession) {
          // Check all possible property name formats (handle case inconsistency)
          // Pre-fill form fields with session data
          $("#playersCount-delSession").html(
            `<div class="text-start">Players Count: <span style="color: var(--reddish)">${selectedSession.playersCount}</span></div>`
          );
          $("#matchDuration-delSession").html(
            `<div class="text-start">Match Duration: <span style="color: var(--reddish)">${selectedSession.duration_minutes}</span></div>`
          );
        } else {
          console.warn("Session not found in sessionsDB:", sessionId);
        }
      });

    // Set up form submission handler
    $(document)
      .off("submit", "#delete-session-form")
      .on("submit", "#delete-session-form", function (e) {
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
          url: `https://localhost:7081/users/deletesession?SessionId=${$(
            "#sessionSelection-delete"
          ).val()}`,
          type: "DELETE",
          xhrFields: { withCredentials: true },
          success: function (resp) {
            alert(resp.message);

            // Clear selects
            if (
              $("#bgSelection-deleteSession").hasClass(
                "select2-hidden-accessible"
              )
            ) {
              $("#bgSelection-deleteSession").val(null).trigger("change");
            }
            if (
              $("#sessionSelection-delete").hasClass(
                "select2-hidden-accessible"
              )
            ) {
              $("#sessionSelection-delete").val(null).trigger("change");
            }
            // Replace second select2 label removing its sessions counter
            $("#delete-session-label").html(`<span>S</span>elect a Board Game`);
            //Clear form
            $("#delete-session-form")[0].reset();
            //Clear session details
            $(".sessionDataPreview").empty();
            // Block form submission button
            $("#confirm-deleteSession").prop("disabled", true);
          },
          error: function (err) {
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

    // React to board game selection
    $("#bgSelection-deleteSession").on("select2:select", checkFormFilling);
    $("#bgSelection-deleteSession").on("select2:clear", checkFormFilling);
    // React to session selection
    $("#sessionSelection-delete").on("select2:select", checkFormFilling);
    $("#sessionSelection-delete").on("select2:clear", checkFormFilling);
  }

  // Public API
  return {
    init: function () {
      // Listen for content changes from the Flipper module
      $(document).on("flipper:contentChanged", (event, templateId) => {
        // Initialize specific functionality based on which template was loaded
        if (templateId === "delete-session-template") {
          $("#userOption-deleteSession")
            .addClass("selectedUserMenuOption")
            .prop("disabled", true);

          loadBgDetails();
        } else {
          $("#userOption-deleteSession")
            .removeClass("selectedUserMenuOption")
            .prop("disabled", false);
        }

        // Set up all form handlers
        this.setupAllForms();
      });
    },

    // Set up all form handlers
    setupAllForms: function () {
      setupDeleteSessionForm();
    },
  };
})();

// Initialize the form handler when the document is ready
$(function () {
  FormHandler_DeleteSession.init();
});
