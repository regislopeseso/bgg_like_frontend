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
        Build();
      } else {
        // If the user is not authenticated, redirect them to the authentication page
        window.location.href = "html/pages_users/users_authentication.html";
      }
    });

  //$("#bg-description-modal").load("admins_bg_description_modal.html");

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
          <td class="text-start">${item.name}</td>
          <td style="max-width: 200px;">
            <div id="bg-description-modal" class="d-block text-truncate description-preview" style="cursor: pointer;">
              ${item.description}
            </div>
          </td>
          <td>${item.playersCount}</td>
          <td>${item.minAge}</td>
          <td>${item.category}</td>
          <td>${item.mechanics}</td>
          <td>${item.isDeleted}</td>
          <td>
          <div class="d-flex flex-row align-items-center gap-2">
            <button class="btn btn-sm btn-outline-warning w-100">
              Edit
            </button>

            <button class="btn btn-sm btn-outline-danger w-100">
              Delete
            </button>
          </div>
        </td>
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

  function Build() {
    loadAllGames();

    //$("#bg-description-modal").load("admins_bg_description_modal.html");
  }
});
