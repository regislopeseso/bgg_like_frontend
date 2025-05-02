/**
 * Forms Module - Handles all form-related functionality
 * This module is responsible for:
 * 1. Initializing Select2 dropdowns
 * 2. Setting up form submission handlers
 * 3. Managing session data loading/editing
 */

const FormHandler = (function () {
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

  // Initialize Select2 dropdowns for board games
  function loadBgDetails() {
    console.log("Loading board game details...");

    // First destroy any existing select2 instance to prevent duplicates
    if ($("#bgSelection-logSession").hasClass("select2-hidden-accessible")) {
      $("#bgSelection-logSession").select2("destroy");
    }

    if ($("#bgSelection-editSession").hasClass("select2-hidden-accessible")) {
      $("#bgSelection-editSession").select2("destroy");
    }

    // Initialize select2 for log session
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
      templateSelection: (data) => data.text,
      minimumInputLength: 3,
      allowClear: true,
      theme: "classic",
      width: "100%",
      placeholder: "Type at least 3 characters to search",
    });

    // Initialize select2 for edit session
    $("#bgSelection-editSession").select2({
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

    // Initialize sessionSelection-edit with select2
    $("#sessionSelection-edit").select2({
      theme: "classic",
      width: "100%",
      placeholder: "Select a session date",
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

  // Set up handlers for the edit session form
  function setupEditSessionForm() {
    // Set up board game selection change handler
    $(document)
      .off("select2:select", "#bgSelection-editSession")
      .on("select2:select", "#bgSelection-editSession", function () {
        // Get selected boardGameId
        const boardGameId = $(this).val();
        console.log("Selected board game Id:", boardGameId);

        if (!boardGameId) {
          // Clear the second select if nothing is selected
          $("#sessionSelection-edit").empty().trigger("change");
          return;
        }

        // Fetch sessions based on selected boardGameId
        $.ajax({
          url: `https://localhost:7081/users/getsessions?boardgameid=${boardGameId}`,
          type: "GET",
          xhrFields: { withCredentials: true },
          success: function (response) {
            // Clear current options
            $("#sessionSelection-edit").empty();

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

                $("#sessionSelection-edit").append(
                  new Option(optionText, optionValue)
                );
              });

              // Trigger change event to refresh select2
              $("#sessionSelection-edit").trigger("change");
            } else {
              $("#sessionSelection-edit")
                .append(new Option("No sessions found", ""))
                .trigger("change");
            }
          },
          error: function () {
            alert("Failed to load sessions. Try again later.");
          },
        });
      });

    // Set up session selection change handler
    $(document)
      .off("select2:select", "#sessionSelection-edit")
      .on("select2:select", "#sessionSelection-edit", function () {
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
          $("#newSessionDate").val(
            selectedSession.date || selectedSession.Date
          );
          $("#newPlayersCount").val(
            selectedSession.playersCount ||
              selectedSession.PlayersCount ||
              selectedSession.playerscount ||
              selectedSession.players_count
          );
          $("#newSessionDuration").val(
            selectedSession.duration_minutes ||
              selectedSession.Duration_minutes ||
              selectedSession.duration ||
              selectedSession.Duration
          );

          // Handle any additional fields related to session data
          if (selectedSession.data || selectedSession.Data) {
            const dataField = selectedSession.data || selectedSession.Data;
            $("#newSessionData").val(dataField);
          }

          console.log("Form pre-filled with session data");
        } else {
          console.warn("Session not found in sessionsDB:", sessionId);
        }
      });

    // Set up form submission handler
    $(document)
      .off("submit", "#edit-session-form")
      .on("submit", "#edit-session-form", function (e) {
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
          url: "https://localhost:7081/users/editsession",
          type: "PUT",
          data: JSON.stringify({
            boardGameId: $("#bgSelection-editSession").val(),
            sessionId: $("#sessionSelection-edit").val(),
            newDate: $("#newSessionDate").val(),
            newPlayersCount: $("#newPlayersCount").val(),
            newDuration_minutes: $("#newSessionDuration").val(),
          }),
          contentType: "application/json",
          xhrFields: { withCredentials: true },
          success: function (response) {
            console.log("Session updated:", response);
            alert("Session updated successfully!");
          },
          error: function (err) {
            console.error("Error:", err);
            alert("Failed to edit session. Please try again.");
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

        // Initialize specific functionality based on which template was loaded
        if (
          templateId === "log-session-template" ||
          templateId === "edit-session-template"
        ) {
          loadBgDetails();
        }

        // Set up all form handlers
        this.setupAllForms();
      });
    },

    // Set up all form handlers
    setupAllForms: function () {
      setupLogSessionForm();
      setupEditSessionForm();
      setupEditProfileForm();

      // Additional forms can be set up here
    },
  };
})();

// Initialize the form handler when the document is ready
$(function () {
  FormHandler.init();
});
