function modal_BG_DataBase() {
  let self = this;
  self.IsBuilt = false;

  self.LoadReferences = () => {
    self.DOMadmPage = $("#bg-add");
    self.DOM = $("#bg-data-modal");

    self.TableResult = self.DOM.find("#admins-bg-table tbody");

    self.AddEditModal = self.DOM.find("#bg-add");

    self.OpenAddEditModal = self.DOM.find("#bg-add-button");
  };

  self.LoadEvents = () => {
    // Load modal HTML, THEN initialize modal logic
    self.DOMadmPage.load("admins_modal_bg_edit.html", function () {
      // Initialize the Edit Modal Controller after loading HTML
      __global.BgEditModalController = new modal_BG_Edit();

      // Hook up the button to open the modal AFTER it's ready
      self.OpenAddEditModal.on("click", function () {
        __global.BgEditModalController.OpenModal();
      });
    });
  };

  self.Show = () => {
    if (!self.DOM || self.DOM.length === 0) {
      console.error("Modal DOM element not found.");
      return;
    }

    const modalInstance = new bootstrap.Modal(self.DOM[0], {
      backdrop: "static", // optional
      keyboard: false, // optional
    });

    modalInstance.show();
  };

  self.OpenModal = () => {
    self.Show();
    self.LoadAllGames();
  };

  self.CloseModal = () => {};

  self.LoadAllGames = () => {
    $.ajax({
      url: "https://localhost:7081/admins/listboardgames",
      method: "GET",
      xhrFields: {
        withCredentials: true, // This enables sending cookies with the request
      },
      success: function (response) {
        if (!response.content || !Array.isArray(response.content)) {
          console.error("Unexpected response format:", response);
          return;
        }

        // Clear the table
        self.TableResult.empty();

        $.each(response.content, function (index, item) {
          let tr = `
        <tr class="align-middle">
          <td class="text-start align-middle">${item.name}</td>
          <td class="text-start align-middle" style="max-width: 200px;">
            <div class="d-block text-truncate description-preview">
              ${item.description}
            </div>

            <button
              id="bg-description-button"
              class="d-flex w-100 align-items-center justify-content-center m-0 p-0"
              style="border: none; background-color: var(--bg-color); color: var(--main-color);"            
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
          self.TableResult.append(tr);
        });
      },
      error: function (xhr, status, error) {
        console.error("Request failed:", error);
      },
    });
  };

  self.BuildModal = () => {
    if (self.IsBuilt == true) {
      return;
    }

    self.LoadReferences();
    self.LoadEvents();
    self.IsBuilt = true;
  };

  self.BuildModal();
}

$(
  (function (modalBgDataBase) {
    __global.BgDatabBaseModalController = modalBgDataBase;
  })(new modal_BG_DataBase())
);
