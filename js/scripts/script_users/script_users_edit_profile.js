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

  const today = new Date();

  const twelveYearsAgo = new Date(today);
  twelveYearsAgo.setFullYear(twelveYearsAgo.getFullYear() - 12);

  const hundredYearsAgo = new Date(today);
  hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);

  const maxDate = twelveYearsAgo.toISOString().split("T")[0];
  const minDate = hundredYearsAgo.toISOString().split("T")[0];

  function loadUserDetails() {
    $.ajax({
      url: "https://localhost:7081/users/getprofiledetails",
      type: "GET",
      xhrFields: { withCredentials: true },
      success: function (response) {
        const userDB = response.content;

        $("#user-name").val(`${userDB.name}`);
        $("#user-email").val(`${userDB.email}`);
        $("#user-birthdate").val(`${userDB.birthDate}`);
      },
      error: function (xhr, status, error) {
        alert("Failed to fetch user details. Try again later.");
      },
    });
  }

  function loadEvents() {
    $("#change-name").on("click", function (e) {
      e.preventDefault();

      $("#user-name").val(null);

      $("#user-name").removeClass("current-data").addClass("new-data");

      $("#user-name").prop("disabled", false).trigger("focus");
    });

    $("#change-email").on("click", function (e) {
      e.preventDefault();

      $("#user-email").val(null);

      $("#user-email").removeClass("current-data").addClass("new-data");

      $("#user-email").prop("disabled", false).trigger("focus");
    });

    $("#change-birthdate").on("click", function (e) {
      e.preventDefault();

      $("#user-birthdate").val(null);

      $("#user-birthdate").removeClass("current-data").addClass("new-data");

      $("#user-birthdate")
        .prop("disabled", false)
        .attr("min", minDate)
        .attr("max", maxDate)
        .trigger("focus");
    });

    $("#toggle-current-password").on("input", function (e) {
      $("#new-password")
        .attr("disabled", false)
        .removeClass("current-data")
        .addClass("new-data");
    });

    const openEye = "images/icons/eye_show.svg";
    const closeEye = "images/icons/eye_hide.svg";

    let currentPasswordEyeState = 0;
    $("#toggle-current-password").on("click", function (e) {
      e.preventDefault();

      currentPasswordEyeState = currentPasswordEyeState === 0 ? 1 : 0;

      if (currentPasswordEyeState === 1) {
        $("#toggle-current-password").attr("src", closeEye);
        $("#current-password").attr("type", "text");
        $("#toggle-current-password").attr("title", "Hide password");
      }
      if (currentPasswordEyeState === 0) {
        $("#toggle-current-password").attr("src", openEye);
        $("#current-password").attr("type", "password");
        $("#toggle-current-password").attr("title", "Show password");
      }
    });

    let newPasswordEyeState = 0;
    $("#toggle-new-password").on("click", function (e) {
      e.preventDefault();

      newPasswordEyeState = newPasswordEyeState === 0 ? 1 : 0;

      if (newPasswordEyeState === 1) {
        $("#toggle-new-password").attr("src", closeEye);
        $("#new-password").attr("type", "text");
        $("#toggle-new-password").attr("title", "Hide password");
      }
      if (newPasswordEyeState === 0) {
        $("#toggle-new-password").attr("src", openEye);
        $("#new-password").attr("type", "password");
        $("#toggle-new-password").attr("title", "Show password");
      }
    });

    let confirmPasswordEyeState = 0;
    $("#toggle-confirm-password").on("click", function (e) {
      e.preventDefault();

      confirmPasswordEyeState = confirmPasswordEyeState === 0 ? 1 : 0;

      if (confirmPasswordEyeState === 1) {
        $("#toggle-confirm-password").attr("src", closeEye);
        $("#confirm-password").attr("type", "text");
        $("#toggle-confirm-password").attr("title", "Hide password");
      }
      if (confirmPasswordEyeState === 0) {
        $("#toggle-confirm-password").attr("src", openEye);
        $("#confirm-password").attr("type", "password");
        $("#toggle-confirm-password").attr("title", "Show password");
      }
    });
  }

  function setUpEditProfileForm() {
    $(document)
      .off("submit", "#edit-profile-form")
      .on("submit", "#edit-profile-form", function (e) {
        e.preventDefault();

        // Disable submit button to prevent double submissions
        const submitBtn = $(this).find("button[type='submit']");
        const originalBtnText = submitBtn.text();
        submitBtn.attr("disabled", true).text("Submitting...");

        // Get form values
        const newName = $("#user-name").val();
        const newEmail = $("#user-email").val();
        const newBirthDate = $("#user-birthdate").val();

        $.ajax({
          url: "https://localhost:7081/users/editprofile",
          type: "PUT",
          data: JSON.stringify({
            NewName: newName,
            NewEmail: newEmail,
            NewBirthDate: newBirthDate,
          }),
          contentType: "application/json",
          xhrFields: { withCredentials: true },
          success: function (resp) {
            alert(resp.message);
            window.location.href = "users_page.html";

            // Clear form fields after successful update
            // clearBgSelection();
            // clearSessionSelection();
            // forceClearForm();
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
          },
        });
      });
  }

  function setUpChangePasswordForm() {
    $(document)
      .off("submit", "#change-password-form")
      .on("submit", "#change-password-form", function (e) {
        e.preventDefault();

        // Disable submit button to prevent double submissions
        const submitBtn = $(this).find("button[type='submit']");
        const originalBtnText = submitBtn.text();
        submitBtn.attr("disabled", true).text("Submitting...");

        // Get form values
        const currentPassword = $("#current-password").val();
        const newPassword = $("#new-password").val();

        $.ajax({
          url: "https://localhost:7081/users/changepassword",
          type: "PUT",
          data: JSON.stringify({
            CurrentPassword: currentPassword,
            NewPassword: newPassword,
          }),
          contentType: "application/json",
          xhrFields: { withCredentials: true },
          success: function (resp) {
            alert(resp.message);
            window.location.href = "users_page.html";
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
          },
        });
      });
  }

  function Build() {
    loadEvents();
    setUpEditProfileForm();
    setUpChangePasswordForm();
  }

  Build();
});
