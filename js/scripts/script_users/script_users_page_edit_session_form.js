const FormHandler_EditSession = (function () {
  // Private variables
  let sessionsDB = []; // Store sessions data globally

  // Format date from YYYY-MM-DD to DD/MM/YYYY for display
  function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }

  // Initialize Select2 dropdown for board games
  function loadBgDetails() {
    // First destroy any existing select2 instance to prevent duplicates
    if ($("#bgSelection-editSession").hasClass("select2-hidden-accessible")) {
      $("#bgSelection-editSession").select2("destroy");
    }

    // Initialize select2 for EDIT SESSION boardgame selection
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

  function loadSessionDetails() {
    if ($("#sessionSelection-edit").hasClass("select2-hidden-accessible")) {
      $("#sessionSelection-edit").select2("destroy");
    }

    // Initialize select2 for session selection
    $("#sessionSelection-edit").select2({
      theme: "classic",
      width: "100%",
      placeholder: "Pick a session",
      allowClear: true,
    });
  }

  function checkFormFilling() {
    const isBGSelected =
      $("#bgSelection-editSession").val() !== null &&
      $("#bgSelection-editSession").val() !== "";

    if (isBGSelected === true) {
      $("#edit-session-form .required:visible:enabled").each(function () {
        $(this).removeClass("current-data").addClass("new-data");
      });
    }

    const isSessionSelected =
      $("#sessionSelection-edit").val() !== null &&
      $("#sessionSelection-edit").val() !== "";

    let areFieldsFilled = true;

    $("#edit-session-form .required:visible:enabled").each(function () {
      if ($(this).val().trim() === "") {
        areFieldsFilled = false;
      }
    });

    $("#confirm-editSession").prop(
      "disabled",
      !(isBGSelected && isSessionSelected && areFieldsFilled)
    );
  }

  function forceClearForm() {
    // Block form submission button
    $("#confirm-editSession").prop("disabled", true);

    //Clear form
    $("#currentSessionDate").val(null);
    $("#newSessionDate").val(null);
    $("#currentPlayersCount").val(null);
    $("#newPlayersCount").val(null);
    $("#currentSessionDuration").val(null);
    $("#newSessionDuration").val(null);

    //Clear session selection
    $("#sessionSelection-edit").html("").trigger("change");
    // Replace second select2 label removing its sessions counter
    $("#edit-session-label").html(`<span>S</span>elect a Session`);
    // Destroys select 2 to display just a blocked select
    if ($("#sessionSelection-edit").hasClass("select2-hidden-accessible")) {
      $("#sessionSelection-edit").select2("destroy");
    }
    $("#sessionSelection-edit").addClass("current-data");

    // Clear board game selection
    $("#bgSelection-editSession").html("").trigger("change");
  }

  // Set up handlers for the >EDIT SESSION< form
  function setupEditSessionForm() {
    // Set up board game selection change handler
    $(document)
      .off("select2:select", "#bgSelection-editSession")
      .on("select2:select", "#bgSelection-editSession", function () {
        // Get selected boardGameId
        const boardGameId = $(this).val();

        if (!boardGameId) {
          // Clear the second select if nothing is selected
          $("#sessionSelection-edit").empty();

          // Refresh select2
          if (
            $("#sessionSelection-edit").hasClass("select2-hidden-accessible")
          ) {
            $("#sessionSelection-edit").select2("destroy");
          }

          return;
        }

        $("#sessionSelection-edit").removeClass("current-data");
        loadSessionDetails();

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

              $("#edit-session-label").empty();
              $("#edit-session-label").append(
                `<span>S</span>elect a Session <span>(${sessionsDB.length})</span>`
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

                $("#sessionSelection-edit").append(
                  new Option(optionText, optionValue)
                );
              });

              // Add an empty default option with the placeholder text
              $("#sessionSelection-edit").append(
                new Option("Select a session", "", true, true)
              );

              // Refresh select2 without triggering change event to avoid auto-selection
              if (
                $("#sessionSelection-edit").hasClass(
                  "select2-hidden-accessible"
                )
              ) {
                $("#sessionSelection-edit").select2("destroy");
              }
              $("#sessionSelection-edit").select2({
                theme: "classic",
                width: "100%",
                placeholder: "Pick a session",
                templateSelection: (data) => {
                  if (!data.id) return data.text;
                  return $("<strong>").text(data.text);
                },
              });
            } else {
              // Add empty option with "No sessions found" text
              $("#sessionSelection-edit")
                .empty()
                .append(new Option("No sessions found", "", true, true));

              // Refresh select2
              if (
                $("#sessionSelection-edit").hasClass(
                  "select2-hidden-accessible"
                )
              ) {
                $("#sessionSelection-edit").select2("destroy");
              }
              $("#sessionSelection-edit").select2({
                theme: "classic",
                width: "100%",
                placeholder: "Select a session",
              });
            }
          },
          error: function (xhr, status, error) {
            console.error("Error fetching sessions:", error);
            console.log("Status:", status);
            console.log("Response:", xhr.responseText);
            alert("Failed to fetch sessions. Try again later.");
          },
        });
      });

    // Set up session selection change handler - using select2:select to only trigger when user selects
    $(document)
      .off("select2:select", "#sessionSelection-edit")
      .on("select2:select", "#sessionSelection-edit", function () {
        const sessionId = $(this).val();

        if (!sessionId) {
          // Clear form fields
          $("#newSessionDate").val("");
          $("#newPlayersCount").val("");
          $("#newSessionDuration").val("");
          return;
        }

        // Find selected session from our cached data
        const selectedSession = sessionsDB.find(
          (session) => session.id == sessionId || session.Id == sessionId
        );

        if (selectedSession) {
          // Handle case inconsistency in property names
          const date = selectedSession.date || selectedSession.Date || "";
          const playersCount =
            selectedSession.playersCount || selectedSession.PlayersCount || "";
          const duration =
            selectedSession.duration_minutes ||
            selectedSession.Duration_minutes ||
            "";

          // Pre-fill form fields with session data
          $("#currentSessionDate").val(formatDateToDDMMYYYY(date));
          $("#currentPlayersCount").val(playersCount);
          $("#currentSessionDuration").val(duration + " minutes");
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

        // Get form values
        const selectedBoardGameId = $("#bgSelection-editSession").val();
        const selectedSessionId = $("#sessionSelection-edit").val();
        const updatedDate = $("#newSessionDate").val();
        const updatedPlayersCount = $("#newPlayersCount").val();
        const updatedDuration = $("#newSessionDuration").val();

        $.ajax({
          url: "https://localhost:7081/users/editsession",
          type: "PUT",
          data: JSON.stringify({
            boardGameId: selectedBoardGameId,
            sessionId: selectedSessionId,
            newDate: updatedDate,
            newPlayersCount: updatedPlayersCount,
            newDuration_minutes: updatedDuration,
          }),
          contentType: "application/json",
          xhrFields: { withCredentials: true },
          success: function (resp) {
            alert(resp.message);
            // Clear form fields after successful update
            forceClearForm();
          },
          error: function (xhr, status, error) {
            console.error("Error updating session:", error);
            console.log("Status:", status);
            console.log("Response:", xhr.responseText);
            alert("Failed to edit session. Please try again.");
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
    $("#bgSelection-editSession").on("select2:select", checkFormFilling);
    $("#bgSelection-editSession").on("select2:clear", () => {
      checkFormFilling();
      forceClearForm();
    });
    // React to session selection
    $("#sessionSelection-edit").on("select2:select", checkFormFilling);
    $("#sessionSelection-edit").on("select2:clear", checkFormFilling);
    // React to typing in any input
    $("#edit-session-form input").on("input", checkFormFilling);
    // React to clicking on the clear button:
    $("#reset-editSession").on("click", () => {
      forceClearForm();
    });
  }

  // Public API
  return {
    init: function () {
      // Listen for content changes from the Flipper module
      $(document).on("flipper:contentChanged", (event, templateId) => {
        // Initialize specific functionality based on which template was loaded
        if (templateId === "edit-session-template") {
          $("#userOption-editSession")
            .addClass("selectedUserMenuOption")
            .prop("disabled", true);

          loadBgDetails();
          setupEditSessionForm();
        } else {
          $("#userOption-editSession")
            .removeClass("selectedUserMenuOption")
            .prop("disabled", false);
        }
      });

      // Also set up handlers on document ready to handle the initial load
      if ($("#edit-session-template").length) {
        loadBgDetails();
        setupEditSessionForm();
      }
    },

    // Set up all form handlers
    setupAllForms: function () {
      setupEditSessionForm();
    },
  };
})();

// Initialize the form handler when the document is ready
$(function () {
  FormHandler_EditSession.init();
});
