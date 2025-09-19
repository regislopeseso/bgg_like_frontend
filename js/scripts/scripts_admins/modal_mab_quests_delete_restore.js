function modal_Mab_Quests_Delete_Restore() {
  let self = this;
  self.IsBuilt = false;
  self.isDeleteMode = false;
  self.currentQuestId = null;
  self.onSuccessCallback = null;

  self.LoadReferences = () => {
    self.DOM = $("#dom-modal-mab-quests-delete-restore");

    self.ModalTitle = self.DOM.find("#title-modal-mab-quests-delete-restore");

    self.ModalBody = self.DOM.find(".modal-body");

    self.ModalBox = self.DOM.find("#modalbox-modal-mab-quests-delete-restore");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Confirm = self.DOM.find(
      "#button-modal-mab-quests-delete-restore-confirm"
    );
  };

  self.LoadEvents = () => {
    self.Buttons.Confirm.on("click", function (e) {
      e.preventDefault();

      if (self.isDeleteMode === true) {
        self.SetUpDelete();
      } else {
        self.SetUpRestore();
      }
    });
  };

  self.AddContentLoader = () => {
    self.DOM.loadcontent("charge-contentloader");
  };
  self.RemoveContentLoader = () => {
    self.DOM.loadcontent("demolish-contentloader");
  };

  function sweetAlertSuccess(title_text, message_text) {
    Swal.fire({
      position: "center",
      confirmButtonText: "OK!",
      icon: "success",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  function sweetAlertWarning(title_text, message_text) {
    Swal.fire({
      position: "center",
      confirmButtonText: "OK!",
      icon: "warning",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: false,
      timer: 1500,
    });
  }
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

  self.Quest_FetchDetails = () => {
    self.AddContentLoader();

    $.ajax({
      method: "GET",
      url: `https://localhost:7081/admins/mabshowquestdetails?Mab_QuestId=${self.currentQuestId}`,
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          sweetAlertError("Failed to fetch quest details:", response.message);
          return;
        }

        // Open the edit modal with the board game data
        if (self.isDeleteMode === false) {
          __global.MabQuestsDeleteRestoreModalController.RenderRestoreMode(
            response.content.mab_QuestTitle
          );
          self.RemoveContentLoader();
        } else {
          __global.MabQuestsDeleteRestoreModalController.RenderDeleteMode(
            response.content.mab_QuestTitle
          );

          self.RemoveContentLoader();
        }
      },
      error: function (xhr, status, error) {
        sweetAlertError("Error fetching quest details:", error);
      },
    });
  };

  // Methods to fill the MODAL BODY with NPC NAME
  self.RenderDeleteMode = (questTitle) => {
    self.ModalBox.removeClass("restore-warning");
    self.ModalBox.addClass("delete-warning");

    // Update the modal title and button text
    self.ModalTitle.html(
      `<h5><span style="color: var(--reddish)">D</span>eleting the following <span style="color: var(--reddish)">Q</span>uest</h5>`
    );

    // Fill in the MODAL BODY with the Quest title
    self.ModalBody.html(
      `<h3><span style="color: var(--reddish)">${questTitle}</span></h3>`
    );
  };

  self.RenderRestoreMode = (questTitle) => {
    self.ModalBox.removeClass("delete-warning");
    self.ModalBox.addClass("restore-warning");

    // Update the modal title and button text
    self.ModalTitle.html(
      `<h5><span>R</span>estoring the following <span>Q</span>uest:</h5>`
    );

    // Fill in the MODAL BODY with the Quest Title
    self.ModalBody.html(`<h3><span>${questTitle}</span></h3>`);
  };

  self.SetUpDelete = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Confirm;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "DELETE",
      url: "https://localhost:7081/admins/mabdeletequest",
      data: JSON.stringify({
        Mab_QuestId: self.currentQuestId,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        sweetAlertWarning(resp.message);

        // Re-enable button
        submitBtn.attr("disabled", false).text(originalBtnText);

        // Close the modal
        self.CloseModal();

        // Refresh the CATEGORY list
        if (self.onSuccessCallback) {
          self.onSuccessCallback();
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };

  self.SetUpRestore = () => {
    //Disable submit button to prevent double submissions
    const confirmBtn = self.Buttons.Confirm;
    const originalBtnText = confirmBtn.text();
    confirmBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/admins/mabrestorequest",
      data: JSON.stringify({
        Mab_QuestId: self.currentQuestId,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        sweetAlertSuccess(resp.message);

        // Re-enable button
        confirmBtn.attr("disabled", false).text(originalBtnText);

        // Close the modal
        self.CloseModal();

        // Refresh the cards list
        if (self.onSuccessCallback) {
          self.onSuccessCallback();
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
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

  self.BuildModal = () => {
    if (self.IsBuilt == true) {
      return;
    }

    self.LoadReferences();
    self.LoadEvents();
    self.IsBuilt = true;
  };

  self.OpenDeleteRestoreModal = (
    mabQuestId,
    onSuccessCallback,
    isDeletedMode
  ) => {
    self.currentQuestId = mabQuestId;
    self.onSuccessCallback = onSuccessCallback;
    self.isDeleteMode = isDeletedMode;
    self.Quest_FetchDetails();
    self.Show();
  };

  self.CloseModal = () => {
    self.currentQuestId = null;
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  self.BuildModal();
}
