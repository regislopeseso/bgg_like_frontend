function modal_mab_cards_data() {
  let self = this;
  self.IsBuilt = false;

  self.LoadReferences = () => {
    self.DOMadmPage = $("#mab-card-add-edit");
    self.DOM = $("#modal-mab-cards-data");

    self.Table = self.DOM.find("#table-mab-cards-data");

    self.TableResult = self.DOM.find("#table-mab-cards-data tbody");

    self.AddEditModal = self.DOM.find("#mab-card-add-edit");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.MabCardAdd = self.DOM.find(
      "#button-mab-card-add"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.MabCardEdit =
      self.DOM.find(".button-mab-card-edit");
  };

  self.LoadEvents = () => {
    $.when(
      $.get("modal_mab_cards_add_edit.html"),
      $.get("modal_mab_cards_delete_restore.html")
    ).done(function (addEditHtml, deleteRestoreHtml) {
      self.DOMadmPage.append(addEditHtml[0]);
      self.DOMadmPage.append(deleteRestoreHtml[0]);

      // Initialize the ADD/EDIT Modal Controller after loading HTML
      __global.MabCardEditModalController = new modal_mab_cards_add_edit();
      // Initialize the DELETE/RESTORE Modal Controller after loading HTML
      __global.MabCardDeleteRestoreModalController =
        new modal_mab_cards_delete_restore();

      // Hook up the buttons to open the modals AFTER they are ready
      // Opens ADD MAB CARD MODAL
      self.Buttons.MabCardAdd.on("click", function () {
        __global.MabCardEditModalController.OpenAddModal(self.LoadAllMabCards);
      });

      // Opens EDIT MAB CARD MODAL
      self.DOM.on("click", ".mab-card-edit-button", function () {
        const mabCardId = $(this).attr("data-mab-card-id");

        __global.MabCardEditModalController.OpenEditModal(
          mabCardId,
          self.LoadAllMabCards
        );
      });

      // Opens DELETE MAB CARD MODAL
      self.DOM.on("click", ".mab-card-delete-button", function () {
        const mabCardId = $(this).attr("data-mab-card-id");

        __global.MabCardDeleteRestoreModalController.OpenDeleteRestoreModal(
          mabCardId,
          self.LoadAllMabCards,
          true
        );
      });

      // Opens RESTORE MAB CARD MODAL
      self.DOM.on("click", ".mab-card-restore-button", function () {
        const mabCardId = $(this).attr("data-mab-card-id");

        __global.MabCardDeleteRestoreModalController.OpenDeleteRestoreModal(
          mabCardId,
          self.LoadAllMabCards,
          false
        );
      });

      // Closes ALL MAB CARD TABLE MODAL
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
      method: "GET",
      url: "https://localhost:7081/admins/getallcards",
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
              <td class="text-start align-middle">${item.cardName}</td>         
              <td class="text-center align-middle">${item.cardPower}</td>         
              <td class="text-center align-middle">${item.cardUpperHand}</td>         
              <td class="text-center align-middle">${item.cardLevel}</td>         
              <td class="text-center align-middle">${item.cardType}</td>         
            
              <td class="align-middle">
                <div class="d-flex flex-row align-self-center align-items-center justify-content-center w-90 gap-2">
                  <button id="mab-card-edit-button-${index}" class="mab-card-edit-button btn btn-sm btn-outline-warning w-60" data-mab-card-id="${item.cardId}">
                    Edit
                  </button>

                  <button id="mab-card-delete-button-${index}" class="mab-card-delete-button btn btn-sm btn-outline-danger w-60" data-mab-card-id="${item.cardId}">
                    Delete
                  </button>

                </div>
              </td>
            </tr>
          `);
          self.TableResult.append(tr);
        });

        self.RemoveContentLoader();

        self.Table.DataTable();
      },
      error: function (xhr, status, error) {
        console.error("Request failed:", error);
        self.RemoveContentLoader();
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
  })(new modal_mab_cards_data())
);
