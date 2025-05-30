function modal_BG_Delete_Restore() {
  let self = this;
  self.IsBuilt = false;
  self.isDeleteMode = false;
  self.currentBoardGameId = null;
  self.onSuccessCallback = null;

  self.LoadReferences = () => {
    self.DOM = $("#bg-delete-restore-modal");

    self.ModalTitle = self.DOM.find("#delete-restore-modal-title");

    self.ModalBody = self.DOM.find(".modal-body");

    self.ModalBox = self.DOM.find("#bd-delete-restore-modalbox");

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
    }).then((result) => {
      redirectToUsersPage();
    });
  }

  self.FetchBoardGameDetails = () => {
    self.AddContentLoader();

    $.ajax({
      url: `https://localhost:7081/admins/showboardgamedetails?BoardGameId=${self.currentBoardGameId}`,
      method: "GET",
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          console.error(
            "Failed to fetch board game details:",
            response.message
          );
          return;
        }

        // Open the edit modal with the board game data
        if (self.isDeleteMode === false) {
          __global.BgDeleteRestoreModalController.RenderRestoreMode(
            response.content.boardGameName
          );
          self.RemoveContentLoader();
        } else {
          __global.BgDeleteRestoreModalController.RenderDeleteMode(
            response.content.boardGameName
          );
          self.RemoveContentLoader();
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching board game details:", error);
      },
    });
  };

  // Methods to fill the MODAL BODY with board game NAME
  self.RenderRestoreMode = (bgName) => {
    self.ModalBox.removeClass("delete-warning");
    self.ModalBox.addClass("restore-warning");

    // Update the modal title and button text
    self.ModalTitle.html(
      `<h5><span>R</span>estoring the following <span>B</span>oard <span>G</span>ame:</h5>`
    );

    // Fill in the MODAL BODY with the board game NAME
    self.ModalBody.html(`<h3><span>${bgName}</span></h3>`);
  };

  self.RenderDeleteMode = (bgName) => {
    self.ModalBox.removeClass("restore-warning");
    self.ModalBox.addClass("delete-warning");

    // Update the modal title and button text
    self.ModalTitle.html(
      `<h5><span style="color: var(--reddish)">D</span>eleting the following <span style="color: var(--reddish)">B</span>oard <span style="color: var(--reddish)">G</span>ame:</h5>`
    );

    // Fill in the MODAL BODY with the board game NAME
    self.ModalBody.html(
      `<h3><span style="color: var(--reddish)">${bgName}</span></h3>`
    );
  };

  self.SetUpDelete = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Confirm;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "DELETE",
      url: "https://localhost:7081/admins/deleteboardgame",
      data: JSON.stringify({
        BoardGameId: self.currentBoardGameId,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        sweetAlertSuccess(resp.message);

        // Re-enable button
        submitBtn.attr("disabled", false).text(originalBtnText);

        // Close the modal
        self.CloseModal();

        // Refresh the board games list
        if (self.onSuccessCallback) {
          self.onSuccessCallback();
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };

  self.SetUpRestore = () => {
    //Disable submit button to prevent double submissions
    const confirmBtn = self.Buttons.Confirm;
    const originalBtnText = confirmBtn.text();
    confirmBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/admins/restoreboardgame",
      data: JSON.stringify({
        BoardGameId: self.currentBoardGameId,
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

        // Refresh the board games list
        if (self.onSuccessCallback) {
          self.onSuccessCallback();
        }
      },
      error: (err) => {
        sweetAlertSuccess(err);
      },
      complete: () => {},
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
    boardGameId,
    onSuccessCallback,
    isDeletedMode
  ) => {
    self.currentBoardGameId = boardGameId;
    self.onSuccessCallback = onSuccessCallback;
    self.isDeleteMode = isDeletedMode;
    self.FetchBoardGameDetails();
    self.Show();
  };

  self.CloseModal = () => {
    self.currentBoardGameId = null;
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  self.BuildModal();
}
