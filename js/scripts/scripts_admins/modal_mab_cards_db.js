function modal_Mab_Cards_DB() {
  let self = this;
  self.IsBuilt = false;

  self.LoadReferences = () => {
    self.DOMadmPage = $("#mab-cards-add-edit");
    self.DOM = $("#dom-modal-mab-cards-db");

    self.Table = self.DOM.find("#table-modal-mab-cards-db");
    self.TableResult = self.DOM.find("#table-modal-mab-cards-db tbody");

    self.AddEditModal = self.DOM.find("#dom-modal-mab-cards-db");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.MabCardAdd = self.DOM.find(
      "#button-modal-mab-cards-add"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.MabCardEdit =
      self.DOM.find(".button-modal-mab-cards-edit");
  };

  self.LoadEvents = () => {
    $.when(
      $.get("modal_mab_cards_add_edit.html"),
      $.get("modal_mab_cards_delete_restore.html")
    ).done(function (addEditHtml, deleteRestoreHtml) {
      self.DOMadmPage.append(addEditHtml[0]);
      self.DOMadmPage.append(deleteRestoreHtml[0]);

      // Initialize the ADD/EDIT Modal Controller after loading HTML
      __global.MabCardsAddEditModalController = new modal_Mab_Cards_Add_Edit();

      // Initialize the DELETE/RESTORE Modal Controller after loading HTML
      __global.MabCardsDeleteModalController =
        new modal_Mab_Cards_Delete_Restore();

      // Hook up the buttons to open the modals AFTER they are ready
      // Opens ADD MAB CARDS MODAL
      // Opens EDIT MAB CARDS MODAL
      self.Buttons.MabCardAdd.on("click", function () {
        __global.MabCardsAddEditModalController.OpenAddModal(
          self.LoadAllMabCards
        );
      });

      // Opens EDIT MAB CARDS MODAL
      self.DOM.on("click", ".button-modal-mab-cards-edit", function () {
        const mabCardId = $(this).attr("mab-card-id");

        __global.MabCardsAddEditModalController.OpenEditModal(
          mabCardId,
          self.LoadAllMabCards
        );
      });

      // Opens DELETE MAB CARDS MODAL
      self.DOM.on("click", ".button-modal-mab-cards-delete", function () {
        const mabCardId = $(this).attr("mab-card-id");

        __global.MabCardsDeleteModalController.OpenDeleteRestoreModal(
          mabCardId,
          self.LoadAllMabCards,
          true
        );
      });

      // Opens RESTORE MAB CARDS MODAL
      self.DOM.on("click", ".button-modal-mab-cards-restore", function () {
        const mabCardId = $(this).attr("mab-card-id");

        __global.MabCardsDeleteModalController.OpenDeleteRestoreModal(
          mabCardId,
          self.LoadAllMabCards,
          false
        );
      });

      // Closes MAB CARDS TABLE MODAL
      self.DOM.on(
        "click",
        "#button-x-mab-cards-db-close, #button-modal-mab-cards-db-close",
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

  function sweetAlertError(title_text, message_text) {
    Swal.fire({
      position: "center",
      confirmButtonText: "OK!",
      icon: "error",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  self.LoadAllMabCards = () => {
    if ($.fn.DataTable.isDataTable(self.Table)) {
      self.Table.DataTable().destroy();
    }

    self.AddContentLoader();
    $.ajax({
      method: "GET",
      url: "https://localhost:7081/admins/listmabcards",
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        // Clear the table
        self.TableResult.empty();

        if (!response.content) {
          sweetAlertError(response.message);

          let tr = $(`
            <tr class="align-middle">
              <td class="text-start align-middle">No cards to be displayed...</td>              
            </tr>
          `);

          self.TableResult.append(tr);

          return;
        }

        $.each(response.content, function (index, item) {
          let tr = $(`
        <tr class="align-middle">
          <td class="text-center align-middle">
            <button class="btn btn-outline-info btn-sm">
              view card
            </button>
          </td>
          
          <td class="text-start align-middle">
            ${item.cardName} 
          </td>
         
          <td class="text-center align-middle">${item.cardPower}</td>
          <td class="text-center align-middle">${item.cardUpperHand}</td>
          <td class="text-center align-middle">${item.cardType}</td>
          <td class="text-center align-middle">${item.isDeleted}</td>
         
          <td class="align-middle">
            <div class="d-flex flex-row align-self-center align-items-center justify-content-center w-90 gap-2">
              <button id="button-modal-mab-cards-edit-${index}" class="button-modal-mab-cards-edit btn btn-sm btn-outline-warning w-60" mab-card-id="${item.cardId}">
                Edit
              </button>

              <button id="button-modal-mab-cards-delete-${index}" class="button-modal-mab-cards-delete btn btn-sm btn-outline-danger w-60" mab-card-id="${item.cardId}">
                Delete
              </button>   
              
              <button id="button-modal-mab-cards-restore-${index}" class="button-modal-mab-cards-restore btn btn-sm btn-outline-info w-60" mab-card-id="${item.cardId}">
                Restore
              </button>
            </div>
          </td>
        </tr>
      `);
          self.TableResult.append(tr);

          if (item.isDeleted === false) {
            tr.find("td").css("color", "var(--text-color)");
            $(`#button-modal-mab-cards-delete-${index}`).show();
            $(`#button-modal-mab-cards-restore-${index}`).hide();
          }
          if (item.isDeleted === true) {
            tr.find("td").css("color", "var(--reddish)");
            $(`#button-modal-mab-cards-delete-${index}`).hide();
            $(`#button-modal-mab-cards-restore-${index}`).show();
          }
        });

        self.Table.DataTable();
      },
      error: function (xhr, status, error) {
        sweetAlertError("Request failed:", error);
      },
      complete: () => {
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
  (function (modalMabCardsDB) {
    __global.MabCardsDataBaseModalController = modalMabCardsDB;
  })(new modal_Mab_Cards_DB())
);
