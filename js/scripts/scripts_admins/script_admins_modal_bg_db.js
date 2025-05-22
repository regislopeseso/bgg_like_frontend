function modal_BG_DataBase() {
  let self = this;
  self.IsBuilt = false;
  self.isEditMode = false;
  self.currentBoardGameId = null;

  self.LoadReferences = () => {
    self.DOMadmPage = $("#bg-add-edit");
    self.DOM = $("#bg-data-modal");

    self.TableResult = self.DOM.find("#admins-bg-table tbody");

    self.AddEditModal = self.DOM.find("#bg-add-edit");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.BgAdd = self.DOM.find(
      "#bg-add-edit-button"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.BgEdit = self.DOM.find(
      ".bg-edit-edit-button"
    );
  };

  self.LoadEvents = () => {
    $.when(
      $.get("admins_modal_bg_add_edit.html"),
      $.get("admins_modal_bg_delete_restore.html")
    ).done(function (addEditHtml, deleteRestoreHtml) {
      self.DOMadmPage.append(addEditHtml[0]);
      self.DOMadmPage.append(deleteRestoreHtml[0]);

      // Initialize the ADD/EDIT Modal Controller after loading HTML
      __global.BgEditModalController = new modal_BG_Add_Edit();
      // Initialize the DELETE/RESTORE Modal Controller after loading HTML
      __global.BgDeleteRestoreModalController = new modal_BG_Delete_Restore();

      // Hook up the buttons to open the modals AFTER they are ready
      // Opens ADD BG MODAL
      self.Buttons.BgAdd.on("click", function () {
        __global.BgEditModalController.OpenAddModal();
      });

      // Opens EDIT BG MODAL
      self.DOM.on("click", ".bg-edit-button", function () {
        const bgId = $(this).attr("data-bg-id");

        __global.BgEditModalController.OpenEditModal(bgId);
      });

      // Opens DELETE BG MODAL
      self.DOM.on("click", ".bg-delete-button", function () {
        const bgId = $(this).attr("data-bg-id");

        console.log(bgId);

        __global.BgDeleteRestoreModalController.OpenDeleteRestoreModal(
          bgId,
          self.LoadAllGames,
          true
        );
      });

      // Opens RESTORE BG MODAL
      self.DOM.on("click", ".bg-restore-button", function () {
        const bgId = $(this).attr("data-bg-id");

        __global.BgDeleteRestoreModalController.OpenDeleteRestoreModal(
          bgId,
          self.LoadAllGames,
          false
        );
      });

      // Closes ALL BG TABLE MODAL
      self.DOM.on(
        "click",
        "#close-x-bg-db-modal, #close-button-bg-db-modal",
        () => {
          self.CloseModal();
        }
      );
    });
  };

  self.Show = () => {
    if (!self.DOM || self.DOM.length === 0) {
      console.error("Modal DOM element not found.");
      return;
    }

    const modalInstance = new bootstrap.Modal(self.DOM[0], {
      backdrop: "static",
      keyboard: false,
    });

    modalInstance.show();
  };

  self.AddContentLoader = () => {
    self.DOM.loadcontent("charge-contentloader");
  };
  self.RemoveContentLoader = () => {
    self.DOM.loadcontent("demolish-contentloader");
  };

  self.OpenModal = () => {
    self.Show();
    self.LoadAllGames();
  };

  self.CloseModal = () => {
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  self.LoadAllGames = () => {
    self.AddContentLoader();
    $.ajax({
      url: "https://localhost:7081/admins/listboardgames",
      method: "GET",
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content || !Array.isArray(response.content)) {
          console.error("Unexpected response format:", response);
          return;
        }

        // Clear the table
        self.TableResult.empty();

        $.each(response.content, function (index, item) {
          let mechanics = item.mechanics.join(", ");
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
              style="border: none; background-color: var(--bg-color); color: var(--main-color);">            
                <i class="bi bi-arrows-angle-expand"></i>
            </button>
          </td>
          <td class="text-center align-middle">${item.playersCount}</td>
          <td class="text-center align-middle">${item.minAge}</td>
          <td class="text-start align-middle">${item.category}</td>
          <td class="text-start align-middle">${mechanics}</td>
          <td class="text-center align-middle">${item.isDeleted}</td>
          <td class="align-middle">
            <div class="d-flex flex-row align-self-center align-items-center justify-content-center w-90 gap-2">
              <button id="bg-edit-button-${index}" class="bg-edit-button btn btn-sm btn-outline-warning w-60" data-bg-id="${item.boardGameId}">
                Edit
              </button>

              <button id="bg-delete-button-${index}" class="bg-delete-button btn btn-sm btn-outline-danger" w-60 data-bg-id="${item.boardGameId}">
                Delete
              </button>

              <button id="bg-restore-button-${index}" class="bg-restore-button btn btn-sm btn-outline-info w-60" data-bg-id="${item.boardGameId}">
                Restore
              </button>
            </div>
          </td>
        </tr>
      `;
          self.TableResult.append(tr);

          if (item.isDeleted === false) {
            $(`#bg-delete-button-${index}`).show();
            $(`#bg-restore-button-${index}`).hide();
          }
          if (item.isDeleted === true) {
            $(`#bg-delete-button-${index}`).hide();
            $(`#bg-restore-button-${index}`).show();
          }
        });
        self.RemoveContentLoader();
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
