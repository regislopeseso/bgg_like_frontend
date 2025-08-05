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

    self.SelectBlock = self.DOM.find(
      "#div-select-modal-mab-npcs-add-edit-npccards"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.SelectMabCard = self.DOM.find(
      "#input-select-modal-mab-npcs-add-edit-npccards"
    );

    self.CardsListBlock = self.DOM.find(
      "#div-cardsList-modal-mab-npcs-add-edit-npccards"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.MabNpcCardsList =
      self.DOM.find("#ol-select-modal-mab-npcs-add-edit-npccards");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.AddNpcMabCard =
      self.DOM.find("#button-modal-mab-npcs-addcard");
    self.Buttons[self.Buttons.length] = self.Buttons.Submit = self.DOM.find(
      "#button-modal-mab-npcs-add-edit-submit"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Reset = self.DOM.find(
      "#button-modal-mab-npcs-add-edit-reset"
    );
  };

  self.LoadEvents = () => {
    self.Buttons.AddNpcMabCard.on("click", (e) => {
      e.preventDefault();

      console.log("oi");
    });

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
    if (self.Inputs.SelectMabCard.hasClass("select2-hidden-accessible")) {
      self.Inputs.SelectMabCard.select2("destroy");
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

        const mabCards = data.content.map((item) => ({
          id: item.cardId,
          text: item.cardName,
        }));

        self.Inputs.SelectMabCard.select2({
          data: mabCards,
          dropdownParent: self.DOM,
          placeholder: "Select 5 cards",
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

    self.Inputs.SelectMabCard.val(null).trigger("change");
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
    const mabCardType = self.Inputs.SelectMabCard.val();

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

  self.PopulateFormForEditing = (mabNpc) => {
    // Set the form to edit mode
    self.isEditMode = true;
    self.Inputs.MabNpcId.val(mabNpc.npcId);

    // Update the modal title and button text
    self.ModalTitle.html(
      "<strong><span>E</span>dit</strong> <span>M.</span>A.B. <span>N</span>pc"
    );
    self.Buttons.Submit.text("Update");

    // Fill in the form fields
    self.Inputs.MabNpcName.val(mabNpc.npcName).trigger("select");
    self.Inputs.MabNpcDescription.val(mabNpc.description);
    self.Inputs.MabNpcLevel.html(`<span>${mabNpc.level}</span>`);

    // Set card type (need to wait for select2 to be initialized)

    self.SelectBlock.hide();

    self.Inputs.MabNpcCardsList.empty();
    self.CardsListBlock.show();

    mabNpc.cards.forEach((card, index) => {
      new CardsListManager(
        card,
        self.Inputs.MabNpcCardsList,
        index,
        self.ShowCardSelection
      );
    });

    // Recheck form to enable submit button if needed
    self.checkFormFilling();
  };
  self.ShowCardSelection = () => {
    self.SelectBlock.show();
  };

  // Reset the form to "Add" mode
  self.ResetToAddMode = () => {
    self.isEditMode = false;
    self.currentMabNpcId = null;
    self.ModalTitle.html(
      "<strong><span>C</span>reate</strong> <span>M.</span>A.B. <span>N</span>pc"
    );

    self.Inputs.MabNpcCardsList.empty();
    self.CardsListBlock.hide();

    self.Buttons.Submit.text("Confirm");

    self.Inputs.MabNpcLevel.html(`? (calculated after 5 cards are chosen...)`);
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
    self.loadMabCards();
    self.LoadEvents();
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

function CardsListManager(card, targetContainer, index, onRemoveCallback) {
  let self = this;
  self.Card = card;
  self.TargetContainer = targetContainer;
  self.Index = index;
  self.OnRemoveCallback = onRemoveCallback;
  self.IsBuilt = false;

  self.BuildHtml = () => {
    console.log("BuildHtml: ");
    let cardId = self.Card.cardId;
    let cardName = self.Card.cardName;
    let cardType = self.Card.cardType;
    let cardPower = self.Card.cardPower;
    let cardUpperHand = self.Card.cardUpperHand;

    let listItem = `
      <li id="li-modal-mab-npcs-add-edit-${self.Index}">
        <div class="d-flex flex-row align-items-center gap-2">
          <button
            class="button-modal-mab-npcs-removecard btn btn-outline-danger p-0 m-0"
            type="button"
            mab-card-id="${cardId}"
          >
            <i class="fa-solid fa-xmark p-1 m-0"></i>
          </button>

          <strong id="mab-card-came" class="p-0 m-0">${cardName}card name</strong>

          <img
            src="/images/icons/io_arrow_right.svg"
            class="bi bi-arrow p-0 m-0"
          />

          <div id="mab-card-data">
            <span>T</span>ype: <strong>${cardType}</strong>,
            <span>P</span>ower: <strong>${cardPower}</strong>,
            <span>U</span>pper <span>H</span>and:
            <strong>${cardUpperHand}</strong>
          </div>
        </div>
      </li>
    `;

    self.TargetContainer.append(listItem);
  };
  self.DestroyHTML = () => {
    self.DOM.empty();
  };

  self.LoadReferences = () => {
    self.DOM = $(`#li-modal-mab-npcs-add-edit-${self.Index}`);

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.RemoveNpcMabCard =
      self.DOM.find(".button-modal-mab-npcs-removecard");
  };

  self.LoadEvents = () => {
    self.Buttons.RemoveNpcMabCard.on("click", (e) => {
      e.preventDefault();

      self.DestroyHTML();

      self.OnRemoveCallback();
    });
  };

  self.Build = () => {
    if (self.IsBuilt == true) {
      return;
    }

    self.BuildHtml();
    self.LoadReferences();
    self.LoadEvents();
    self.IsBuilt = true;
  };

  self.Build();
}
