function modal_Mab_Npcs_DB() {
  let self = this;
  self.IsBuilt = false;

  self.LoadReferences = () => {
    self.DOMadmPage = $("#mab-npcs-add-edit");
    self.DOM = $("#dom-modal-mab-npcs-db");

    self.Table = self.DOM.find("#table-modal-mab-npcs-db");
    self.TableResult = self.DOM.find("#table-modal-mab-npcs-db tbody");

    self.AddEditModal = self.DOM.find("#dom-modal-mab-npcs-db");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.MabNpcAdd = self.DOM.find(
      "#button-modal-mab-npcs-add"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.MabNpcEdit = self.DOM.find(
      ".button-modal-mab-npcs-edit"
    );
  };

  self.LoadEvents = () => {
    $.when(
      $.get("modal_mab_npcs_add_edit.html"),
      $.get("modal_mab_npcs_delete_restore.html")
    ).done(function (addEditHtml, deleteRestoreHtml) {
      self.DOMadmPage.append(addEditHtml[0]);
      self.DOMadmPage.append(deleteRestoreHtml[0]);

      // Initialize the ADD/EDIT Modal Controller after loading HTML
      __global.MabNpcsAddEditModalController = new modal_Mab_Npcs_Add_Edit();

      // Initialize the DELETE/RESTORE Modal Controller after loading HTML
      __global.MabNpcsDeleteModalController =
        new modal_Mab_Npcs_Delete_Restore();

      // Hook up the buttons to open the modals AFTER they are ready
      // Opens ADD MAB NPCs MODAL
      // Opens EDIT MAB NPCs MODAL
      self.Buttons.MabNpcAdd.on("click", function () {
        __global.MabNpcsAddEditModalController.OpenAddModal(
          self.LoadAllMabNpcs
        );
      });

      // Opens EDIT MAB NPCs MODAL
      self.DOM.on("click", ".button-modal-mab-npcs-edit", function () {
        const mabNpcId = $(this).attr("mab-npc-id");

        __global.MabNpcsAddEditModalController.OpenEditModal(
          mabNpcId,
          self.LoadAllMabNpcs
        );
      });

      // Opens DELETE MAB NPCs MODAL
      self.DOM.on("click", ".button-modal-mab-npcs-delete", function () {
        const mabNpcId = $(this).attr("mab-npc-id");

        __global.MabNpcsDeleteModalController.OpenDeleteRestoreModal(
          mabNpcId,
          self.LoadAllMabNpcs,
          true
        );
      });

      // Opens RESTORE MAB CARDS MODAL
      self.DOM.on("click", ".button-modal-mab-npcs-restore", function () {
        const mabNpcId = $(this).attr("mab-npc-id");

        __global.MabNpcsDeleteModalController.OpenDeleteRestoreModal(
          mabNpcId,
          self.LoadAllMabNpcs,
          false
        );
      });

      // Closes MAB CARDS TABLE MODAL
      self.DOM.on(
        "click",
        "#button-x-mab-npcs-db-close, #button-modal-mab-npcs-db-close",
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
    self.LoadAllMabNpcs();
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

  self.LoadAllMabNpcs = () => {
    if ($.fn.DataTable.isDataTable(self.Table)) {
      self.Table.DataTable().destroy();
    }

    self.AddContentLoader();

    $.ajax({
      method: "GET",
      url: "https://localhost:7081/admins/listmabnpcs",
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
              <td class="text-start align-middle">No npcs to be displayed...</td>              
            </tr>
          `);

          self.TableResult.append(tr);

          return;
        }

        $.each(response.content, function (index, item) {
          let deckCards = item.deck
            .map((card) => {
              return `
                <div class="p-2">
                  <div class="list-group-item d-flex flex-row h-100 p-1"
                      style="background-color: var(--second-bg-color); color: var(--text-color);">
                    <div><strong>${card.name}&nbsp;</strong></div>
                    <div>&nbsp;Type: ${card.type}&nbsp;</div>
                    <div>&nbsp;P: ${card.power}&nbsp;</div>
                    <div>&nbsp;UH: ${card.upperHand}&nbsp;</div>
                  </div>
                </div>
              `;
            })
            .join("");

          let deckHtml = `
            <div class="d-flex flex-wrap justify-content-start gap-2">
              ${deckCards}
            </div>
          `;

          let tr = $(`
            <tr class="align-middle">    
              <td></td>
                    
              <td class="text-start align-middle">
                ${item.npcName} 
              </td>
            
              
              <td class="text-center align-middle">
                ${item.npcDescription}
              </td>
              
              <td class="text-center align-middle" style="width: 90px !important">
                ${item.npcLevel}
              </td>
              
              <td class="align-start">
                ${deckHtml}
              </td> 

              <td class="align-start">
                ${item.npcIsDeleted}
              </td>

              <td class="align-start">
                <div
                  class="d-flex flex-row align-self-center align-items-center justify-content-center w-90 gap-2"
                >
                  <button
                    id="button-modal-mab-npcs-edit-${index}"
                    class="button-modal-mab-npcs-edit btn btn-sm btn-outline-warning w-60"
                    mab-npc-id="${item.npcId}"
                  >
                    Edit
                  </button>

                  <button
                    id="button-modal-mab-npcs-delete-${index}"
                    class="button-modal-mab-npcs-delete btn btn-sm btn-outline-danger w-60"
                    mab-npc-id="${item.npcId}"
                  >
                    Delete
                  </button>

                  <button
                    id="button-modal-mab-npcs-restore-${index}"
                    class="button-modal-mab-npcs-restore btn btn-sm btn-outline-info w-60"
                    mab-npc-id="${item.npcId}"
                  >
                    Restore
                  </button>
                </div>
              </td>
            </tr>
          `);
          self.TableResult.append(tr);

          if (item.npcIsDeleted === false) {
            tr.find("td").css("color", "var(--text-color)");
            $(`#button-modal-mab-npcs-delete-${index}`).show();
            $(`#button-modal-mab-npcs-restore-${index}`).hide();
          }
          if (item.npcIsDeleted === true) {
            tr.find("td").css("color", "var(--reddish)");
            $(`#button-modal-mab-npcs-delete-${index}`).hide();
            $(`#button-modal-mab-npcs-restore-${index}`).show();
          }
        });

        self.Table.DataTable({
          columnDefs: [
            {
              className: "dtr-control",
              orderable: false,
              target: 0,
            },
          ],
          order: [1, "asc"],
          responsive: {
            details: {
              type: "column",
              target: "tr",
            },
          },
        });
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
  (function (modalMabNpcsDB) {
    __global.MabNpcsDataBaseModalController = modalMabNpcsDB;
  })(new modal_Mab_Npcs_DB())
);
