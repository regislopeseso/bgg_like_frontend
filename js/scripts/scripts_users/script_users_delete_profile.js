$(function () {
  function redirectIndexPage() {
    window.location.href = "/index.html";
  }

  function sweetAlertSuccess(text) {
    Swal.fire({
      position: "top-end",
      confirmButtonText: "OK!",
      icon: "success",
      theme: "bulma",
      title: text,
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      redirectIndexPage();
    });
  }

  function sweetAlertError(title_text) {
    let timerInterval;
    let seconds = 5;

    return Swal.fire({
      theme: "bulma",
      position: "center",
      title: title_text,
      icon: "error",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  function forceLogOut(text) {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/signout",
      data: $(this).serialize(),
      xhrFields: {
        withCredentials: true,
      },
      success: () => {
        sweetAlertError(text + "Session expired!").then(() => {
          redirectIndexPage();
        });
      },
      error: (text) => {
        sweetAlertError(text + "Session expired!").then(() => {
          redirectIndexPage();
        });
      },
    });
  }

  function loadEvents() {
    $("#request-delete-profile").on("click", function (e) {
      e.preventDefault();
      $("#request-delete-profile").addClass("d-none");

      $("#user-password-confirmation").removeClass("d-none");

      $("#delete-profile-input").trigger("focus");
    });

    const openEye = "/images/icons/eye_show.svg";
    const closeEye = "/images/icons/eye_hide.svg";

    let deletePasswordEyeState = 0;
    $("#toggle-delete-profile-img").on("click", function (e) {
      e.preventDefault();

      deletePasswordEyeState = deletePasswordEyeState === 0 ? 1 : 0;

      if (deletePasswordEyeState === 1) {
        $("#toggle-delete-profile-img").attr("src", closeEye);
        $("#delete-profile-input").attr("type", "text");
        $("#toggle-delete-profile-img").attr("title", "Hide password");
      }
      if (deletePasswordEyeState === 0) {
        $("#toggle-delete-profile-img").attr("src", openEye);
        $("#delete-profile-input").attr("type", "password");
        $("#toggle-delete-profile-img").attr("title", "Show password");
      }
    });
  }

  function setUpDeleteProfileForm() {
    $(document)
      .off("submit", "#delete-profile-form")
      .on("submit", "#delete-profile-form", function (e) {
        e.preventDefault();
        const requestedPassword = $("#delete-profile-input").val();

        $.ajax({
          type: "DELETE",
          url: `https://localhost:7081/users/deleteprofile`,
          data: JSON.stringify({
            Password: requestedPassword,
          }),
          contentType: "application/json",
          xhrFields: { withCredentials: true },
          success: function (resp) {
            console.log(resp);
            if (resp.content === null) {
              sweetAlertError(resp.message);
            } else if (resp.content.remainingPasswordAttempts === null) {
              sweetAlertSuccess(resp.message);
            } else {
              if (
                resp.content.remainingPasswordAttempts > 0 &&
                resp.content.remainingPasswordAttempts < 3
              ) {
                sweetAlertError(resp.message);
              }
              if (resp.content.remainingPasswordAttempts === 0) {
                forceLogOut(resp.message);
              }
            }
          },
          error: function (err) {
            sweetAlertError(err);
            $("confirm-delete-profile").trigger("focus");
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
