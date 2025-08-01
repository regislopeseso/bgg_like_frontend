function modal_Mab_Cards_Delete_Restore() {
  let self = this;
  self.IsBuilt = false;
  self.isDeleteMode = false;
  self.currentMabCardId = null;
  self.onSuccessCallback = null;

  self.LoadReferences = () => {
    self.DOM = $("#dom-modal-mab-cards-delete-restore");

    self.ModalTitle = self.DOM.find("#title-modal-mab-cards-delete-restore");

    self.ModalBody = self.DOM.find(".modal-body");

    self.ModalBox = self.DOM.find("#modalbox-modal-mab-cards-delete-restore");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Confirm = self.DOM.find(
      "#button-modal-mab-cards-delete-restore-confirm"
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

  self.FetchMabCardDetails = () => {
    self.AddContentLoader();

    $.ajax({
      method: "GET",
      url: `https://localhost:7081/admins/showmabcarddetails?CardId=${self.currentMabCardId}`,
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          sweetAlertError("Failed to fetch card details:", response.message);
          return;
        }

        // Open the edit modal with the board game data
        if (self.isDeleteMode === false) {
          __global.MabCardsDeleteModalController.RenderRestoreMode(
            response.content.cardName
          );
          self.RemoveContentLoader();
        } else {
          __global.MabCardsDeleteModalController.RenderDeleteMode(
            response.content.cardName
          );
          self.RemoveContentLoader();
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching card details:", error);
      },
    });
  };

  // Methods to fill the MODAL BODY with CARD NAME
  self.RenderDeleteMode = (cardName) => {
    self.ModalBox.removeClass("restore-warning");
    self.ModalBox.addClass("delete-warning");

    // Update the modal title and button text
    self.ModalTitle.html(
      `<h5><span style="color: var(--reddish)">D</span>eleting the following <span style="color: var(--reddish)">C</span>ard</h5>`
    );

    // Fill in the MODAL BODY with the CATEGORY NAME
    self.ModalBody.html(
      `<h3><span style="color: var(--reddish)">${cardName}</span></h3>`
    );
  };

  self.RenderRestoreMode = (cardName) => {
    self.ModalBox.removeClass("delete-warning");
    self.ModalBox.addClass("restore-warning");

    // Update the modal title and button text
    self.ModalTitle.html(
      `<h5><span>R</span>estoring the following <span>C</span>ard:</h5>`
    );

    // Fill in the MODAL BODY with the card NAME
    self.ModalBody.html(`<h3><span>${cardName}</span></h3>`);
  };

  self.SetUpDelete = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Confirm;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "DELETE",
      url: "https://localhost:7081/admins/deletemabcard",
      data: JSON.stringify({
        CardId: self.currentMabCardId,
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
      url: "https://localhost:7081/admins/restoremabcard",
      data: JSON.stringify({
        CardId: self.currentMabCardId,
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
        sweetAlertSuccess(err);
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
    mabCardId,
    onSuccessCallback,
    isDeletedMode
  ) => {
    self.currentMabCardId = mabCardId;
    self.onSuccessCallback = onSuccessCallback;
    self.isDeleteMode = isDeletedMode;
    self.FetchMabCardDetails();
    self.Show();
  };

  self.CloseModal = () => {
    self.currentMabCardId = null;
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  self.BuildModal();
}
