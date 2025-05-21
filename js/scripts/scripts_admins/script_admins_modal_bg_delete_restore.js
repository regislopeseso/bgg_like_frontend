function modal_BG_Delete_Restore() {
  let self = this;
  self.IsBuilt = false;
  /* NOVO */
  self.IsBuilt = false;
  /* NOVO */
  self.isDeleteMode = false;
  /* NOVO */
  self.currentBoardGameId = null;

  self.LoadReferences = () => {
    self.DOM = $("#bg-delete-restore-modal");

    self.ModalTitle = self.DOM.find("#delete-restore-modal-title");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Confirm = self.DOM.find(
      "#bg-delete-restore-confirm-button"
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

  self.SetUpDelete = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Confirm;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "DELETE",
      url: "https://localhost:7081/admins/deleteboardgame",
      data: self.Form.serialize(),

      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        alert(resp.message);

        // Refresh the board games list
        if (__global.BgDatabBaseModalController) {
          __global.BgDatabBaseModalController.LoadAllGames();
        }
      },
      error: (err) => {
        alert(err);
      },
      complete: () => {
        // Re-enable button
        submitBtn.attr("disabled", true).text(originalBtnText);
      },
    });
  };

  self.SetUpRestore = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Confirm;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/admins/restoreboardgame",
      data: self.Form.serialize(),

      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        alert(resp.message);

        // Refresh the board games list
        if (__global.BgDatabBaseModalController) {
          __global.BgDatabBaseModalController.LoadAllGames();
        }
      },
      error: (err) => {
        alert(err);
      },
      complete: () => {
        // Re-enable button
        submitBtn.attr("disabled", true).text(originalBtnText);
      },
    });
  };

  // Reset the form to "Add" mode
  self.ResetToDeleteMode = () => {
    self.isEditMode = false;
    self.currentBoardGameId = null;
    self.ModalTitle.html(
      "<span>A</span>dd a new <span>B</span>oard <span>G</span>ame"
    );
    self.Buttons.Submit.text("Confirm");
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

  self.OpenDeleteModal = () => {
    self.ResetToDeleteMode();
    self.Show();
  };

  // New method to open the modal in edit mode
  self.OpenRestoreModal = (boardGameData) => {
    self.Show();
    self.FetchBoardGameDetails(boardGameData);
  };

  self.CloseModal = () => {};

  self.BuildModal();
}
