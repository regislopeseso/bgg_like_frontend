$(function () {
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
        <tr class="align-middle">
          <td class="text-start align-middle">${item.name}</td>
          <td class="text-start align-middle" style="max-width: 200px;">
            <div class="d-block text-truncate description-preview">
              ${item.description}
            </div>
            
            <button 
              class="d-flex w-100 align-items-center justify-content-center m-0 p-0"
              style="border: none; background-color: var(--bg-color); color: var(--main-color);" 
              data-bs-toggle="modal"
              data-bs-target="#bg-description">
                <i class="bi bi-arrows-angle-expand"></i>
            </button>
          </td>
          <td class="text-center align-middle">${item.playersCount}</td>
          <td class="text-center align-middle">${item.minAge}</td>
          <td class="text-start align-middle">${item.category}</td>
          <td class="text-start align-middle">${item.mechanics}</td>
          <td class="text-center align-middle">${item.isDeleted}</td>
          <td class="align-middle">
            <div class="d-flex flex-row align-self-center align-items-center justify-content-center w-90 gap-2">
              <button class="btn btn-sm btn-outline-warning w-60">
                Edit
              </button>

              <button class="btn btn-sm btn-outline-danger w-60">
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
  }
});
