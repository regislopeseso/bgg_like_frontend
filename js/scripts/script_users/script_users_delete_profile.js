$(function () {
  fetch("https://localhost:7081/users/validatestatus", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      $("body").load("load");

      if (data.content.isUserLoggedIn == true) {
        // If the user is logged in, proceed to load the page normally
        console.log("User is authenticated. Welcome!");
      } else {
        // If the user is not authenticated, redirect them to the authentication page
        window.location.href = "users_authentication.html";
      }
    });

  function forceLogOut() {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/signout",
      data: $(this).serialize(),
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        alert("Session expired!", resp.message);
        window.location.href = "index.html";
      },
      error: (err) => {
        alert(err);
      },
    });
  }

  function loadEvents() {
    $("#request-delete-profile").on("click", function (e) {
      e.preventDefault();
      $("#request-delete-profile").addClass("d-none");
      $("#user-password-confirmation").removeClass("d-none");
    });

    $("#user-password").on("input", function () {
      const requestedPassword = $(this).val();
      let remainingAttempts = 3;

      $("#confirm-delete-profile").prop("disabled", false);
    });
  }

  function setUpDeleteProfileForm() {
    $(document)
      .off("submit", "#delete-profile-form")
      .on("submit", "#delete-profile-form", function (e) {
        e.preventDefault();
        const requestedPassword = $(this).val();

        // Disable submit button to prevent double submissions
        const submitBtn = $(this).find("button[type='submit']");
        const originalBtnText = submitBtn.text();
        submitBtn.attr("disabled", true).text("Submitting...");

        $.ajax({
          type: "DELETE",
          url: `https://localhost:7081/users/deleteprofile`,
          data: JSON.stringify({
            Password: requestedPassword,
          }),
          contentType: "application/json",
          xhrFields: { withCredentials: true },
          success: function (resp) {
            alert("Profile deleted with success!", resp.message);

            forceLogOut();
          },
          error: function (err) {
            alert(err);
          },
        });
      });
  }

  function Build() {
    loadEvents();
    setUpDeleteProfileForm();
  }

  Build();
});
