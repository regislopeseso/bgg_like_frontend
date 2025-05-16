$(function () {
  $("body").loadpage("charge");

  fetch("https://localhost:7081/users/validatestatus", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.content.isUserLoggedIn == true) {
        // If the user is logged in, proceed to load the page normally
        $("body").loadpage("demolish");
      } else {
        // If the user is not authenticated, redirect them to the authentication page
        window.location.href = "html/pages_users/users_authentication.html";
      }
    });
});
