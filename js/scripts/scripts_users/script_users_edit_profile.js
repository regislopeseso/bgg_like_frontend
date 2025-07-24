$(function () {
  const today = new Date();

  const twelveYearsAgo = new Date(today);
  twelveYearsAgo.setFullYear(twelveYearsAgo.getFullYear() - 12);

  const hundredYearsAgo = new Date(today);
  hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);

  const maxDate = twelveYearsAgo.toISOString().split("T")[0];
  const minDate = hundredYearsAgo.toISOString().split("T")[0];

  function sweetAlertSuccess(text) {
    Swal.fire({
      position: "center",
      confirmButtonText: "OK!",
      icon: "success",
      theme: "bulma",
      title: text,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  function sweetAlertError(text) {
    Swal.fire({
      position: "center",
      confirmButtonText: "OK!",
      icon: "error",
      theme: "bulma",
      title: text,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  function loadUserDetails() {
    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/getprofiledetails",
      xhrFields: { withCredentials: true },
      success: function (response) {
        const userDB = response.content;

        $("#user-name")
          .val(`${userDB.name}`)
          .trigger("focus")
          .trigger("select");

        $("#user-email").val(`${userDB.email}`);
        $("#user-birthdate").val(`${userDB.birthDate}`);
      },
      error: function (xhr, status, error) {
        alert("Failed to fetch user details. Try again later.");
      },
    });
  }

  function checkPasswords() {
    const currentPasswordContent = $("#current-password").val();
    const newPasswordContent = $("#new-password").val();
    const confirmPasswordContent = $("#confirm-password").val();

    if (
      currentPasswordContent.length > 5 &&
      newPasswordContent.length > 5 &&
      confirmPasswordContent.length > 5 &&
      newPasswordContent === confirmPasswordContent
    ) {
      $("#confirm-password-change").attr("disabled", false);

      $("#change-password-block")
        .removeClass("red-alert-one")
        .removeClass("red-alert-two")
        .addClass("blue-alert");
    } else {
      $("#confirm-password-change").attr("disabled", true);
    }
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

    $("#current-password").on("input", function (e) {
      if ($("#current-password").val().length > 5) {
        $("#new-password")
          .attr("disabled", false)
          .removeClass("current-data")
          .addClass("new-data");

        $("#toggle-new-password").css({
          "visibility": "visible",
          "opacity": "1",
        });
      } else {
        $("#new-password, #confirm-password")
          .val("")
          .attr("disabled", true)
          .addClass("current-data")
          .removeClass("new-data");

        $("#toggle-new-password, #toggle-confirm-password").css({
          "visibility": "hidden",
          "opacity": "0",
        });
      }
    });

    const openEye = "/images/icons/eye_show.svg";
    const closeEye = "/images/icons/eye_hide.svg";

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

    $("#new-password").on("input", function (e) {
      if ($("#new-password").val().length > 5) {
        $("#confirm-password")
          .attr("disabled", false)
          .removeClass("current-data")
          .addClass("new-data");

        $("#toggle-confirm-password").css({
          "visibility": "visible",
          "opacity": "1",
        });
      } else {
        $("#confirm-password")
          .val("")
          .attr("disabled", true)
          .addClass("current-data")
          .removeClass("new-data");

        $("#toggle-confirm-password").css({
          "visibility": "hidden",
          "opacity": "0",
        });
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

    $("#new-password, #confirm-password").on("input", () => {
      const newPasswordcontent = $("#new-password").val();
      const confirmPasswordcontent = $("#confirm-password").val();

      if (
        newPasswordcontent !== confirmPasswordcontent &&
        confirmPasswordcontent.length > 0
      ) {
        $("#confirm-password").attr({
          "data-bs-toggle": "popover",
          "data-bs-placement": "bottom",
          "data-bs-content": "Passwords do not match",
        });

        if (!bootstrap.Popover.getInstance($("#confirm-password")[0])) {
          new bootstrap.Popover($("#confirm-password")[0]).show();
        }
      }
      if (newPasswordcontent === confirmPasswordcontent) {
        bootstrap.Popover.getInstance($("#confirm-password"))?.dispose();
      }
    });

    // Bind to input events on all three fields
    $("#current-password, #new-password, #confirm-password").on("input", () => {
      checkPasswords();

      if ($("#change-password-block").hasClass("red-alert-one")) {
        $("#change-password-block")
          .removeClass("red-alert-one")
          .addClass("red-alert-two");
      } else {
        $("#change-password-block")
          .removeClass("red-alert-two")
          .addClass("red-alert-one");
      }
    });

    // Add Escape key listener for redirection
    $(document).on("keydown", function (e) {
      if (e.key === "Escape") {
        window.location.href = "/index.html";
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
            sweetAlertSuccess(resp.message);
          },
          error: function (resp) {
            sweetAlertError(resp.message);
          },
          complete: () => {
            $("#user-name").removeClass("new-data").addClass("current-data");

            $("#user-email").removeClass("new-data").addClass("current-data");

            $("#user-birthdate")
              .removeClass("new-data")
              .addClass("current-data");

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
            sweetAlertSuccess(resp.message);
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
            // Clear the password fields
            $("#current-password").val(null);
            $("#new-password")
              .removeClass("new-data")
              .addClass("current-data")
              .val(null);
            $("#confirm-password")
              .removeClass("new-data")
              .addClass("current-data")
              .val(null);
          },
        });
      });
  }

  function Build() {
    loadEvents();
    loadUserDetails();
    setUpEditProfileForm();
    setUpChangePasswordForm();
  }

  Build();
});
