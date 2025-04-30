$(document).ready(function () {
  // Track if a rotation animation is in progress
  let isRotating = false;
  // Track if a form submission is in progress
  let isSubmitting = false;

  fetch("https://localhost:7081/users/validatestatus", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.content.isUserLoggedIn == true) {
        // If the user is logged in, proceed to load the page normally
        console.log("User is authenticated. Welcome!");
      } else {
        // If the user is not authenticated, redirect them to the authentication page
        window.location.href = "users_authentication.html";
      }
    });

  function loadBgDetails(selectElement) {
    console.log("Loading board game details for", selectElement);

    // First destroy any existing select2 instance to prevent duplicates
    if ($(selectElement).hasClass("select2-hidden-accessible")) {
      console.log("Destroying existing select2 instance");
      $(selectElement).select2("destroy");
    }

    // Initialize select2
    console.log("Initializing select2 for board games");
    $(selectElement).select2({
      ajax: {
        url: "https://localhost:7081/explore/findboardgame",
        dataType: "json",
        delay: 250,
        data: function (params) {
          return {
            boardGameName: params.term || "",
          };
        },
        processResults: function (data) {
          console.log("Board games data received:", data);
          // Check if data.content exists and is an array
          if (!data.content || !Array.isArray(data.content)) {
            console.error("Invalid data format received:", data);
            return { results: [] };
          }

          return {
            results: data.content.map(function (item) {
              return {
                id: item.boardGameId,
                text: item.boardGameName,
                boardGameId: item.boardGameId,
                boardGameName: item.boardGameName,
              };
            }),
          };
        },
        cache: true,
      },
      placeholder: "Search for a board game",
      minimumInputLength: 3,
      allowClear: true,
      theme: "classic",
      width: "100%",
    });

    console.log("Select2 initialized for", selectElement);
  }

  function loadSessionsForBoardGame(boardGameId, selectElement) {
    console.log("Loading sessions for board game ID:", boardGameId);

    // First destroy any existing select2 instance to prevent duplicates
    if ($(selectElement).hasClass("select2-hidden-accessible")) {
      console.log("Destroying existing sessions select2 instance");
      $(selectElement).select2("destroy");
    }

    $(selectElement).select2({
      ajax: {
        url: `https://localhost:7081/users/getsessions?boardgameid=${boardGameId}`,
        dataType: "json",
        processResults: function (data) {
          console.log("Sessions data received:", data);
          // Check if data.content exists and is an array
          if (!data.content || !Array.isArray(data.content)) {
            console.error("Invalid sessions data format received:", data);
            return { results: [] };
          }

          return {
            results: data.content.map(function (item) {
              return {
                id: item.sessionId,
                text: new Date(item.date).toLocaleDateString(),
                sessionData: item,
              };
            }),
          };
        },
        cache: true,
      },
      placeholder: "Select a session",
      allowClear: true,
      theme: "classic",
      width: "100%",
    });

    console.log("Sessions select2 initialized for", selectElement);
  }

  let currentAngle = 0;
  let isBackVisible = false;
  function rotateTo(templateId) {
    console.log("Rotating to template:", templateId);

    // If rotation is already in progress, ignore this request
    if (isRotating) {
      console.log("Rotation already in progress, ignoring request");
      return;
    }

    // If a form submission is in progress, confirm with user before proceeding
    if (isSubmitting) {
      if (
        !confirm(
          "You have a form submission in progress. Continuing will cancel it. Proceed?"
        )
      ) {
        return;
      }
      isSubmitting = false;
    }

    // Set the rotating flag to true
    isRotating = true;

    // pick the hidden face
    const target = isBackVisible ? "#flip-front-content" : "#flip-back-content";
    console.log("Target container:", target);

    // inject the new HTML
    $(target).html($(`#${templateId}`).html());
    console.log("Template HTML injected into target");

    // rotate another 180deg
    currentAngle += 180;
    $(".flip-card-inner").css("transform", `rotateY(${currentAngle}deg)`);

    // Listen for the end of the transition
    const transitionEndHandler = function () {
      console.log("Transition ended");

      // Remove the event listener to prevent multiple triggers
      $(".flip-card-inner").off("transitionend", transitionEndHandler);

      // Reset the rotating flag
      isRotating = false;

      // Set up event handlers for any forms that were just added to the DOM
      setupFormHandlers();

      // Initialize select2 if this is the log session template
      if (templateId === "log-session-template") {
        console.log("Initializing log session form");
        loadBgDetails("#bgSelection");
      }

      // Initialize select2 if this is the edit session template
      if (templateId === "edit-session-template") {
        console.log("Initializing edit session form");
        setTimeout(function () {
          initializeEditSessionForm();
        }, 100); // Add a small delay to ensure DOM is fully updated
      }
    };

    // Add the transition end event listener
    $(".flip-card-inner").on("transitionend", transitionEndHandler);

    // As a fallback, also clear the flag after a set time
    // This helps if the transitionend event somehow doesn't fire
    setTimeout(() => {
      if (isRotating) {
        console.log("Fallback timeout triggered for transition end");
        isRotating = false;

        // Set up event handlers for any forms that were just added to the DOM
        setupFormHandlers();

        // Initialize select2 if this is the log session template
        if (templateId === "log-session-template") {
          loadBgDetails("#bgSelection");
        }

        // Initialize select2 if this is the edit session template
        if (templateId === "edit-session-template") {
          initializeEditSessionForm();
        }
      }
    }, 1000); // Assuming transition takes less than 1 second

    // flip our flag
    isBackVisible = !isBackVisible;
  }

  function initializeEditSessionForm() {
    console.log("Initializing edit session form");

    // Make sure the select elements exist in the DOM
    if ($("#edit-session-form #bgSelection").length === 0) {
      console.error(
        "Board game selection element not found in edit session form"
      );
      return;
    }

    // Check if select2 is available
    if (typeof $.fn.select2 !== "function") {
      console.error("Select2 library is not loaded!");
      return;
    }

    console.log("Attempting to initialize board game selection");
    // Initialize the board game selection dropdown
    loadBgDetails("#edit-session-form #bgSelection");

    console.log("Setting up change event for board game selection");
    // Set up event listener for when a board game is selected
    $("#edit-session-form #bgSelection")
      .off("change")
      .on("change", function () {
        const boardGameId = $(this).val();
        console.log("Board game selected with ID:", boardGameId);

        if (boardGameId) {
          loadSessionsForBoardGame(
            boardGameId,
            "#edit-session-form #sessionSelection"
          );
        } else {
          console.log("No board game ID selected");
        }
      });

    console.log("Setting up change event for session selection");
    // Set up event listener for when a session is selected
    $("#edit-session-form #sessionSelection")
      .off("change")
      .on("change", function () {
        const data = $(this).select2("data");
        console.log("Session selected, data:", data);

        if (data && data.length > 0 && data[0].sessionData) {
          const sessionData = data[0].sessionData;
          console.log("Session data:", sessionData);

          // Format date to YYYY-MM-DD for input[type=date]
          const date = new Date(sessionData.date);
          const formattedDate = date.toISOString().split("T")[0];
          console.log("Formatted date:", formattedDate);

          // Populate form fields with session data
          $("#edit-session-form #playedDate").val(formattedDate);
          $("#edit-session-form #playersCount").val(sessionData.playersCount);
          $("#edit-session-form #sessionDuration").val(
            sessionData.duration_minutes
          );
          console.log("Form fields populated with session data");
        } else {
          console.log("No session data available");
        }
      });

    console.log("Edit session form initialization complete");
  }

  function setupFormHandlers() {
    console.log("Setting up form handlers");

    // Set up log session form handler if it exists in the DOM
    if ($("#log-session-form").length > 0) {
      console.log("Setting up log session form handler");
      $(document)
        .off("submit", "#log-session-form")
        .on("submit", "#log-session-form", function (e) {
          e.preventDefault();

          // Prevent submission if already submitting
          if (isSubmitting) {
            console.log("Submission already in progress");
            return;
          }

          isSubmitting = true;
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
              if ($("#bgSelection").hasClass("select2-hidden-accessible")) {
                $("#bgSelection").val(null).trigger("change");
              }
            },
            error: (err) => {
              console.error("Error:", err);
              alert("Failed to log session. Please try again.");
            },
            complete: () => {
              // Re-enable button
              submitBtn.attr("disabled", false).text(originalBtnText);
              isSubmitting = false;
            },
          });
        });
    }

    // Set up edit session form handler
    if ($("#edit-session-form").length > 0) {
      console.log("Setting up edit session form handler");
      $(document)
        .off("submit", "#edit-session-form")
        .on("submit", "#edit-session-form", function (e) {
          e.preventDefault();

          // Prevent submission if already submitting
          if (isSubmitting) {
            console.log("Submission already in progress");
            return;
          }

          isSubmitting = true;
          console.log("#edit-session-form submitted");

          // Disable submit button to prevent double submissions
          const submitBtn = $(this).find("button[type='submit']");
          const originalBtnText = submitBtn.text();
          submitBtn.attr("disabled", true).text("Submitting...");

          // Get the session ID from the select
          const sessionId = $("#edit-session-form #sessionSelection").val();
          console.log("Selected session ID:", sessionId);

          if (!sessionId) {
            alert("Please select a session to edit");
            submitBtn.attr("disabled", false).text(originalBtnText);
            isSubmitting = false;
            return;
          }

          // Create formData object for the AJAX request
          const formData = $(this).serialize();
          console.log("Form data:", formData);

          $.ajax({
            type: "PUT",
            url: "https://localhost:7081/users/editsession",
            data: formData,
            xhrFields: {
              withCredentials: true,
            },
            success: (resp) => {
              console.log("Success:", resp);
              alert("Session updated successfully!");

              // Reset form
              $(this)[0].reset();
              if (
                $("#edit-session-form #bgSelection").hasClass(
                  "select2-hidden-accessible"
                )
              ) {
                $("#edit-session-form #bgSelection")
                  .val(null)
                  .trigger("change");
              }
              if (
                $("#edit-session-form #sessionSelection").hasClass(
                  "select2-hidden-accessible"
                )
              ) {
                $("#edit-session-form #sessionSelection")
                  .val(null)
                  .trigger("change");
              }
            },
            error: (err) => {
              console.error("Error:", err);
              alert("Failed to update session. Please try again.");
            },
            complete: () => {
              // Re-enable button
              submitBtn.attr("disabled", false).text(originalBtnText);
              isSubmitting = false;
            },
          });
        });
    }

    // Set up edit profile form handler if it exists
    if ($("#editProfile-form").length > 0) {
      console.log("Setting up edit profile form handler");
      $(document)
        .off("submit", "#editProfile-form")
        .on("submit", "#editProfile-form", function (e) {
          e.preventDefault();

          // Prevent submission if already submitting
          if (isSubmitting) {
            console.log("Submission already in progress");
            return;
          }

          isSubmitting = true;

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
              isSubmitting = false;
            },
          });
        });
    }

    console.log("Form handlers setup complete");
  }

  function loadEvents() {
    console.log("Loading events");

    // Add CSS transition to the flip card for smooth animation
    $(".flip-card-inner").css("transition", "transform 0.6s");

    // Set up click handlers for menu buttons
    const menuButtons = [
      { id: "#toggleUserDetails", template: "user-details-template" },
      { id: "#playGame", template: "play-template" },
      { id: "#logSession", template: "log-session-template" },
      { id: "#editSession", template: "edit-session-template" },
      { id: "#deleteSession", template: "delete-session-template" },
      { id: "#rateBg", template: "rate-bg-template" },
      { id: "#editRate", template: "edit-rate-template" },
      { id: "#newLifeCounter", template: "new-life-counter-template" },
    ];

    // Set up click handlers for menu buttons
    menuButtons.forEach((button) => {
      $(button.id).on("click", function (e) {
        e.preventDefault();
        console.log("Button clicked:", button.id);
        rotateTo(button.template);
      });
    });

    console.log("Events loaded");
  }

  function Build() {
    console.log("Building application");
    loadEvents();
    console.log("Application built");
  }

  // Special function to directly check if select2 is loaded
  function testSelect2() {
    console.log("Testing Select2 availability:");
    if (typeof $.fn.select2 === "function") {
      console.log("✅ Select2 is available");
    } else {
      console.error("❌ Select2 is NOT available");
    }

    console.log("jQuery version:", $.fn.jquery);
  }

  // Run tests
  testSelect2();

  // Build the application
  Build();
});
