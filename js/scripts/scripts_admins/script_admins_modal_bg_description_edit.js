function modal_BG_Description_Edit() {
  let self = this;
  self.IsBuilt = false;
  self.currentBoardGameId = null;

  self.KeepBgName = null;
  self.KeepBgNameBgMinPlayers = null;
  self.KeepBgNameBgMaxPlayers = null;
  self.KeepBgNameBgMinAge = null;
  self.KeepCategory = null;
  self.KeepMechanics = null;

  self.LoadReferences = () => {
    self.DOM = $("#bg-description-edit-modal");

    self.ModalTitle = self.DOM.find("#description-edit-modal-title");
    self.Form = $("#bg-description-edit-form");

    // Add a hidden input for the board game ID when in edit mode
    self.Form.append(
      '<input type="hidden" id="board-game-id" name="BoardGameId" value="">'
    );

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.Required =
      self.DOM.find(".required");
    self.Inputs[self.Inputs.length] = self.Inputs.BgId =
      self.DOM.find("#board-game-id");
    self.Inputs[self.Inputs.length] = self.Inputs.BgDescription = self.DOM.find(
      "#edited-bg-description"
    );

    self.ButtonsBox = self.DOM.find("#bg-description-buttons-box");
    self.Buttons = [];

    self.Buttons[self.Buttons.length] = self.Buttons.Submit = self.DOM.find(
      "#bg-description-submit-button"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Reset = self.DOM.find(
      "#reset-description-edit-bg-form"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Close = self.DOM.find(
      "#bg-description-edit-close-button"
    );
  };

  self.LoadEvents = () => {
    self.Buttons.Submit.on("click", function (e) {
      e.preventDefault();
      self.SetUpEditBgDescriptionForm();
    });

    self.Buttons.Reset.on("click", function (e) {
      self.forceClearForm();
    });

    self.Buttons.Close.on("click", function (e) {
      self.CloseModal();
    });

    self.CheckForm();
  };

  // New method to fetch board game details for editing
  self.FetchBoardGameDetails = (boardGameId) => {
    self.AddContentLoader();
    self.currentBoardGameId = boardGameId;

    $.ajax({
      url: `https://localhost:7081/admins/showboardgamedetails?BoardGameId=${boardGameId}`,
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
        __global.BgDescriptionEditModalController.PopulateFormForEditing(
          response.content
        );
        self.RemoveContentLoader();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching board game details:", error);
      },
    });
  };

  self.checkFormFilling = () => {
    let areFieldsFilled = true;

    self.Inputs.Required.each(function () {
      const value = $(this).val();

      // Skip check if value is null or empty string
      if (
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)
      ) {
        areFieldsFilled = false;
      }
    });

    self.Buttons.Submit.prop("disabled", !areFieldsFilled);
  };

  self.CheckForm = () => {
    // React to typing in any input
    self.Inputs.Required.on("input", self.checkFormFilling);
    // React to clicking on the clear button:
    self.Buttons.Reset.on("click", () => {
      self.forceClearForm();

      self.Inputs.BgDescription.focus();
    });
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
    }).then((result) => {
      redirectToUsersPage();
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

  self.forceClearForm = () => {
    // Block form submission button
    self.Buttons.Submit.prop("disabled", true);

    //Clear form
    self.Inputs.forEach((input) => {
      input.val(null);
    });
  };

  self.SetUpEditBgDescriptionForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    // Get form values
    const boardGameId = self.currentBoardGameId;
    const boardGameName = self.KeepBgName;
    const boardGameDescription = self.Inputs.BgDescription.val();
    const minPlayersCount = self.KeepBgNameBgMinPlayers;
    const maxPlayersCount = self.KeepBgNameBgMaxPlayers;
    const minAge = self.KeepBgNameBgMinAge;
    const category = self.KeepCategory;
    const mechanics = self.KeepMechanics;

    $.ajax({
      url: "https://localhost:7081/admins/editboardgame",
      type: "PUT",
      data: JSON.stringify({
        BoardGameId: boardGameId,
        BoardGameName: boardGameName,
        BoardGameDescription: boardGameDescription,
        MinPlayersCount: minPlayersCount,
        MaxPlayersCount: maxPlayersCount,
        MinAge: minAge,
        CategoryId: category,
        MechanicIds: mechanics,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        sweetAlertSuccess(resp.message);

        // Reset form and exit edit mode
        self.forceClearForm();

        // Close the modal
        self.CloseModal();

        // Refresh the board games list
        if (__global.BgDataBaseModalController) {
          __global.BgDataBaseModalController.LoadAllGames();
        }

        self.forceClearForm();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        // Re-enable button
        submitBtn.attr("disabled", true).text(originalBtnText);
      },
    });
  };

  // Method to fill the form with board game data for editing
  self.PopulateFormForEditing = (boardGame) => {
    // Set the form to edit mode
    self.isEditMode = true;
    self.Inputs.BgId = boardGame.boardGameId;
    self.Inputs.BgDescription.val(boardGame.boardGameDescription);
    self.KeepBgName = boardGame.boardGameName;
    self.KeepBgNameBgMinPlayers = boardGame.minPlayersCount;
    self.KeepBgNameBgMaxPlayers = boardGame.maxPlayerCount;
    self.KeepBgNameBgMinAge = boardGame.minAge;
    self.KeepCategory = boardGame.category;
    self.KeepMechanics = boardGame.mechanics;

    // Update the modal title and button text
    let firstLetter = self.KeepBgName.charAt(0).toUpperCase();
    let restOfString = self.KeepBgName.slice(1);
    self.ModalTitle.html(`<h3><span>${firstLetter}</span>${restOfString}</h3>`);
    self.Buttons.Submit.text("Update");

    // Recheck form to enable submit button if needed
    self.checkFormFilling();
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

  self.AddContentLoader = () => {
    self.DOM.loadcontent("charge-contentloader");
  };
  self.RemoveContentLoader = () => {
    self.DOM.loadcontent("demolish-contentloader");
  };

  // New method to open the modal in edit mode
  self.OpenDescriptionModal = (boardGameId) => {
    self.Show();
    self.FetchBoardGameDetails(boardGameId);

    // Ensure focus is applied after modal is fully shown
    self.DOM.on("shown.bs.modal", function () {
      self.Inputs.BgDescription.focus();
    });
  };

  self.CloseModal = () => {
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      self.forceClearForm();

      modalInstance.hide();
    }
  };

  self.BuildModal();
}
