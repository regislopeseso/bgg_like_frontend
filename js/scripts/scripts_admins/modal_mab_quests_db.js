function modal_Mab_Quests_DB() {
  let self = this;
  self.IsBuilt = false;

  self.LoadReferences = () => {
    self.DOMadmPage = $("#mab-quests-add-edit");
    self.DOM = $("#dom-modal-mab-quests-db");

    self.Table = self.DOM.find("#table-modal-mab-quests-db");
    self.TableResult = self.DOM.find("#table-modal-mab-quests-db tbody");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.MabQuestAdd =
      self.DOM.find("#button-modal-mab-quests-add");
    self.Buttons[self.Buttons.length] = self.Buttons.MabQuestEdit =
      self.DOM.find(".button-modal-mab-quests-edit");
  };

  self.LoadEvents = () => {
    $.when(
      $.get("modal_mab_quests_add_edit.html"),
      $.get("modal_mab_quests_delete_restore.html")
    ).done(function (addEditHtml, deleteRestoreHtml) {
      self.DOMadmPage.append(addEditHtml[0]);
      self.DOMadmPage.append(deleteRestoreHtml[0]);

      // Initialize the ADD/EDIT Modal Controller after loading HTML
      __global.MabQuestsAddEditModalController =
        new modal_Mab_Quests_Add_Edit();

      // Initialize the DELETE/RESTORE Modal Controller after loading HTML
      __global.MabQuestsDeleteRestoreModalController =
        new modal_Mab_Quests_Delete_Restore();

      // Hook up the buttons to open the modals AFTER they are ready
      // Opens ADD MAB Quests MODAL
      // Opens EDIT MAB Quests MODAL
      self.Buttons.MabQuestAdd.on("click", function () {
        __global.MabQuestsAddEditModalController.OpenAddModal(
          self.LoadAllMabQuests
        );
      });

      // Opens EDIT MAB Quests MODAL
      self.DOM.on("click", ".button-modal-mab-quests-edit", function () {
        const mabQuestId = $(this).attr("mab-quest-id");

        __global.MabQuestsAddEditModalController.OpenEditModal(
          mabQuestId,
          self.LoadAllMabQuests
        );
      });

      // Opens DELETE MAB Quests MODAL
      self.DOM.on("click", ".button-modal-mab-quests-delete", function () {
        const mabQuestId = $(this).attr("mab-quest-id");

        __global.MabQuestsDeleteRestoreModalController.OpenDeleteRestoreModal(
          mabQuestId,
          self.LoadAllMabQuests,
          true
        );
      });

      // Opens RESTORE MAB Quests MODAL
      self.DOM.on("click", ".button-modal-mab-quests-restore", function () {
        const mabQuestId = $(this).attr("mab-quest-id");

        __global.MabQuestsDeleteRestoreModalController.OpenDeleteRestoreModal(
          mabQuestId,
          self.LoadAllMabQuests,
          false
        );
      });

      // Closes MAB CARDS TABLE MODAL
      self.DOM.on(
        "click",
        "#button-x-mab-quests-db-close, #button-modal-mab-quests-db-close",
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
    self.LoadAllMabQuests();
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

  self.LoadAllMabQuests = () => {
    if ($.fn.DataTable.isDataTable(self.Table)) {
      self.Table.DataTable().destroy();
    }

    self.AddContentLoader();

    $.ajax({
      method: "GET",
      url: "https://localhost:7081/admins/mablistquests",
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
              <td class="text-start align-middle">No quests to be displayed...</td>              
            </tr>
          `);

          self.TableResult.append(tr);

          return;
        }

        $.each(response.content, function (index, item) {
          let npcs = item.mab_Npcs
            .map((npc) => {
              return `
                <div class="p-2">
                  <div class="list-group-item d-flex flex-row h-100 p-1"
                      style="background-color: var(--second-bg-color); color: var(--text-color);">
                    <div><strong>${npc.mab_NpcName}&nbsp;</strong></div>
                    <div>&nbsp;*${npc.mab_NpcLevel}</div>
                    <div>&nbsp;*${npc.mab_NpcCards}</div>                                 
                  </div>
                </div>
              `;
            })
            .join("");

          let npcsHtml = `
            <div class="d-flex flex-wrap justify-content-start gap-2">
              ${npcs}
            </div>
          `;

          let tr = $(`
            <tr class="align-middle"> 
            <td class="text-start align-middle">
                
            
              </td>   
              <td class="text-start align-middle">
                ${index}
              </td>
                    
              <td class="text-start align-middle">
                ${item.mab_QuestTitle} 
              </td>
            
              
              <td class="text-start align-middle">
                ${item.mab_QuestDescription}
              </td>
              
              <td class="text-center align-middle">
                ${item.mab_QuestLevel}
              </td>

              <td class="text-center align-middle">
                ${item.mab_GoldBounty}
              </td>

              <td class="text-center align-middle">
                ${item.mab_XpReward}
              </td>
              
              <td class="align-start">
                ${npcsHtml}
              </td> 

              <td class="align-start">
                ${item.mab_IsDeleted}
              </td>

              <td class="align-start">
                <div
                  class="d-flex flex-row align-self-center align-items-center justify-content-center w-90 gap-2"
                >
                  <button
                    id="button-modal-mab-quests-edit-${index}"
                    class="button-modal-mab-quests-edit btn btn-sm btn-outline-warning w-60"
                    mab-quest-id="${item.mab_QuestId}"
                  >
                    Edit
                  </button>

                  <button
                    id="button-modal-mab-quests-delete-${index}"
                    class="button-modal-mab-quests-delete btn btn-sm btn-outline-danger w-60"
                    mab-quest-id="${item.mab_QuestId}"
                  >
                    Delete
                  </button>

                  <button
                    id="button-modal-mab-quests-restore-${index}"
                    class="button-modal-mab-quests-restore btn btn-sm btn-outline-info w-60"
                    mab-quest-id="${item.mab_QuestId}"
                  >
                    Restore
                  </button>
                </div>
              </td>
            </tr>
          `);
          self.TableResult.append(tr);

          if (item.mab_IsDeleted === false) {
            tr.find("td").css("color", "var(--text-color)");
            $(`#button-modal-mab-quests-delete-${index}`).show();
            $(`#button-modal-mab-quests-restore-${index}`).hide();
          }
          if (item.mab_IsDeleted === true) {
            tr.find("td").css("color", "var(--reddish)");
            $(`#button-modal-mab-quests-delete-${index}`).hide();
            $(`#button-modal-mab-quests-restore-${index}`).show();
          }
        });

        self.Table.DataTable({
          columnDefs: [
            {
              orderable: false,
              targets: 0, // your row counter column (leave it as normal)
            },
            {
              className: "dtr-control",
              orderable: false,
              targets: 0, // put the responsive toggle in the last column instead
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
  (function (modalMabQuestsDB) {
    __global.MabQuestsDataBaseModalController = modalMabQuestsDB;
  })(new modal_Mab_Quests_DB())
);
