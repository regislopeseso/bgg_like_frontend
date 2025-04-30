//! This is the version that is working for log session only without edit session implementation

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

  function loadBgDetails() {
    // First destroy any existing select2 instance to prevent duplicates
    if ($("#bgSelection").hasClass("select2-hidden-accessible")) {
      $("#bgSelection").select2("destroy");
    }

    // Initialize select2
    $("#bgSelection").select2({
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
    });
  }

  let currentAngle = 0;
  let isBackVisible = false;
  function rotateTo(templateId) {
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

    // inject the new HTML
    $(target).html($(`#${templateId}`).html());

    // rotate another 180deg
    currentAngle += 180;
    $(".flip-card-inner").css("transform", `rotateY(${currentAngle}deg)`);

    // Listen for the end of the transition
    const transitionEndHandler = function () {
      // Remove the event listener to prevent multiple triggers
      $(".flip-card-inner").off("transitionend", transitionEndHandler);

      // Reset the rotating flag
      isRotating = false;

      // Set up event handlers for any forms that were just added to the DOM
      setupFormHandlers();

      // Initialize select2 if this is the log session template
      if (templateId === "log-session-template") {
        loadBgDetails();
      }
    };

    // Add the transition end event listener
    $(".flip-card-inner").on("transitionend", transitionEndHandler);

    // As a fallback, also clear the flag after a set time
    // This helps if the transitionend event somehow doesn't fire
    setTimeout(() => {
      isRotating = false;
    }, 1000); // Assuming transition takes less than 1 second

    // flip our flag
    isBackVisible = !isBackVisible;
  }

  function setupFormHandlers() {
    // Set up edit profile form handler if it exists
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

    // Set up log session form handler if it exists in the DOM
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

  function loadEvents() {
    // Add CSS transition to the flip card for smooth animation
    $(".flip-card-inner").css("transition", "transform 0.6s");

    // Debounce click events on menu items
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
        rotateTo(button.template);
      });
    });
  }

  function Build() {
    loadEvents();
  }

  Build();
});
