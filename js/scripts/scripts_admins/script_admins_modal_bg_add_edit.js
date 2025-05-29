function modal_BG_Add_Edit() {
  let self = this;
  self.IsBuilt = false;
  /* NOVO */
  self.IsBuilt = false;
  /* NOVO */
  self.isEditMode = false;
  /* NOVO */
  self.currentBoardGameId = null;

  self.LoadReferences = () => {
    self.DOM = $("#bg-add-edit-modal");

    self.ModalTitle = self.DOM.find("#edit-modal-title");
    self.Form = $("#bg-add-edit-form");

    // Add a hidden input for the board game ID when in edit mode
    self.Form.append(
      '<input type="hidden" id="board-game-id" name="BoardGameId" value="">'
    );

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.Required =
      self.DOM.find(".required");
    self.Inputs[self.Inputs.length] = self.Inputs.BgId =
      self.DOM.find("#board-game-id");
    self.Inputs[self.Inputs.length] = self.Inputs.BgName =
      self.DOM.find("#new-bg-name");
    self.Inputs[self.Inputs.length] = self.Inputs.BgDescription = self.DOM.find(
      "#new-bg-description"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.BgMinPlayers = self.DOM.find(
      "#new-bg-min-players"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.BgMaxPlayers = self.DOM.find(
      "#new-bg-max-players"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.BgMinAge =
      self.DOM.find("#new-bg-min-age");

    self.SelectCategory = $("#new-bg-category-select");
    self.SelectMechanics = $("#new-bg-mechanics-select");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Submit =
      self.DOM.find("#bg-submit-button");
    self.Buttons[self.Buttons.length] = self.Buttons.Reset = self.DOM.find(
      "#reset-add-edit-bg-form"
    );
  };

  self.LoadEvents = () => {
    self.Buttons.Submit.on("click", function (e) {
      e.preventDefault();

      if (self.isEditMode === true) {
        self.SetUpEditBgForm();
      } else {
        self.SetUpAddBgForm();
      }
    });

    self.Buttons.Reset.on("click", function (e) {
      self.forceClearForm();
    });

    self.CheckForm();
  };

  self.loadCategories = () => {
    // First destroy any existing select2 instance to prevent duplicates
    if ($("#new-bg-category-select").hasClass("select2-hidden-accessible")) {
      $("#new-bg-category-select").select2("destroy");
    }

    // Fetch the category list once from the backend
    fetch("https://localhost:7081/admins/listcategories", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) {
          console.error("Failed to load categories:", data.message);
          return;
        }

        const categories = data.content.map((item) => ({
          id: item.categoryId,
          text: item.name,
        }));

        $("#new-bg-category-select").select2({
          data: categories,
          dropdownParent: self.DOM,
          placeholder: "Select a category",
          allowClear: true,
          theme: "classic",
          width: "100%",
          templateSelection: (data) => {
            if (!data.id) return data.text;
            return $("<strong>").text(data.text);
          },
        });
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  };

  self.loadMechanics = () => {
    // First destroy any existing select2 instance to prevent duplicates
    if ($("#new-bg-mechanics-select").hasClass("select2-hidden-accessible")) {
      $("#new-bg-mechanics-select").select2("destroy");
    }

    // First, fetch the mechanics list once from the backend
    fetch("https://localhost:7081/admins/listmechanics", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) {
          console.error("Failed to load mechanics:", data.message);
          return;
        }

        const mechanics = data.content.map((item) => ({
          id: item.mechanicId,
          text: item.name,
        }));

        $("#new-bg-mechanics-select").select2({
          data: mechanics,
          dropdownParent: self.DOM,
          placeholder: "Select mechanics",
          allowClear: false,
          theme: "classic",
          width: "100%",
          templateSelection: (data) => {
            if (!data.id) return data.text;
            return $("<strong>").text(data.text);
          },
        });
      })
      .catch((err) => {
        console.error("Error fetching mechanics:", err);
      });
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
        __global.BgEditModalController.PopulateFormForEditing(response.content);
        self.RemoveContentLoader();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching board game details:", error);
      },
    });
  };

  self.checkFormFilling = () => {
    let areFieldsFilled = true;

    const isCategorySelected =
      self.SelectCategory.val() !== null && self.SelectCategory.val() !== "";

    const areMechanicsSelected =
      self.SelectMechanics.val() !== null && self.SelectMechanics.val() !== "";

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

    self.Buttons.Submit.prop(
      "disabled",
      !(areFieldsFilled && isCategorySelected && areMechanicsSelected)
    );
  };

  self.CheckForm = () => {
    // React to mechanics selection
    self.SelectMechanics.on("select2:select", self.checkFormFilling);
    self.SelectMechanics.on("select2:clear", () => {
      self.checkFormFilling();
    });
    // React to category selection
    self.SelectCategory.on("select2:select", self.checkFormFilling);
    self.SelectCategory.on("select2:clear", () => {
      self.checkFormFilling();
    });
    // React to typing in any input
    self.Inputs.Required.on("input", self.checkFormFilling);
    // React to clicking on the clear button:
    self.Buttons.Reset.on("click", () => {
      self.forceClearForm();
      self.Inputs.BgName.focus();
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

    // Clear hidden board game ID (unecessary!)
    // self.BoardGameIdInput.val("");

    // Clear catergory and mechanics selection
    self.SelectCategory.trigger("change");
    //self.SelectMechanics.trigger("change");
    self.SelectMechanics.trigger("change");
  };

  self.SetUpAddBgForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/admins/addboardgame",
      data: self.Form.serialize(),

      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        self.forceClearForm();

        sweetAlertSuccess(resp.message);

        // Refresh the board games list
        if (__global.BgDataBaseModalController) {
          __global.BgDataBaseModalController.LoadAllGames();
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        // Re-enable button
        submitBtn.attr("disabled", true).text(originalBtnText);
        self.Inputs.BgName.focus();
      },
    });
  };

  self.SetUpEditBgForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    // Get form values
    const boardGameId = self.currentBoardGameId;
    const boardGameName = $("#new-bg-name").val();
    const boardGameDescription = $("#new-bg-description").val();
    const minPlayersCount = $("#new-bg-min-players").val();
    const maxPlayersCount = $("#new-bg-max-players").val();
    const minAge = $("#new-bg-min-age").val();
    const category = $("#new-bg-category-select").val();
    const mechanics = $("#new-bg-mechanics-select").val();

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
        self.ResetToAddMode();

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

    // Update the modal title and button text
    self.ModalTitle.html(
      "<span>E</span>dit <span>B</span>oard <span>G</span>ame"
    );
    self.Buttons.Submit.text("Update");

    // Set the hidden board game ID
    //self.Inputs.BgId.val(boardGame.boardGameId);

    // Fill in the form fields
    self.Inputs.BgName.val(boardGame.boardGameName);
    self.Inputs.BgDescription.val(boardGame.boardGameDescription);
    self.Inputs.BgMinPlayers.val(boardGame.minPlayersCount);
    self.Inputs.BgMaxPlayers.val(boardGame.maxPlayerCount);
    self.Inputs.BgMinAge.val(boardGame.minAge);

    // Set category (need to wait for select2 to be initialized)
    self.SelectCategory.val(boardGame.category).trigger("change");

    // Set mechanics (need to wait for select2 to be initialized)
    self.SelectMechanics.val(boardGame.mechanics).trigger("change");

    // Recheck form to enable submit button if needed
    self.checkFormFilling();
  };

  // Reset the form to "Add" mode
  self.ResetToAddMode = () => {
    self.isEditMode = false;
    self.currentBoardGameId = null;
    self.ModalTitle.html(
      "<span>A</span>dd a <span>N</span>ew <span>B</span>oard <span>G</span>ame"
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
    // Ensure focus is applied after modal is fully shown
    self.DOM.on("shown.bs.modal", function () {
      self.Inputs.BgName.focus();
    });
  };

  self.BuildModal = () => {
    if (self.IsBuilt == true) {
      return;
    }

    self.LoadReferences();
    self.loadCategories();
    self.loadMechanics();
    self.LoadEvents();
    self.IsBuilt = true;
  };

  self.AddContentLoader = () => {
    self.DOM.loadcontent("charge-contentloader");
  };
  self.RemoveContentLoader = () => {
    self.DOM.loadcontent("demolish-contentloader");
  };

  self.OpenAddModal = () => {
    self.ResetToAddMode();
    self.forceClearForm();
    self.Show();
  };

  // New method to open the modal in edit mode
  self.OpenEditModal = (boardGameId) => {
    self.Show();
    self.FetchBoardGameDetails(boardGameId);
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
