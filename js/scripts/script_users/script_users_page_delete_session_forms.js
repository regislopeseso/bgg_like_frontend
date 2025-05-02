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
      templateSelection: (data) => data.text,
      minimumInputLength: 3,
      allowClear: true,
      theme: "classic",
      width: "100%",
      placeholder: "Type at least 3 characters to search",
    });
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
        console.log("Selected board game Id:", boardGameId);

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

              // Log the first session object to see its structure
              if (sessionsDB.length > 0) {
                logObjectProperties(sessionsDB[0], "First Session");
              }

              // Add options dynamically
              let counter = 1;
              response.content.sessions.forEach((session) => {
                // Get the date from the session object, handling different property names
                const sessionDate = session.date || session.Date;
                console.log(
                  "Session #",
                  counter,
                  "id:",
                  session.id || session.Id,
                  "date:",
                  sessionDate
                );
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

              // Trigger change event to refresh select2
              $("#sessionSelection-delete").trigger("change");
            } else {
              $("#sessionSelection-delete")
                .append(new Option("No sessions found", ""))
                .trigger("change");
            }
          },
          error: function () {
            alert("Failed to delete sessions. Try again later.");
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
          console.log("Pre-filling form with:", selectedSession);
          logObjectProperties(selectedSession, "Selected Session");

          // Check all possible property name formats (handle case inconsistency)
          // Pre-fill form fields with session data
          $("#playersCount-delSession").val(selectedSession.playersCount);
          $("#matchDuration-delSession").val(selectedSession.duration_minutes);

          console.log("Session to-be-deleted details");
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
          success: function (response) {
            console.log("Session updated:", response);
            alert("Session deleted successfully!");
          },
          error: function (err) {
            console.error("Error:", err);
            alert("Failed to delete session. Please try again.");
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
        if (templateId === "delete-session-template") {
          loadBgDetails();
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
