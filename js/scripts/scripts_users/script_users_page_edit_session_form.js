const FormHandler_EditSession = (function () {
  // Private variables
  let sessionsDB = []; // Store sessions data globally

  let oldDate = "";
  let oldPlayersCount = "";
  let oldSessionDuration = "";

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

    $.ajax({
      url: `https://localhost:7081/users/listplayedboardgames`,
      type: "GET",
      xhrFields: { withCredentials: true },
      success: function (response) {
        // Clear current options
        $("#bgSelection-editSession").empty();

        // Check if any board games are returned
        if (response.content != null) {
          playedboardgames = response.content;

          $("#list-played-bg-label").empty();

          $("#list-played-bg-label").append(
            `<span>S</span>elect a Board Games <span>(${playedboardgames.length})</span>`
          );

          // Add options dynamically
          let counter = 1;
          playedboardgames.forEach((boardgame) => {
            counter++;

            // Create option with formatted date (if available) or fall back to session ID
            const optionText = boardgame.boardGameName;
            const optionValue = boardgame.boardGameId;

            $("#bgSelection-editSession").append(
              new Option(optionText, optionValue)
            );
          });

          // Add an empty default option with the placeholder text
          $("#bgSelection-editSession").append(
            new Option("Select a board game", "", true, true)
          );

          // Refresh select2 without triggering change event to avoid auto-selection
          if (
            $("#bgSelection-editSession").hasClass("select2-hidden-accessible")
          ) {
            $("#bgSelection-editSession").select2("destroy");
          }
          $("#bgSelection-editSession").select2({
            theme: "classic",
            width: "100%",
            placeholder: "Pick a board game",
            templateSelection: (data) => {
              if (!data.id) return data.text;
              return $("<strong>").text(data.text);
            },
          });

          $("#bgSelection-editSession").select2("open");
        } else {
          $("#edit-sessions-template-title").append(
            `<p><span style="color: var(--yellowish)">No sessions found</span></p>`
          );
          // Add empty option with "No sessions found" text
          $("#bgSelection-editSession").empty().addClass("current-data");

          // Refresh select2
          if (
            $("#bgSelection-editSession").hasClass("select2-hidden-accessible")
          ) {
            $("#bgSelection-editSession").select2("destroy");
          }
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching sessions:", error);
        console.log("Status:", status);
        console.log("Response:", xhr.responseText);
        sweetAlertError("Failed to fetch boardgames.");
      },
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

    $("#delete-Session, #reset-editSession, #confirm-editSession").prop(
      "disabled",
      !(isBGSelected && isSessionSelected && areFieldsFilled)
    );
  }
  function monitorFormFilling() {
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
  function forceClearForm() {
    // Block form submission button
    $("#confirm-editSession").prop("disabled", true);

    //Clear form
    $("#currentSessionDate").val(null);
    $("#newSessionDate").val(null).addClass("current-data");
    $("#currentPlayersCount").val(null);
    $("#newPlayersCount").val(null).addClass("current-data");
    $("#currentSessionDuration").val(null);
    $("#newSessionDuration").val(null).addClass("current-data");

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
    loadBgDetails();
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

  function loadBgSelector() {
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

        $("#sessionSelection-edit").select2("open");

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

              $("#sessionSelection-edit").select2("open");
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
            sweetAlertError("Failed to fetch sessions.");
          },
        });
      });
  }
  function loadSessionSelector() {
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
          oldDate = date;

          const playersCount =
            selectedSession.playersCount || selectedSession.PlayersCount || "";
          oldPlayersCount = playersCount;

          const duration =
            selectedSession.duration_minutes ||
            selectedSession.Duration_minutes ||
            "";
          oldSessionDuration = duration;

          // Pre-fill form fields with session data
          $("#currentSessionDate").val(formatDateToDDMMYYYY(date));
          $("#currentPlayersCount").val(playersCount);
          $("#currentSessionDuration").val(duration + " minutes");

          $("#newSessionDate").val(date);
          $("#newPlayersCount").val(playersCount);
          $("#newSessionDuration").val(duration);

          $("#newSessionDate").trigger("focus");

          $("#delete-Session, #reset-editSession, #confirm-editSession").prop(
            "disabled",
            false
          );

          $("#delete-Session").on("click", function (e) {
            e.preventDefault();

            setUpDeleteSession(sessionId);
          });
        } else {
          console.warn("Session not found in sessionsDB:", sessionId);
        }
      });
  }

  // Set up handlers for the >EDIT SESSION< form
  function setupEditSessionForm() {
    loadBgSelector();
    loadSessionSelector();

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

        const buttons = $(this).find("button[type='button']");

        // Get form values
        const selectedBoardGameId = $("#bgSelection-editSession").val();
        const selectedSessionId = $("#sessionSelection-edit").val();
        const updatedDate = $("#newSessionDate").val();
        const updatedPlayersCount = $("#newPlayersCount").val();
        const updatedDuration = $("#newSessionDuration").val();

        if (
          updatedDate === oldDate &&
          updatedPlayersCount == String(oldPlayersCount) &&
          updatedDuration == String(oldSessionDuration)
        ) {
          sweetAlertSuccess("Session updated =)");
          forceClearForm();
          submitBtn.attr("disabled", true).text(originalBtnText);
          buttons.attr("disabled", true);
        } else {
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
              sweetAlertSuccess("Session updated!", resp.message);

              // Clear form fields after successful update
              forceClearForm();
            },
            error: function (xhr, status, error) {
              console.error("Error updating session:", error);
              console.log("Status:", status);
              console.log("Response:", xhr.responseText);
              sweetAlertError("Failed to edit session.");
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
        }
      });

    monitorFormFilling();
  }
  // Set up handlers for the >DELETE SESSION< form
  function setUpDeleteSession(sessionId) {
    $.ajax({
      url: `https://localhost:7081/users/deletesession?SessionId=${sessionId}`,
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
        } else {
          $("#userOption-editSession")
            .removeClass("selectedUserMenuOption")
            .prop("disabled", false);
        }

        // Set up all form handlers
        this.setupAllForms();
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
