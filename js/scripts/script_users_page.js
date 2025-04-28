$(document).ready(function () {
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

  $("#editProfile-form").on("submit", function (e) {
    e.preventDefault();

    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/users/editprofile",
      data: $(this).serialize(),
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {},
      error: function (response) {},
    });
  });
});
