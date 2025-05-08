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

      $("#user-name").prop("disabled", false).trigger("focus");
    });

    $("#change-email").on("click", function (e) {
      e.preventDefault();

      $("#user-email").val(null);

      $("#user-email").prop("disabled", false).trigger("focus");
    });

    $("#change-birthdate").on("click", function (e) {
      e.preventDefault();

      $("#user-birthdate").val(null);

      $("#user-birthdate")
        .prop("disabled", false)
        .attr("min", minDate)
        .attr("max", maxDate)
        .trigger("focus");
    });
    // $("#edit-profile-form").on("submit", () => {});
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

  function Build() {
    loadUserDetails();
    loadEvents();
    setUpEditProfileForm();
  }

  Build();
});
