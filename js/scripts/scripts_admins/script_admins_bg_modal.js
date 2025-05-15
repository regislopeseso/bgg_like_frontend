$(function () {
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
        window.location.href = "html/pages_users/users_authentication.html";
      }
    });

  function loadAllGames(data = {}) {
    $.ajax({
      url: "https://localhost:7081/admins/listboardgames",
      method: "GET",
      xhrFields: {
        withCredentials: true, // This enables sending cookies with the request
      },
      data: data,
      success: function (response) {
        if (!response.content || !Array.isArray(response.content)) {
          console.error("Unexpected response format:", response);
          return;
        }

        // Clear the table
        $("#admins-bg-table tbody").empty();

        $.each(response.content, function (index, item) {
          let tr = `
        <tr>
          <td class="text-start">${item.boardGameName}</td>
          <td>${item.description}</td>
          <td>${item.playersCount}</td>
          <td>${item.minAge}</td>
          <td>${item.category}</td>
          <td>${item.mechanics}</td>
          <td>${item.isDeleted}</td>
        </tr>
      `;
          $("#admins-bg-table tbody").append(tr);
        });
      },
      error: function (xhr, status, error) {
        console.error("Request failed:", error);
      },
    });
  }

  function loadEvents() {}

  function Build() {
    loadAllGames();
  }

  Build();
});
