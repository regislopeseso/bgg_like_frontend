function modal_cards_data() {
  let self = this;

  self.IsBuilt = false;

  self.LoadReferences = () => {
    self.DOM_Modal_MabCardAddEdit = $("#mab-card-add-edit");
    self.DOM = $("#modal-mab-cards-data");

    self.TableResult = self.DOM.find("#table-mab-cards-data tbody");

    self.AddEditModal = self.DOM.find("#mab-card-add-edit");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.AddMabCard = self.DOM.find(
      "#button-mab-add-card"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.EditMabCard =
      self.DOM.find("#button-mab-card-edit");

    self.CardAddEdit_Element = ".button-mab-card-edit";

    self.Attribute.MabCardId = "mabCard-id";

    self.Locations = [];
    self.Locations[self.Locations.length] =
      self.Locations.Modal_Mab_Card_Add_Edit = "modal_mab_card_add_edit.html";
    self.Locations[self.Locations.length] =
      self.Locations.Modal_Mab_Card_Delete_Restore =
        "modal_mab_card_delete_restore.html";
  };

  self.LoadEvents = () => {
    $.when(
      $.get(self.Locations.Modal_Mab_Card_Add_Edit),
      $.get(self.Locations.Modal_Mab_Card_Delete_Restore)
    ).done(function (addEditHtml, deleteRestoreHtml) {
      self.DOM_Modal_MabCardAddEdit.append(addEditHtml[0]);
      self.DOM_Modal_MabCardAddEdit.append(deleteRestoreHtml[0]);

      // Initialize the ADD/EDIT Modal Controller after loading HTML
      __global.MabCardEditModalController = new modal_mab_card_add_edit();
      // Initialize the DELETE/RESTORE Modal Controller after loading HTML
      __global.MabCardDeleteRestoreModalController =
        new modal_mab_card_delete_restore();

      // Hook up the buttons to open the modals AFTER they are ready
      // Opens ADD CATEGORY MODAL
      self.Buttons.AddMabCard.on("click", function () {
        __global.MabCardEditModalController.OpenAddModal(self.LoadAllMabCards);
      });

      // Opens EDIT CATEGORY MODAL
      self.DOM.on("click", self.CardAddEdit_Element, function () {
        const mabCardId = $(this).attr(self.Attribute.MabCardId);

        __global.MabCardEditModalController.OpenEditModal(
          mabCardId,
          self.LoadAllMabCards
        );
      });

      // Opens DELETE CATEGORY MODAL
      self.DOM.on("click", ".mabCard-delete-button", function () {
        const mabCardId = $(this).attr(self.Attribute.MabCardId);

        __global.MabCardDeleteRestoreModalController.OpenDeleteRestoreModal(
          mabCardId,
          self.LoadAllMabCards,
          true
        );
      });

      // Opens RESTORE CATEGORY MODAL
      self.DOM.on("click", ".category-restore-button", function () {
        const mabCardId = $(this).attr(self.Attribute.MabCardId);

        __global.MabCardDeleteRestoreModalController.OpenDeleteRestoreModal(
          mabCardId,
          self.LoadAllMabCards,
          false
        );
      });

      // Closes ALL CATEGORY TABLE MODAL
      self.DOM.on(
        "click",
        "#button-x-mab-card-db-modal-close, #button-mabCard-db-modal-close",
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
    console.log("oi");
    self.Show();
    self.LoadAllMabCards();
  };

  self.CloseModal = () => {
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  self.LoadAllMabCards = () => {
    self.AddContentLoader();

    $.ajax({
      url: "https://localhost:7081/admins/getallcards",
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
          let tr = $(`
            <tr class="align-middle">
              <td class="text-start align-middle">${item.name}</td>         
              
              <td class="text-center align-middle">${item.isDeleted}</td>
              <td class="align-middle">
                <div class="d-flex flex-row align-self-center align-items-center justify-content-center w-90 gap-2">
                  <button id="button-mabCard-edit-${index}" class="button-mabCard-edit btn btn-sm btn-outline-warning w-60" mabCard-id="${item.mabCardId}">
                    Edit
                  </button>

                  <button id="button-mabCard-delete-${index}" class="button-mabCard-delete btn btn-sm btn-outline-danger w-60" mabCard-id="${item.mabCardId}">
                    Delete
                  </button>

                  <button id="button-mabCard-restore-${index}" class="button-mabCard-restore btn btn-sm btn-outline-info w-60" mabCard-id="${item.mabCardId}">
                    Restore
                  </button>
                </div>
              </td>
            </tr>
          `);

          self.TableResult.append(tr);

          if (item.isDeleted === false) {
            tr.find("td").css("color", "var(--text-color)");
            $(`#button-mabCard-delete-${index}`).show();
            $(`#button-mabCard-restore-${index}`).hide();
          }

          if (item.isDeleted === true) {
            tr.find("td").css("color", "var(--reddish)");
            $(`#button-mabCard-delete-${index}`).hide();
            $(`#button-mabCard-restore-${index}`).show();
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
  (function (modalMabCardsData) {
    __global.MabCardsDataModalController = modalMabCardsData;
  })(new modal_cards_data())
);
