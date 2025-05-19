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
        Build();
        $("body").loadpage("demolish");
      } else {
        // If the user is not authenticated, redirect them to the authentication page
        window.location.href = "html/pages_users/users_authentication.html";
      }
    });

  function loadEvents() {
    $("#bg-data-button").on("click", function (e) {
      e.preventDefault();

      $("#bg-tools-wrapper").slideToggle();
    });

    // Load modal HTML, THEN initialize modal logic
    $("#bg-modal").load("admins_modal_bg_data_base.html", function () {
      // Hook up the button to open the modal AFTER it's ready
      $("#load-bg-button").on("click", function () {
        __global.BgDatabBaseModalController.OpenModal();
      });
    });
  }

  function Build() {
    loadEvents();
  }
});
