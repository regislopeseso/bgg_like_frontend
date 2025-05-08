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

  function Build() {
    loadUserDetails();
    loadEvents();
  }

  Build();
});
