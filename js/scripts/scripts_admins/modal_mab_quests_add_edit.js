function modal_Mab_Quests_Add_Edit() {
  let self = this;
  self.IsBuilt = false;
  self.isEditMode = false;
  self.currentMabQuestId = null;
  self.onSuccessCallback = null;

  self.SelectedNpcId = null;

  self.Quest_NpcIds = [];
  self.Quest_Npcs = [];

  self.LoadReferences = () => {
    self.DOM = $("#dom-modal-mab-quests-add-edit");

    self.ModalTitle = self.DOM.find("#title-modal-mab-quests-add-edit");

    self.Form = $("#form-modal-mab-quests-add-edit");

    // Add a hidden input for the QUEST ID when in edit mode
    self.Form.append(
      '<input type="hidden" id="mab-quest-id" name="Mab_QuestId" value="">'
    );

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.Required =
      self.DOM.find(".required");
    self.Inputs[self.Inputs.length] = self.Inputs.QuestId =
      self.DOM.find("#mab-quest-id");
    self.Inputs[self.Inputs.length] = self.Inputs.QuestTitle = self.DOM.find(
      "#input-modal-mab-quests-add-edit-questtitle"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.QuestDescription =
      self.DOM.find("#input-modal-mab-quests-add-edit-questdescription");
    self.Inputs[self.Inputs.length] = self.Inputs.QuestLevel = self.DOM.find(
      "#input-modal-mab-quests-add-edit-questlevel"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.GoldBounty = self.DOM.find(
      "#input-modal-mab-quests-add-edit-goldbounty"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.XpReward = self.DOM.find(
      "#input-modal-mab-quests-add-edit-xpreward"
    );

    self.SelectBlock = self.DOM.find(
      "#div-select-modal-mab-quests-add-edit-questnpcs"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.Quest_SelectNpcs =
      self.DOM.find("#input-select-modal-mab-quests-add-edit-questnpcs");

    self.NpcsListBlock = self.DOM.find(
      "#div-npcsList-modal-mab-quests-add-edit-questnpcs"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.NpcsList = self.DOM.find(
      "#ol-select-modal-mab-quests-add-edit-questnpcs"
    );

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.AddNpc = self.DOM.find(
      "#button-modal-mab-quests-addnpc"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Submit = self.DOM.find(
      "#button-modal-mab-quests-add-edit-submit"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Reset = self.DOM.find(
      "#button-modal-mab-quests-add-edit-reset"
    );
  };

  self.LoadEvents = () => {
    self.Inputs.Quest_SelectNpcs.on("select2:select", function (e) {
      const selectedData = e.params.data;

      self.SelectedNpcId = selectedData.id;

      self.Buttons.AddNpc.prop("disabled", false);
    });

    self.Buttons.AddNpc.on("click", (e) => {
      e.preventDefault();

      // Add the card ID to the array
      self.Quest_NpcIds.push(self.SelectedNpcId);

      // Create the npc manager
      let npcManager = new NpcsListManager(
        self.SelectedNpcId,
        self.Inputs.NpcsList,
        self.Quest_NpcIds.length - 1,
        self.EnableNpcSelection
      );

      // Store the card manager
      self.Quest_Npcs.push(npcManager);

      // Reset the select dropdown
      self.Inputs.Quest_SelectNpcs.val(null).trigger("change");
      self.SelectedNpcId = null;
      self.Buttons.AddNpc.prop("disabled", true);

      // Update form validation
      self.CheckFormFilling();
    });

    self.Buttons.Reset.on("click", function (e) {
      self.ForceClearForm();

      self.Inputs.QuestTitle.focus();
    });

    self.Buttons.Submit.on("click", function (e) {
      e.preventDefault();

      if (self.isEditMode === true) {
        self.Quest_SetUpEditForm();
      } else {
        self.Quest_SetUpAddForm();
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
  self.FetchMabQuestDetails = (mabQuestId) => {
    self.AddContentLoader();
    self.currentMabQuestId = mabQuestId;

    $.ajax({
      method: "GET",
      url: `https://localhost:7081/admins/mabshowquestdetails?Mab_QuestId=${mabQuestId}`,
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          sweetAlertError("Failed to fetch quest details:", response.message);
          return;
        }

        // Open the edit modal with the mab QUESTs data
        __global.MabQuestsAddEditModalController.PopulateFormForEditing(
          response.content
        );

        self.RemoveContentLoader();
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Error fetching mab quest details. Try again later.",
          error
        );
      },
    });
  };

  self.PopulateFormForEditing = (mabQuest) => {
    // Set the form to edit mode
    self.isEditMode = true;
    self.Inputs.QuestId.val(mabQuest.mab_QuestId);

    // Update the modal title and button text
    self.Buttons.Submit.text("Update");

    self.ModalTitle.html(
      "<strong><span>E</span>dit</strong> <span>M.</span>A.B. <span>Q</span>uest"
    );

    // Fill in the form fields
    self.Inputs.QuestTitle.val(mabQuest.mab_QuestTitle).trigger("select");

    self.Inputs.QuestDescription.val(mabQuest.mab_QuestDescription);

    self.Inputs.QuestLevel.val(mabQuest.mab_QuestLevel);

    self.Inputs.GoldBounty.val(mabQuest.mab_GoldBounty);

    self.Inputs.XpReward.val(mabQuest.mab_XpReward);

    self.Inputs.NpcsList.empty();
    self.NpcsListBlock.show();

    // Clear existing cards array
    self.Quest_Npcs = [];
    self.Quest_NpcIds = [];

    mabQuest.mab_Npcs.forEach((npc, index) => {
      self.Quest_NpcIds.push(npc.mab_NpcId);

      let npcManager = new NpcsListManager(
        npc.mab_NpcId,
        self.Inputs.NpcsList,
        index,
        self.EnableNpcSelection
      );

      self.Quest_Npcs.push(npcManager);
    });

    // Recheck form to enable submit button if needed
    self.CheckFormFilling();
  };

  self.EnableNpcSelection = (indexToRemove) => {
    // This is called when removing a card in edit mode
    self.RemoveNpcAt(indexToRemove);

    self.ShowNpcSelection();
  };
  self.ShowNpcSelection = () => {
    self.SelectBlock.fadeIn();
    setTimeout(() => {
      self.Inputs.Quest_SelectNpcs.select2("open");
    }, 600);
  };

  self.Quest_SetUpEditForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    // Get form values
    const questId = self.currentMabQuestId;
    const questTitle = self.Inputs.QuestTitle.val();
    const questDescription = self.Inputs.QuestDescription.val();
    const questLevel = self.Inputs.QuestLevel.val();
    const goldBounty = self.Inputs.GoldBounty.val();
    const xpReward = self.Inputs.XpReward.val();
    const npcs = self.Quest_NpcIds;

    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/admins/mabeditquest",
      data: JSON.stringify({
        Mab_QuestId: questId,
        Mab_QuestTitle: questTitle,
        Mab_QuestDescription: questDescription,
        Mab_QuestLevel: questLevel,
        Mab_GoldBounty: goldBounty,
        Mab_XpReward: xpReward,
        Mab_NpcIds: npcs,
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
        if (__global.MabQuestsDataBaseModalController) {
          __global.MabQuestsDataBaseModalController.LoadAllMabQuests();
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
    self.currentMabQuestId = null;
    self.Quest_NpcIds = [];
    self.Quest_Npcs = [];

    self.ModalTitle.html(
      "<strong><span>C</span>reate</strong> <span>M.</span>A.B. <span>Q</span>uest"
    );

    self.Inputs.NpcsList.empty();

    self.NpcsListBlock.show();

    self.Buttons.Submit.text("Confirm");
  };

  self.Quest_SetUpAddForm = () => {
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    console.log("self.Inputs.QuestTitle.val(): ", self.Inputs.QuestTitle.val());

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/admins/mabaddquest",
      xhrFields: {
        withCredentials: true,
      },
      contentType: "application/json",
      data: JSON.stringify({
        Mab_QuestTitle: self.Inputs.QuestTitle.val(),
        Mab_QuestDescription: self.Inputs.QuestDescription.val(),
        Mab_QuestLevel: self.Inputs.QuestLevel.val(),
        Mab_GoldBounty: self.Inputs.GoldBounty.val(),
        Mab_XpReward: self.Inputs.XpReward.val(),
        Mab_NpcIds: self.Quest_NpcIds,
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
  self.LoadMabNpcs = () => {
    // First destroy any existing select2 instance to prevent duplicates
    if (self.Inputs.Quest_SelectNpcs.hasClass("select2-hidden-accessible")) {
      self.Inputs.Quest_SelectNpcs.select2("destroy");
    }

    // Fetch the mab card types list once from the backend
    fetch("https://localhost:7081/admins/mablistnpcids", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) {
          sweetAlertError("Failed to load mab npc ids:", data.message);
          return;
        }

        const npcs = data.content.map((item) => ({
          id: item.mab_NpcId,
          text: item.mab_NpcName,
        }));

        // Clear previous options and add empty one
        self.Inputs.Quest_SelectNpcs.empty().append(`<option></option>`);

        self.Inputs.Quest_SelectNpcs.select2({
          data: npcs,
          dropdownParent: self.DOM,
          placeholder: "Select a Npc",
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

    self.Buttons.Submit.prop("disabled", areFieldsFilled === false);
  };
  self.CheckForm = () => {
    self.CheckFormFilling();

    // React to typing in any input
    self.Inputs.Required.on("input", self.CheckFormFilling);
  };

  self.RemoveNpcAt = (indexToRemove) => {
    // Remove the npc ID from the array at the specific index
    if (indexToRemove >= 0 && indexToRemove < self.Quest_NpcIds.length) {
      self.Quest_NpcIds.splice(indexToRemove, 1);
    }

    // Remove the corresponding NpcManager from the array
    if (indexToRemove >= 0 && indexToRemove < self.Quest_Npcs.length) {
      // Properly destroy the specific npc manager being removed
      let npcManagerToRemove = self.Quest_Npcs[indexToRemove];
      if (
        npcManagerToRemove &&
        typeof npcManagerToRemove.DestroyHTML === "function"
      ) {
        npcManagerToRemove.DestroyHTML();
      }
      // Remove it from the array
      self.Quest_Npcs.splice(indexToRemove, 1);
    }

    // Clear the entire UI list
    self.Inputs.NpcsList.empty();

    // Update all remaining CardManager instances with their new indexes and rebuild DOM
    self.Quest_Npcs.forEach((npcManager, newIndex) => {
      if (npcManager) {
        // Update the internal index of the existing CardManager
        npcManager.UpdateIndex(newIndex);

        // Rebuild the HTML for this card with the new index
        npcManager.RebuildHTML();
      }
    });

    // Update form validation
    self.CheckFormFilling();
  };
  self.ForceClearForm = () => {
    self.Buttons.Submit.prop("disabled", true);

    if (self.Quest_Npcs && Array.isArray(self.Quest_Npcs)) {
      self.Quest_Npcs.forEach((npcManager) => {
        if (npcManager && typeof npcManager.DestroyHTML === "function") {
          npcManager.DestroyHTML();
        }
      });

      self.Quest_Npcs = [];
    }

    self.Quest_NpcIds = [];

    self.Quest_Npcs = [];

    self.Inputs.forEach((input) => {
      input.val(null);
    });

    self.ShowNpcSelection();

    self.SelectBlock.show();
    self.Inputs.Quest_SelectNpcs.val(null).trigger("change").select2("open");

    self.Inputs.NpcsList.empty();
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
    self.LoadMabNpcs();
    self.LoadEvents();
    self.IsBuilt = true;
  };

  self.OpenAddModal = (onSuccessCallback) => {
    self.onSuccessCallback = onSuccessCallback;
    self.ResetToAddMode();
    self.ForceClearForm();
    self.Show();
  };

  self.OpenEditModal = (mabQuestId, onSuccessCallback) => {
    self.onSuccessCallback = onSuccessCallback;
    self.Show();
    self.FetchMabQuestDetails(mabQuestId);

    // Ensure focus is applied after modal is fully shown
    self.DOM.on("shown.bs.modal", function () {
      self.Inputs.QuestTitle.focus();
    });
  };

  self.CloseModal = () => {
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      self.ForceClearForm();
      modalInstance.hide();
    }
  };

  self.BuildModal();
}

function NpcsListManager(npcId, targetContainer, index, onRemoveCallback) {
  let self = this;
  self.NpcId = npcId;
  self.TargetContainer = targetContainer;
  self.Index = index;
  self.OnRemoveCallback = onRemoveCallback;
  self.IsBuilt = false;

  self.MabNpc = null;
  self.DOM = null;

  self.FetchMabNpcDetails = (mabNpcId) => {
    self.currentMabNpcId = mabNpcId;

    $.ajax({
      method: "GET",
      url: `https://localhost:7081/admins/showmabnpcdetails?NpcId=${self.NpcId}`,
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          console.error("Failed to fetch card details:", response.message);
          return;
        }

        self.MabNpc = response.content;
        self.Build();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching card details:", error);
      },
    });
  };

  self.BuildHtml = () => {
    let npcId = self.NpcId;
    let npcName = self.MabNpc.npcName;
    let npcLevel = self.MabNpc.level;
    let npcCards = self.MabNpc.cards;

    // Create a unique ID for this specific instance
    let elementId = `li-modal-mab-quests-add-edit-${self.Index}`;

    // Check if element already exists and remove it to prevent duplicates

    let existingElement = $(`#${elementId}`);
    if (existingElement.length > 0) {
      existingElement.remove();
    }

    let cards = npcCards
      .map((card) => {
        return `
                <div class="d-flex flex-row justify-content-center align-items-center">                  
                    <div><strong>${card.cardName}</strong>&nbsp;</div>
                    <div class="d-flex flex-row justify-content-center align-items-center">
                      (${card.cardType} *
                      &nbsp;${card.cardPower} *                                
                      &nbsp;${card.cardUpperHand})                                                              
                    </div>
                </div>
              `;
      })
      .join(",&nbsp;&nbsp;&nbsp;");

    let listItem = `
      <li id="${elementId}" data-npc-id="${npcId}" data-index="${self.Index}" class="d-flex flex-row justify-content-center align-items-center">
        <div class="d-flex flex-row justify-content-center align-items-center gap-2">
          <button
            class="button-modal-mab-quests-removenpc btn btn-outline-danger p-0 m-0"
            type="button"
            data-npc-id="${npcId}"
            data-index="${self.Index}"
          >
            <i class="fa-solid fa-xmark p-1 m-0"></i>
          </button>

          <strong class="mab-npc-name p-0 m-0">${npcName}</strong>

          <img
            src="/images/icons/io_arrow_right.svg"
            class="bi bi-arrow p-0 m-0"
          />

          <div class="d-flex flex-row mab-npc-data  justify-content-center align-items-center">
            <span>L</span>evel: <strong>&nbsp;${npcLevel}</strong>,&nbsp;&nbsp;
            <span>C</span>ards:&nbsp;&nbsp;<div class="d-flex flex-row justify-content-center align-items-center">${cards}</div>
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
    if (self.DOM_npcslist && self.DOM_npcslist.length > 0) {
      self.DOM_npcslist.find(".button-modal-mab-quests-removenpc").off("click");
      self.DOM_npcslist.remove();
      self.DOM_npcslist = null;
    }

    // Rebuild the HTML with the current index
    self.BuildHtml();
    self.LoadReferences();
    self.LoadEvents();
  };

  self.DestroyHTML = () => {
    if (self.DOM_npcslist && self.DOM_npcslist.length > 0) {
      self.DOM_npcslist.remove();
    }
  };

  self.LoadReferences = () => {
    self.DOM_npcslist = $(`#li-modal-mab-quests-add-edit-${self.Index}`);

    if (self.DOM_npcslist.length === 0) {
      console.error(`DOM element not found for index ${self.Index}`);
      return;
    }

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.RemoveNpc =
      self.DOM_npcslist.find(".button-modal-mab-quests-removenpc");
  };

  self.LoadEvents = () => {
    self.Buttons.RemoveNpc.on("click", (e) => {
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
  self.GetNpcData = () => {
    return {
      npcId: self.NpcId,
      index: self.Index,
      npcData: self.MabNpc,
    };
  };

  // Initialize by fetching npc details
  self.FetchMabNpcDetails();
}
