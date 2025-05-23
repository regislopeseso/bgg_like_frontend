function modal_Mechanic_DataBase() {
  let self = this;
  self.IsBuilt = false;

  self.LoadReferences = () => {
    self.DOMadmPage = $("#mechanic-add");
    self.DOM = $("#mechanic-data-modal");

    self.TableResult = self.DOM.find("#admins-mechanic-table tbody");

    self.AddEditModal = self.DOM.find("#mechanic-add");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.MechanicAdd =
      self.DOM.find("#mechanic-add-button");
    self.Buttons[self.Buttons.length] = self.Buttons.MechanicEdit =
      self.DOM.find(".mechanic-edit-button");
  };

  self.LoadEvents = () => {
    $.when(
      $.get("admins_modal_mechanic_add_edit.html"),
      $.get("admins_modal_mechanic_delete_restore.html")
    ).done(function (addEditHtml, deleteRestoreHtml) {
      self.DOMadmPage.append(addEditHtml[0]);
      self.DOMadmPage.append(deleteRestoreHtml[0]);

      // Initialize the ADD/EDIT Modal Controller after loading HTML
      __global.MechanicEditModalController = new modal_Mechanic_Add_Edit();
      // Initialize the DELETE/RESTORE Modal Controller after loading HTML
      __global.MechanicDeleteRestoreModalController =
        new modal_Mechanic_Delete_Restore();

      // Hook up the buttons to open the modals AFTER they are ready
      // Opens ADD MECHANIC MODAL
      self.Buttons.MechanicAdd.on("click", function () {
        __global.MechanicEditModalController.OpenAddModal(
          self.LoadAllMechanics
        );
      });

      // Opens EDIT MECHANIC MODAL
      self.DOM.on("click", ".mechanic-edit-button", function () {
        const mechanicId = $(this).attr("data-mechanic-id");

        __global.MechanicEditModalController.OpenEditModal(
          mechanicId,
          self.LoadAllMechanics
        );
      });

      // Opens DELETE MECHANIC MODAL
      self.DOM.on("click", ".mechanic-delete-button", function () {
        const mechanicId = $(this).attr("data-mechanic-id");

        console.log(mechanicId);

        __global.MechanicDeleteRestoreModalController.OpenDeleteRestoreModal(
          mechanicId,
          self.LoadAllMechanics,
          true
        );
      });

      // Opens RESTORE MECHANIC MODAL
      self.DOM.on("click", ".mechanic-restore-button", function () {
        const mechanicId = $(this).attr("data-mechanic-id");

        __global.MechanicDeleteRestoreModalController.OpenDeleteRestoreModal(
          mechanicId,
          self.LoadAllMechanics,
          false
        );
      });

      // Closes ALL MECHANICS TABLE MODAL
      self.DOM.on(
        "click",
        "#close-x-mechanic-db-modal, #close-button-mechanic-db-modal",
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
    self.LoadAllMechanics();
  };

  self.CloseModal = () => {
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  self.LoadAllMechanics = () => {
    self.AddContentLoader();

    $.ajax({
      url: "https://localhost:7081/admins/listmechanics",
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
          let tr = `
        <tr class="align-middle">
          <td class="text-start align-middle">${item.name}</td>         
          
          <td class="text-center align-middle">${item.isDeleted}</td>
          <td class="align-middle">
            <div class="d-flex flex-row align-self-center align-items-center justify-content-center w-90 gap-2">
              <button id="mechanic-edit-button-${index}" class="mechanic-edit-button btn btn-sm btn-outline-warning w-60" data-mechanic-id="${item.mechanicId}">
                Edit
              </button>

              <button id="mechanic-delete-button-${index}" class="mechanic-delete-button btn btn-sm btn-outline-danger w-60" data-mechanic-id="${item.mechanicId}">
                Delete
              </button>

              <button id="mechanic-restore-button-${index}" class="mechanic-restore-button btn btn-sm btn-outline-info w-60" data-mechanic-id="${item.mechanicId}">
                Restore
              </button>
            </div>
          </td>
        </tr>
      `;
          self.TableResult.append(tr);

          if (item.isDeleted === false) {
            $(`#mechanic-delete-button-${index}`).show();
            $(`#mechanic-restore-button-${index}`).hide();
          }
          if (item.isDeleted === true) {
            $(`#mechanic-delete-button-${index}`).hide();
            $(`#mechanic-restore-button-${index}`).show();
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
  (function (modalMechanicDataBase) {
    __global.MechanicDataBaseModalController = modalMechanicDataBase;
  })(new modal_Mechanic_DataBase())
);
