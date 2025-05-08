$(document).ready(function () {
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
        setTimeout(() => {
          $("body").load("unload");
        }, 600);
        $("body").show();
      } else {
        // If the user is not authenticated, redirect them to the authentication page
        window.location.href = "users_authentication.html";
      }
    });

  function loadEvents() {}

  function Build() {
    loadEvents();
  }

  Build();
});
