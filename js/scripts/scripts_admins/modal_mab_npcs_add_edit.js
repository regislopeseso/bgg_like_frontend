function modal_Mab_Npcs_Add_Edit() {
  let self = this;
  self.IsBuilt = false;
  self.isEditMode = false;
  self.currentMabNpcId = null;
  self.onSuccessCallback = null;
  self.DeckSizeLimit = null;
  self.CurrentDeckSize = 0;

  self.SelectedCardId = null;

  self.Deck_CardIds = [];
  self.Deck_Cards = [];

  self.LoadReferences = () => {
    self.DOM = $("#dom-modal-mab-npcs-add-edit");

    self.ModalTitle = self.DOM.find("#title-modal-mab-npcs-add-edit");
    self.Form = $("#form-modal-mab-npcs-add-edit");

    // Add a hidden input for the NPC ID when in edit mode
    self.Form.append(
      '<input type="hidden" id="mab-npc-id" name="NpcId" value="">'
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

    self.MabNpcLvlBlock = self.DOM.find(
      "#div-modal-mab-npcs-add-edit-npclevel"
    );
    self.MabNpcLvlTitle = self.DOM.find(
      "#title-modal-mab-npcs-add-edit-npclevel"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.MabNpcLevel = self.DOM.find(
      "#input-modal-mab-npcs-add-edit-npclevel"
    );

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
    self.Inputs.SelectMabCard.on("select2:select", function (e) {
      const selectedData = e.params.data;

      self.SelectedCardId = selectedData.id;

      self.Buttons.AddNpcMabCard.prop("disabled", false);
    });

    self.Buttons.AddNpcMabCard.on("click", (e) => {
      e.preventDefault();

      // Add the card ID to the array
      self.Deck_CardIds.push(self.SelectedCardId);
      self.CurrentDeckSize = self.Deck_CardIds.length;

      // Create the card manager
      let cardManager = new CardsListManager(
        self.SelectedCardId,
        self.Inputs.MabNpcCardsList,
        self.Deck_CardIds.length - 1,
        self.EnableCardSelection
      );

      // Store the card manager
      self.Deck_Cards.push(cardManager);

      // Reset the select dropdown
      self.Inputs.SelectMabCard.val(null).trigger("change");
      self.SelectedCardId = null;
      self.Buttons.AddNpcMabCard.prop("disabled", true);

      // Update form validation
      self.CheckFormFilling();
      self.CheckDeckCompletion();
    });

    self.Buttons.Reset.on("click", function (e) {
      self.ForceClearForm();

      self.Inputs.MabNpcName.focus();
    });

    self.Buttons.Submit.on("click", function (e) {
      e.preventDefault();

      if (self.isEditMode === true) {
        self.SetUpEditMabNpcForm();
      } else {
        self.SetUpAddMabNpcForm();
      }
    });

    self.CheckForm();
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

  //? METHODS FOR EDITING MODE
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

        console.log("mabNpc:", response.content);
        console.log("self.currentMabNpcId:", self.currentMabNpcId);

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

  self.PopulateFormForEditing = (mabNpc) => {
    // Set the form to edit mode
    self.isEditMode = true;
    self.Inputs.MabNpcId.val(mabNpc.npcId);

    // Update the modal title and button text
    self.Buttons.Submit.text("Update");

    self.ModalTitle.html(
      "<strong><span>E</span>dit</strong> <span>M.</span>A.B. <span>N</span>pc"
    );

    // Fill in the form fields
    self.Inputs.MabNpcName.val(mabNpc.npcName).trigger("select");

    self.Inputs.MabNpcDescription.val(mabNpc.description);

    self.Inputs.MabNpcLevel.html(
      `<h3 class="p-0 m-0"><span>${mabNpc.level}</span></h3>`
    );

    // Set card type (need to wait for select2 to be initialized)
    self.SelectBlock.hide();

    self.Inputs.MabNpcCardsList.empty();
    self.CardsListBlock.show();

    // Clear existing cards array
    self.Deck_Cards = [];
    self.Deck_CardIds = [];
    self.CurrentDeckSize = 0;

    mabNpc.cards.forEach((card, index) => {
      self.Deck_CardIds.push(card.cardId);

      let cardManager = new CardsListManager(
        card.cardId,
        self.Inputs.MabNpcCardsList,
        index,
        self.EnableCardSelection
      );

      self.Deck_Cards.push(cardManager);

      self.CurrentDeckSize++;
    });

    // Recheck form to enable submit button if needed
    self.CheckFormFilling();
  };

  self.EnableCardSelection = (indexToRemove) => {
    // This is called when removing a card in edit mode
    self.RemoveCardAt(indexToRemove);

    self.ShowCardSelection();
  };
  self.ShowCardSelection = () => {
    self.Inputs.MabNpcLevel.fadeOut(100);
    self.MabNpcLvlTitle.fadeOut(500);

    self.SelectBlock.fadeIn();
    setTimeout(() => {
      self.Inputs.SelectMabCard.select2("open");
    }, 600);
  };
  self.HideCardSelection = () => {
    self.CardsListBlock.fadeIn(500);

    self.MabNpcLvlTitle.fadeIn(500);
    self.Inputs.MabNpcLevel.fadeIn(500);

    self.SelectBlock.fadeOut(500);
  };

  self.SetUpEditMabNpcForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    // Get form values
    const mabNpcId = self.currentMabNpcId;
    const mabNpcName = self.Inputs.MabNpcName.val();
    const mabNpcDescription = self.Inputs.MabNpcDescription.val();
    const mabNpcDeck = self.Deck_CardIds;

    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/admins/editmabnpc",
      data: JSON.stringify({
        NpcId: mabNpcId,
        NpcName: mabNpcName,
        NpcDescription: mabNpcDescription,
        CardIds: mabNpcDeck,
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

        sweetAlertSuccess(resp.message);

        // Reset form and exit edit mode
        self.ForceClearForm();
        self.ResetToAddMode();

        // Close the modal
        self.CloseModal();

        // Refresh the mab npc list
        if (__global.MabNpcsDataBaseModalController) {
          __global.MabNpcsDataBaseModalController.LoadAllMabNpcs();
        }

        self.ForceClearForm();
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

  //? METHODS FOR ADDING MODE
  self.ResetToAddMode = () => {
    self.isEditMode = false;
    self.CurrentDeckSize = 0;
    self.currentMabNpcId = null;
    self.Deck_CardIds = [];
    self.Deck_Cards = [];

    self.ModalTitle.html(
      "<strong><span>C</span>reate</strong> <span>M.</span>A.B. <span>N</span>pc"
    );

    self.Inputs.MabNpcCardsList.empty();

    self.CardsListBlock.show();

    self.Buttons.Submit.text("Confirm");
  };

  self.SetUpAddMabNpcForm = () => {
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/admins/addmabnpc",
      xhrFields: {
        withCredentials: true,
      },
      contentType: "application/json",
      data: JSON.stringify({
        Name: self.Inputs.MabNpcName.val(),
        Description: self.Inputs.MabNpcDescription.val(),
        CardIds: self.Deck_CardIds,
      }),
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);
          return;
        }
        sweetAlertSuccess(resp.message);

        self.ForceClearForm();
        self.CloseModal();

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

  //? GENERAL METHODS
  self.GetDeckSizeLimit = () => {
    // Fetch the mab card types list once from the backend
    fetch("https://localhost:7081/admins/getdecksizelimit", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) {
          sweetAlertError("Failed to get mab deck size limit:", data.message);
          return;
        }

        self.DeckSizeLimit = data.content.deckSizeLimit;

        self.BuildModal();
      })
      .catch((err) => {
        console.error("Error fetching deck size limit:", err);
      });
  };

  self.LoadMabCards = () => {
    // First destroy any existing select2 instance to prevent duplicates
    if (self.Inputs.SelectMabCard.hasClass("select2-hidden-accessible")) {
      self.Inputs.SelectMabCard.select2("destroy");
    }

    // Fetch the mab card types list once from the backend
    fetch("https://localhost:7081/admins/listmabcardids", {
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

        // Clear previous options and add empty one
        self.Inputs.SelectMabCard.empty().append(`<option></option>`);

        self.Inputs.SelectMabCard.select2({
          data: mabCards,
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

  self.GetMabNpcNewLvl = () => {
    $.ajax({
      method: "POST",
      url: `https://localhost:7081/admins/getmabnpclvl`,
      xhrFields: {
        withCredentials: true,
      },
      contentType: "application/json",
      data: JSON.stringify({
        MabCardIds: self.Deck_CardIds,
      }),
      success: function (response) {
        if (!response.content) {
          sweetAlertError(response.message);
          return;
        }

        let mabNpcLvl = response.content.mabNpcLvl;

        self.MabNpcLvlTitle.html(`<span>L</span>evel:`);
        self.Inputs.MabNpcLevel.html(
          `<h3 class="modal-title p-0 m-0"><span>${mabNpcLvl}</span></h3>`
        );

        self.HideCardSelection();
      },
      error: function (xhr, status, error) {
        sweetAlertError("Error fetching mab npc details:", error);
      },
    });
  };

  self.CheckDeckCompletion = () => {
    if (self.Deck_CardIds.length >= self.DeckSizeLimit) {
      self.HideCardSelection();

      self.GetMabNpcNewLvl();

      return true;
    }

    return false;
  };
  self.CheckFormFilling = () => {
    let areFieldsFilled = true;

    self.Inputs.Required.each(function () {
      const value = $(this).val();

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
      areFieldsFilled === false || self.CheckDeckCompletion() === false
    );
  };
  self.CheckForm = () => {
    self.CheckFormFilling();

    // React to typing in any input
    self.Inputs.Required.on("input", self.CheckFormFilling);
  };

  self.RemoveCardAt = (indexToRemove) => {
    // Remove the card ID from the array at the specific index
    if (indexToRemove >= 0 && indexToRemove < self.Deck_CardIds.length) {
      self.Deck_CardIds.splice(indexToRemove, 1);
    }

    // Remove the corresponding CardManager from the array
    if (indexToRemove >= 0 && indexToRemove < self.Deck_Cards.length) {
      // Properly destroy the specific card manager being removed
      let cardManagerToRemove = self.Deck_Cards[indexToRemove];
      if (
        cardManagerToRemove &&
        typeof cardManagerToRemove.DestroyHTML === "function"
      ) {
        cardManagerToRemove.DestroyHTML();
      }
      // Remove it from the array
      self.Deck_Cards.splice(indexToRemove, 1);
    }

    // Update the current deck size
    self.CurrentDeckSize = self.Deck_CardIds.length;

    // Clear the entire UI list
    self.Inputs.MabNpcCardsList.empty();

    // Update all remaining CardManager instances with their new indexes and rebuild DOM
    self.Deck_Cards.forEach((cardManager, newIndex) => {
      if (cardManager) {
        // Update the internal index of the existing CardManager
        cardManager.UpdateIndex(newIndex);

        // Rebuild the HTML for this card with the new index
        cardManager.RebuildHTML();
      }
    });

    // Update form validation
    self.CheckFormFilling();
  };
  self.ForceClearForm = () => {
    self.Buttons.Submit.prop("disabled", true);

    if (self.Deck_Cards && Array.isArray(self.Deck_Cards)) {
      self.Deck_Cards.forEach((cardManager) => {
        if (cardManager && typeof cardManager.DestroyHTML === "function") {
          cardManager.DestroyHTML();
        }
      });

      self.Deck_Cards = [];
    }

    self.Deck_CardIds = [];

    self.Deck_Cards = [];

    self.CurrentDeckSize = 0;

    self.Inputs.forEach((input) => {
      input.val(null);
    });

    self.ShowCardSelection();

    self.SelectBlock.show();
    self.Inputs.SelectMabCard.val(null).trigger("change").select2("open");

    self.Inputs.MabNpcCardsList.empty();
  };

  //? MODAL METHODS
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
    self.LoadMabCards();
    self.LoadEvents();
    self.IsBuilt = true;
  };

  self.OpenAddModal = (onSuccessCallback) => {
    self.onSuccessCallback = onSuccessCallback;
    self.ResetToAddMode();
    self.ForceClearForm();
    self.Show();
  };

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
      self.ForceClearForm();
      modalInstance.hide();
    }
  };

  self.GetDeckSizeLimit();
}

function CardsListManager(cardId, targetContainer, index, onRemoveCallback) {
  let self = this;
  self.CardId = cardId;
  self.TargetContainer = targetContainer;
  self.Index = index;
  self.OnRemoveCallback = onRemoveCallback;
  self.IsBuilt = false;

  self.MabCard = null;
  self.DOM = null;

  self.FetchMabCardDetails = (mabCardId) => {
    self.currentMabCardId = mabCardId;

    $.ajax({
      method: "GET",
      url: `https://localhost:7081/admins/showmabcarddetails?CardId=${self.CardId}`,
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          console.error("Failed to fetch card details:", response.message);
          return;
        }

        self.MabCard = response.content;
        self.Build();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching card details:", error);
      },
    });
  };

  self.BuildHtml = () => {
    let cardId = self.CardId;
    let cardName = self.MabCard.cardName;
    let cardType = self.MabCard.cardType;
    let cardPower = self.MabCard.cardPower;
    let cardUpperHand = self.MabCard.cardUpperHand;

    // Create a unique ID for this specific instance
    let elementId = `li-modal-mab-npcs-add-edit-${self.Index}`;

    // Check if element already exists and remove it to prevent duplicates
    let existingElement = $(`#${elementId}`);
    if (existingElement.length > 0) {
      existingElement.remove();
    }

    let listItem = `
      <li id="${elementId}" data-card-id="${cardId}" data-index="${self.Index}">
        <div class="d-flex flex-row align-items-center gap-2">
          <button
            class="button-modal-mab-npcs-removecard btn btn-outline-danger p-0 m-0"
            type="button"
            data-card-id="${cardId}"
            data-index="${self.Index}"
          >
            <i class="fa-solid fa-xmark p-1 m-0"></i>
          </button>

          <strong class="mab-card-name p-0 m-0">${cardName}</strong>

          <img
            src="/images/icons/io_arrow_right.svg"
            class="bi bi-arrow p-0 m-0"
          />

          <div class="mab-card-data">
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

  self.UpdateIndex = (newIndex) => {
    // Update the internal index
    self.Index = newIndex;
  };

  self.RebuildHTML = () => {
    // Remove the old DOM element if it exists
    if (self.DOM && self.DOM.length > 0) {
      self.DOM.find(".button-modal-mab-npcs-removecard").off("click");
      self.DOM.remove();
      self.DOM = null;
    }

    // Rebuild the HTML with the current index
    self.BuildHtml();
    self.LoadReferences();
    self.LoadEvents();
  };

  self.DestroyHTML = () => {
    if (self.DOM && self.DOM.length > 0) {
      self.DOM.remove();
    }
  };

  self.LoadReferences = () => {
    self.DOM = $(`#li-modal-mab-npcs-add-edit-${self.Index}`);

    if (self.DOM.length === 0) {
      console.error(`DOM element not found for index ${self.Index}`);
      return;
    }

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.RemoveNpcMabCard =
      self.DOM.find(".button-modal-mab-npcs-removecard");
  };

  self.LoadEvents = () => {
    self.Buttons.RemoveNpcMabCard.on("click", (e) => {
      e.preventDefault();

      self.OnRemoveCallback(self.Index);
    });
  };

  self.Build = () => {
    if (self.IsBuilt) {
      return;
    }

    self.BuildHtml();
    self.LoadReferences();
    self.LoadEvents();
    self.IsBuilt = true;
  };

  // Public method to get the current card data
  self.GetCardData = () => {
    return {
      cardId: self.CardId,
      index: self.Index,
      cardData: self.MabCard,
    };
  };

  // Initialize by fetching card details
  self.FetchMabCardDetails();
}
