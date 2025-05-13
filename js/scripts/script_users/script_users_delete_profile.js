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
      success: () => {
        alert("Session expired!");
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

      if (requestedPassword.length > 5) {
        $("#confirm-delete-profile").prop("disabled", false);
      } else {
        $("#confirm-delete-profile").prop("disabled", true);
      }
    });
  }

  function setUpDeleteProfileForm() {
    $(document)
      .off("submit", "#delete-profile-form")
      .on("submit", "#delete-profile-form", function (e) {
        e.preventDefault();
        const requestedPassword = $("#user-password").val();

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
            if (resp.content.remainingPasswordAttempts === null) {
              alert(resp.message);
              window.location.href = "index.html";
            } else {
              if (
                resp.content.remainingPasswordAttempts !== 0 &&
                resp.content.remainingPasswordAttempts < 3
              ) {
                alert(resp.message);
              }
              if (resp.content.remainingPasswordAttempts === 0) {
                alert(resp.message);
                forceLogOut();
              }
            }
          },
          error: function (err) {
            alert(err);
          },
          complete: () => {
            // Re-enable button
            submitBtn.attr("disabled", true).text(originalBtnText);
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
