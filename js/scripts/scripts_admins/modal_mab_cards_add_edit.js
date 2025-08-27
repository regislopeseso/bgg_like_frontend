function modal_Mab_Cards_Add_Edit() {
  let self = this;
  self.IsBuilt = false;
  self.isEditMode = false;
  self.currentMabCardId = null;
  self.onSuccessCallback = null;

  self.LoadReferences = () => {
    self.DOM = $("#dom-modal-mab-cards-add-edit");

    self.ModalTitle = self.DOM.find("#title-modal-mab-cards-add-edit");
    self.Form = $("#form-modal-mab-cards-add-edit");

    // Add a hidden input for the CATEGORY ID when in edit mode
    self.Form.append(
      '<input type="hidden" id="mab-card-id" name="MabCardId" value="">'
    );

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.Required =
      self.DOM.find(".required");
    self.Inputs[self.Inputs.length] = self.Inputs.MabCardId =
      self.DOM.find("#mab-card-id");
    self.Inputs[self.Inputs.length] = self.Inputs.MabCardName = self.DOM.find(
      "#input-modal-mab-cards-add-edit-cardname"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.MabCardPower = self.DOM.find(
      "#input-modal-mab-cards-add-edit-cardpower"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.MabCardUpperHand =
      self.DOM.find("#input-modal-mab-cards-add-edit-cardupperhand");

    self.Inputs[self.Inputs.length] = self.Inputs.MabCardType = self.DOM.find(
      "#input-select-modal-mab-cards-add-edit-cardtype"
    );

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Submit = self.DOM.find(
      "#button-modal-mab-cards-add-edit-submit"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Reset = self.DOM.find(
      "#button-modal-mab-cards-add-edit-reset"
    );
  };

  self.LoadEvents = () => {
    self.Buttons.Submit.on("click", function (e) {
      e.preventDefault();

      if (self.isEditMode === true) {
        self.SetUpEditMabCardForm();
      } else {
        self.SetUpAddMabCardForm();
      }
    });

    self.Buttons.Reset.on("click", function (e) {
      self.forceClearForm();
    });

    self.CheckForm();
  };

  self.LoadCardTypes = () => {
    // First destroy any existing select2 instance to prevent duplicates
    if (self.Inputs.MabCardType.hasClass("select2-hidden-accessible")) {
      self.Inputs.MabCardType.select2("destroy");
    }

    // Fetch the mab card types list once from the backend
    fetch("https://localhost:7081/admins/listmabcardtypes", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) {
          console.error("Failed to load card types:", data.message);
          return;
        }

        const mabCardTypes = data.content.map((item) => ({
          id: item.cardTypeValue,
          text: item.cardTypeName,
        }));

        self.Inputs.MabCardType.select2({
          data: mabCardTypes,
          dropdownParent: self.DOM,
          placeholder: "Select a card type",
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
  self.FetchMabCardDetails = (mabCardId) => {
    self.AddContentLoader();
    self.currentMabCardId = mabCardId;

    $.ajax({
      method: "GET",
      url: `https://localhost:7081/admins/showmabcarddetails?CardId=${mabCardId}`,
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          console.error("Failed to fetch category details:", response.message);
          return;
        }

        // Open the edit modal with the board game data
        __global.MabCardsAddEditModalController.PopulateFormForEditing(
          response.content
        );
        self.RemoveContentLoader();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching category details:", error);
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
      self.Inputs.MabCardName.focus();
    });
  };

  self.forceClearForm = () => {
    // Block form submission button
    self.Buttons.Submit.prop("disabled", true);

    //Clear form
    self.Inputs.forEach((input) => {
      input.val(null);
    });

    self.Inputs.MabCardType.val(null).trigger("change");
  };

  self.SetUpAddMabCardForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/admins/addmabcard",
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

        // Refresh the Cards list
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

  self.SetUpEditMabCardForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    // Get form values
    const mabCardId = self.currentMabCardId;

    const mabCardName = self.Inputs.MabCardName.val();
    const mabCardPower = self.Inputs.MabCardPower.val();
    const mabCardUpperHand = self.Inputs.MabCardUpperHand.val();
    const mabCardType = self.Inputs.MabCardType.val();

    $.ajax({
      url: "https://localhost:7081/admins/editmabcard",
      type: "PUT",
      data: JSON.stringify({
        CardId: mabCardId,
        CardName: mabCardName,
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
  self.PopulateFormForEditing = (mabCard) => {
    // Set the form to edit mode
    self.isEditMode = true;
    self.Inputs.MabCardId.val(mabCard.cardId);

    // Update the modal title and button text
    self.ModalTitle.html(
      "<strong><span>E</span>dit</strong> <span>M.</span>A.B. <span>C</span>ard"
    );
    self.Buttons.Submit.text("Update");

    // Fill in the form fields
    self.Inputs.MabCardName.val(mabCard.cardName).trigger("select");
    self.Inputs.MabCardPower.val(mabCard.cardPower);
    self.Inputs.MabCardUpperHand.val(mabCard.cardUpperHand);

    // Set card type (need to wait for select2 to be initialized)
    self.Inputs.MabCardType.val(mabCard.cardTypeValue).trigger("change");

    // Recheck form to enable submit button if needed
    self.checkFormFilling();
  };

  // Reset the form to "Add" mode
  self.ResetToAddMode = () => {
    self.isEditMode = false;
    self.currentMabCardId = null;
    self.ModalTitle.html(
      "<strong><span>C</span>reate</strong> <span>M.</span>A.B. <span>C</span>ard"
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
    self.LoadCardTypes();
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
  self.OpenEditModal = (mabCardId, onSuccessCallback) => {
    self.onSuccessCallback = onSuccessCallback;
    self.Show();
    self.FetchMabCardDetails(mabCardId);

    // Ensure focus is applied after modal is fully shown
    self.DOM.on("shown.bs.modal", function () {
      self.Inputs.MabCardName.focus();
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
