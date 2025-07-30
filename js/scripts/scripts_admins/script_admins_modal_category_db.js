function modal_Category_DataBase() {
  let self = this;
  self.IsBuilt = false;

  self.LoadReferences = () => {
    self.DOMadmPage = $("#category-add");
    self.DOM = $("#category-data-modal");

    self.TableResult = self.DOM.find("#admins-category-table tbody");

    self.AddEditModal = self.DOM.find("#category-add");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.CategoryAdd =
      self.DOM.find("#category-add-button");
    self.Buttons[self.Buttons.length] = self.Buttons.CategoryEdit =
      self.DOM.find(".category-edit-button");
  };

  self.LoadEvents = () => {
    $.when(
      $.get("admins_modal_category_add_edit.html"),
      $.get("admins_modal_category_delete_restore.html")
    ).done(function (addEditHtml, deleteRestoreHtml) {
      self.DOMadmPage.append(addEditHtml[0]);
      self.DOMadmPage.append(deleteRestoreHtml[0]);

      // Initialize the ADD/EDIT Modal Controller after loading HTML
      __global.CategoryEditModalController = new modal_Category_Add_Edit();
      // Initialize the DELETE/RESTORE Modal Controller after loading HTML
      __global.CategoryDeleteRestoreModalController =
        new modal_Category_Delete_Restore();

      // Hook up the buttons to open the modals AFTER they are ready
      // Opens ADD CATEGORY MODAL
      self.Buttons.CategoryAdd.on("click", function () {
        __global.CategoryEditModalController.OpenAddModal(
          self.LoadAllCategories
        );
      });

      // Opens EDIT CATEGORY MODAL
      self.DOM.on("click", ".category-edit-button", function () {
        const categoryId = $(this).attr("data-category-id");

        __global.CategoryEditModalController.OpenEditModal(
          categoryId,
          self.LoadAllCategories
        );
      });

      // Opens DELETE CATEGORY MODAL
      self.DOM.on("click", ".category-delete-button", function () {
        const categoryId = $(this).attr("data-category-id");

        __global.CategoryDeleteRestoreModalController.OpenDeleteRestoreModal(
          categoryId,
          self.LoadAllCategories,
          true
        );
      });

      // Opens RESTORE CATEGORY MODAL
      self.DOM.on("click", ".category-restore-button", function () {
        const categoryId = $(this).attr("data-category-id");

        __global.CategoryDeleteRestoreModalController.OpenDeleteRestoreModal(
          categoryId,
          self.LoadAllCategories,
          false
        );
      });

      // Closes ALL CATEGORY TABLE MODAL
      self.DOM.on(
        "click",
        "#close-x-category-db-modal, #close-button-category-db-modal",
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
    self.LoadAllCategories();
  };

  self.CloseModal = () => {
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  self.LoadAllCategories = () => {
    self.AddContentLoader();

    $.ajax({
      method: "GET",
      url: "https://localhost:7081/admins/listcategories",
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
          let tr = $(`
        <tr class="align-middle">
          <td class="text-start align-middle">${item.name}</td>         
          
          <td class="text-center align-middle">${item.isDeleted}</td>
          <td class="align-middle">
            <div class="d-flex flex-row align-self-center align-items-center justify-content-center w-90 gap-2">
              <button id="category-edit-button-${index}" class="category-edit-button btn btn-sm btn-outline-warning w-60" data-category-id="${item.categoryId}">
                Edit
              </button>

              <button id="category-delete-button-${index}" class="category-delete-button btn btn-sm btn-outline-danger w-60" data-category-id="${item.categoryId}">
                Delete
              </button>

              <button id="category-restore-button-${index}" class="category-restore-button btn btn-sm btn-outline-info w-60" data-category-id="${item.categoryId}">
                Restore
              </button>
            </div>
          </td>
        </tr>
      `);
          self.TableResult.append(tr);

          if (item.isDeleted === false) {
            tr.find("td").css("color", "var(--text-color)");
            $(`#category-delete-button-${index}`).show();
            $(`#category-restore-button-${index}`).hide();
          }
          if (item.isDeleted === true) {
            tr.find("td").css("color", "var(--reddish)");
            $(`#category-delete-button-${index}`).hide();
            $(`#category-restore-button-${index}`).show();
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
  (function (modalCategoryDataBase) {
    __global.CategoryDataBaseModalController = modalCategoryDataBase;
  })(new modal_Category_DataBase())
);
