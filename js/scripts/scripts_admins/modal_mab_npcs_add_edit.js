function modal_Mab_Npcs_Add_Edit() {
  let self = this;
  self.IsBuilt = false;
  self.isEditMode = false;
  self.currentMabNpcId = null;
  self.onSuccessCallback = null;

  self.LoadReferences = () => {
    self.DOM = $("#dom-modal-mab-npcs-add-edit");

    self.ModalTitle = self.DOM.find("#title-modal-mab-npcs-add-edit");
    self.Form = $("#form-modal-mab-npcs-add-edit");

    // Add a hidden input for the CATEGORY ID when in edit mode
    self.Form.append(
      '<input type="hidden" id="mab-npc-id" name="MabNpcId" value="">'
    );

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.Required =
      self.DOM.find(".required");
    self.Inputs[self.Inputs.length] = self.Inputs.MabNpcId =
      self.DOM.find("#mab-npc-id");
    self.Inputs[self.Inputs.length] = self.Inputs.MabNpcName = self.DOM.find(
      "#input-modal-mab-npcs-add-edit-npcname"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.MabNpcDescription =
      self.DOM.find("#input-modal-mab-npcs-add-edit-npcdescription");
    self.Inputs[self.Inputs.length] = self.Inputs.MabNpcLevel = self.DOM.find(
      "#input-modal-mab-npcs-add-edit-npclevel"
    );

    self.Inputs[self.Inputs.length] = self.Inputs.MabNpcCards = self.DOM.find(
      "#input-select-modal-mab-npcs-add-edit-npccards"
    );

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Submit = self.DOM.find(
      "#button-modal-mab-npcs-add-edit-submit"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Reset = self.DOM.find(
      "#button-modal-mab-npcs-add-edit-reset"
    );
  };

  self.LoadEvents = () => {
    self.Buttons.Submit.on("click", function (e) {
      e.preventDefault();

      if (self.isEditMode === true) {
        self.SetUpEditMabNpcForm();
      } else {
        self.SetUpAddMabNpcForm();
      }
    });

    self.Buttons.Reset.on("click", function (e) {
      self.forceClearForm();
    });

    self.CheckForm();
  };

  self.loadMabCards = () => {
    // First destroy any existing select2 instance to prevent duplicates
    if (self.Inputs.MabNpcCards.hasClass("select2-hidden-accessible")) {
      self.Inputs.MabNpcCards.select2("destroy");
    }

    // Fetch the mab card types list once from the backend
    fetch("https://localhost:7081/admins/listmabcards", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) {
          sweetAlertError("Failed to load mab cards:", data.message);
          return;
        }

        const mabNpcCards = data.content.map((item) => ({
          id: item.npcId,
          text: item.cardName,
        }));

        self.Inputs.MabNpcCards.select2({
          data: mabNpcCards,
          dropdownParent: self.DOM,
          placeholder: "Select a card",
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
        console.error("Error fetching card types:", err);
      });
  };

  // New method to fetch Mab Card details for editing
  self.FetchMabNpcDetails = (mabNpcId) => {
    self.AddContentLoader();
    self.currentMabNpcId = mabNpcId;

    $.ajax({
      method: "GET",
      url: `https://localhost:7081/admins/showmabnpcdetails?NpcId=${mabNpcId}`,
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          sweetAlertError(
            "Failed to fetch category details:",
            response.message
          );
          return;
        }

        // Open the edit modal with the mab NPC data
        __global.MabNpcsAddEditModalController.PopulateFormForEditing(
          response.content
        );
        self.RemoveContentLoader();
      },
      error: function (xhr, status, error) {
        sweetAlertError("Error fetching mab npc details:", error);
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
      self.Inputs.MabNpcName.focus();
    });
  };

  self.forceClearForm = () => {
    // Block form submission button
    self.Buttons.Submit.prop("disabled", true);

    //Clear form
    self.Inputs.forEach((input) => {
      input.val(null);
    });

    self.Inputs.MabNpcCards.val(null).trigger("change");
  };

  self.SetUpAddMabNpcForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/admins/addmabnpc",
      data: self.Form.serialize(),
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }
        sweetAlertSuccess(resp.message);

        self.forceClearForm();

        self.CloseModal();

        // Refresh the CATEGORY list
        if (self.onSuccessCallback) {
          self.onSuccessCallback();
        }
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

  self.SetUpEditMabNpcForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    // Get form values
    const mabNpcId = self.currentMabNpcId;

    const mabNpcName = self.Inputs.MabNpcName.val();
    const mabCardPower = self.Inputs.MabNpcDescription.val();
    const mabCardUpperHand = self.Inputs.MabNpcLevel.val();
    const mabCardType = self.Inputs.MabNpcCards.val();

    $.ajax({
      url: "https://localhost:7081/admins/editmabcard",
      type: "PUT",
      data: JSON.stringify({
        CardId: mabNpcId,
        CardName: mabNpcName,
        CardPower: mabCardPower,
        CardUpperHand: mabCardUpperHand,
        CardType: mabCardType,
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
        if (__global.MabCardsDataBaseModalController) {
          __global.MabCardsDataBaseModalController.LoadAllMabCards();
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

  // Method to fill the form with CATEGORY data for editing
  self.PopulateFormForEditing = (mabNpc) => {
    // Set the form to edit mode
    self.isEditMode = true;
    self.Inputs.MabNpcId.val(mabNpc.npcId);

    // Update the modal title and button text
    self.ModalTitle.html("<span>E</span>dit <span>N</span>pc");
    self.Buttons.Submit.text("Update");

    // Fill in the form fields
    self.Inputs.MabNpcName.val(mabNpc.npcName);
    self.Inputs.MabNpcDescription.val(mabNpc.npcDescription);
    self.Inputs.MabNpcLevel.val(mabNpc.npcLevel);

    // Set card type (need to wait for select2 to be initialized)
    self.Inputs.MabNpcCards.val(mabNpc.npcDeck).trigger("change");

    // Recheck form to enable submit button if needed
    self.checkFormFilling();
  };

  // Reset the form to "Add" mode
  self.ResetToAddMode = () => {
    self.isEditMode = false;
    self.currentMabNpcId = null;
    self.ModalTitle.html("<span>C</span>reate a <span>N</span>pc");
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
    self.loadMabCards();
    self.IsBuilt = true;
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
    });
  }

  self.OpenAddModal = (onSuccessCallback) => {
    self.onSuccessCallback = onSuccessCallback;
    self.ResetToAddMode();
    self.forceClearForm();
    self.Show();
  };

  // New method to open the modal in edit mode
  self.OpenEditModal = (mabNpcId, onSuccessCallback) => {
    self.onSuccessCallback = onSuccessCallback;
    self.Show();
    self.FetchMabNpcDetails(mabNpcId);

    // Ensure focus is applied after modal is fully shown
    self.DOM.on("shown.bs.modal", function () {
      self.Inputs.MabNpcName.focus();
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
