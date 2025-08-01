function modal_Mab_Npcs_Delete_Restore() {
  let self = this;
  self.IsBuilt = false;
  self.isDeleteMode = false;
  self.currentMabNpcId = null;
  self.onSuccessCallback = null;

  self.LoadReferences = () => {
    self.DOM = $("#dom-modal-mab-npcs-delete-restore");

    self.ModalTitle = self.DOM.find("#title-modal-mab-npcs-delete-restore");

    self.ModalBody = self.DOM.find(".modal-body");

    self.ModalBox = self.DOM.find("#modalbox-modal-mab-npcs-delete-restore");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Confirm = self.DOM.find(
      "#button-modal-mab-npcs-delete-restore-confirm"
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

  self.FetchMabNpcDetails = () => {
    self.AddContentLoader();

    $.ajax({
      method: "GET",
      url: `https://localhost:7081/admins/showmabnpcdetails?NpcId=${self.currentMabNpcId}`,
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          sweetAlertError("Failed to fetch npc details:", response.message);
          return;
        }

        // Open the edit modal with the board game data
        if (self.isDeleteMode === false) {
          __global.MabNpcsDeleteModalController.RenderRestoreMode(
            response.content.npcName
          );
          self.RemoveContentLoader();
        } else {
          __global.MabNpcsDeleteModalController.RenderDeleteMode(
            response.content.npcName
          );

          self.RemoveContentLoader();
        }
      },
      error: function (xhr, status, error) {
        sweetAlertError("Error fetching card details:", error);
      },
    });
  };

  // Methods to fill the MODAL BODY with NPC NAME
  self.RenderDeleteMode = (npcName) => {
    self.ModalBox.removeClass("restore-warning");
    self.ModalBox.addClass("delete-warning");

    // Update the modal title and button text
    self.ModalTitle.html(
      `<h5><span style="color: var(--reddish)">D</span>eleting the following <span style="color: var(--reddish)">N</span>pc</h5>`
    );

    // Fill in the MODAL BODY with the Npc name
    self.ModalBody.html(
      `<h3><span style="color: var(--reddish)">${npcName}</span></h3>`
    );
  };

  self.RenderRestoreMode = (npcName) => {
    self.ModalBox.removeClass("delete-warning");
    self.ModalBox.addClass("restore-warning");

    // Update the modal title and button text
    self.ModalTitle.html(
      `<h5><span>R</span>estoring the following <span>N</span>pc:</h5>`
    );

    // Fill in the MODAL BODY with the npc NAME
    self.ModalBody.html(`<h3><span>${npcName}</span></h3>`);
  };

  self.SetUpDelete = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Confirm;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "DELETE",
      url: "https://localhost:7081/admins/deletemabnpc",
      data: JSON.stringify({
        NpcId: self.currentMabNpcId,
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
      url: "https://localhost:7081/admins/restoremabnpc",
      data: JSON.stringify({
        NpcId: self.currentMabNpcId,
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
    mabNpcId,
    onSuccessCallback,
    isDeletedMode
  ) => {
    self.currentMabNpcId = mabNpcId;
    self.onSuccessCallback = onSuccessCallback;
    self.isDeleteMode = isDeletedMode;
    self.FetchMabNpcDetails();
    self.Show();
  };

  self.CloseModal = () => {
    self.currentMabNpcId = null;
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  self.BuildModal();
}
