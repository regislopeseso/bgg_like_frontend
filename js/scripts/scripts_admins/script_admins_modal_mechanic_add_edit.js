function modal_Mechanic_Add_Edit() {
  let self = this;
  self.IsBuilt = false;
  self.IsBuilt = false;
  self.isEditMode = false;
  self.currentMechanicId = null;
  self.onSuccessCallback = null;

  self.LoadReferences = () => {
    self.DOM = $("#mechanic-add-edit-modal");

    self.ModalTitle = self.DOM.find("#edit-modal-title");
    self.Form = $("#mechanic-add-edit-form");

    // Add a hidden input for the mechanic ID when in edit mode
    self.Form.append(
      '<input type="hidden" id="mechanic-id" name="MechanicId" value="">'
    );

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.Required =
      self.DOM.find(".required");
    self.Inputs[self.Inputs.length] = self.Inputs.MechanicId =
      self.DOM.find("#mechanic-id");
    self.Inputs[self.Inputs.length] = self.Inputs.MechanicName =
      self.DOM.find("#new-mechanic-name");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Submit = self.DOM.find(
      "#mechanic-submit-button"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Reset = self.DOM.find(
      "#reset-add-edit-mechanic-form"
    );
  };

  self.LoadEvents = () => {
    self.Buttons.Submit.on("click", function (e) {
      e.preventDefault();

      if (self.isEditMode === true) {
        self.SetUpEditMechanicForm();
      } else {
        self.SetUpAddMechanicForm();
      }
    });

    self.Buttons.Reset.on("click", function (e) {
      self.forceClearForm();
    });

    self.CheckForm();
  };

  // New method to fetch MECHANIC details for editing
  self.FetchMechanicDetails = (mechanicId) => {
    self.AddContentLoader();
    self.currentMechanicId = mechanicId;

    $.ajax({
      url: `https://localhost:7081/admins/showmechanicdetails?MechanicId=${mechanicId}`,
      method: "GET",
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          console.error("Failed to fetch mechanic details:", response.message);
          return;
        }

        // Open the edit modal with the MECHANIC data
        __global.MechanicEditModalController.PopulateFormForEditing(
          response.content
        );
        self.RemoveContentLoader();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching mechanic details:", error);
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
      self.Inputs.MechanicName.focus();
    });
  };

  self.forceClearForm = () => {
    // Block form submission button
    self.Buttons.Submit.prop("disabled", true);

    //Clear form
    self.Inputs.forEach((input) => {
      input.val(null);
    });
  };

  self.SetUpAddMechanicForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/admins/addmechanic",
      data: self.Form.serialize(),
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        sweetAlertSuccess(resp.message);

        self.forceClearForm();

        self.CloseModal();

        // Refresh the MECHANIC list
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

  self.SetUpEditMechanicForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    // Get form values
    const mechanicId = self.currentMechanicId;
    const mechanicName = $("#new-mechanic-name").val();

    $.ajax({
      url: "https://localhost:7081/admins/editmechanic",
      type: "PUT",
      data: JSON.stringify({
        MechanicId: mechanicId,
        MechanicName: mechanicName,
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
        if (__global.MechanicDataBaseModalController) {
          __global.MechanicDataBaseModalController.LoadAllMechanics();
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

  // Method to fill the form with MECHANIC data for editing
  self.PopulateFormForEditing = (mechanic) => {
    // Set the form to edit mode
    self.isEditMode = true;
    self.Inputs.MechanicId = mechanic.mechanicId;

    // Update the modal title and button text
    self.ModalTitle.html("<span>E</span>dit <span>M</span>echanic");
    self.Buttons.Submit.text("Update");

    // Fill in the form fields
    self.Inputs.MechanicName.val(mechanic.mechanicName);

    // Recheck form to enable submit button if needed
    self.checkFormFilling();
  };

  // Reset the form to "Add" mode
  self.ResetToAddMode = () => {
    self.isEditMode = false;
    self.currentMechanicId = null;
    self.ModalTitle.html(
      "<span>A</span>dd a <span>N</span>ew <span>M</span>echanic"
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
      self.Inputs.MechanicName.focus();
    });
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

  self.OpenAddModal = (onSuccessCallback) => {
    self.onSuccessCallback = onSuccessCallback;
    self.ResetToAddMode();
    self.forceClearForm();
    self.Show();
  };

  // New method to open the modal in edit mode
  self.OpenEditModal = (mechanicId, onSuccessCallback) => {
    self.onSuccessCallback = onSuccessCallback;
    self.Show();
    self.FetchMechanicDetails(mechanicId);
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
