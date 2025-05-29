function modal_Mechanic_Delete_Restore() {
  let self = this;
  self.IsBuilt = false;
  self.isDeleteMode = false;
  self.currentMechanicId = null;
  self.onSuccessCallback = null;

  self.LoadReferences = () => {
    self.DOM = $("#mechanic-delete-restore-modal");

    self.ModalTitle = self.DOM.find("#delete-restore-modal-title");

    self.ModalBody = self.DOM.find(".modal-body");

    self.ModalBox = self.DOM.find("#mechanic-delete-restore-modalbox");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Confirm = self.DOM.find(
      "#mechanic-delete-restore-confirm-button"
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

  self.FetchMechanicDetails = () => {
    self.AddContentLoader();

    $.ajax({
      url: `https://localhost:7081/admins/showmechanicdetails?MechanicId=${self.currentMechanicId}`,
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
        if (self.isDeleteMode === false) {
          __global.MechanicDeleteRestoreModalController.RenderRestoreMode(
            response.content.mechanicName
          );
          self.RemoveContentLoader();
        } else {
          __global.MechanicDeleteRestoreModalController.RenderDeleteMode(
            response.content.mechanicName
          );
          self.RemoveContentLoader();
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching mechanic details:", error);
      },
    });
  };

  // Methods to fill the MODAL BODY with MECHANIC NAME
  self.RenderRestoreMode = (mechanicName) => {
    self.ModalBox.removeClass("delete-warning");
    self.ModalBox.addClass("restore-warning");

    // Update the modal title and button text
    self.ModalTitle.html(
      `<h5><span>R</span>estoring the following <span>M</span>echanic</h5>`
    );

    // Fill in the MODAL BODY with the MECHANIC NAME
    self.ModalBody.html(`<h3><span>${mechanicName}</span></h3>`);
  };

  self.RenderDeleteMode = (mechanicName) => {
    self.ModalBox.removeClass("restore-warning");
    self.ModalBox.addClass("delete-warning");

    // Update the modal title and button text
    self.ModalTitle.html(
      `<h5><span style="color: var(--reddish)">D</span>eleting the following <span style="color: var(--reddish)">M</span>echanic</h5>`
    );

    // Fill in the MODAL BODY with the MECHANIC NAME
    self.ModalBody.html(
      `<h3><span style="color: var(--reddish)">${mechanicName}</span></h3>`
    );
  };

  self.SetUpDelete = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Confirm;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "DELETE",
      url: "https://localhost:7081/admins/deletemechanic",
      data: JSON.stringify({
        MechanicId: self.currentMechanicId,
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

        // Refresh the CATEGORY list
        if (self.onSuccessCallback) {
          self.onSuccessCallback();
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };

  self.SetUpRestore = () => {
    //Disable submit button to prevent double submissions
    const confirmBtn = self.Buttons.Confirm;
    const originalBtnText = confirmBtn.text();
    confirmBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/admins/restoremechanic",
      data: JSON.stringify({
        MechanicId: self.currentMechanicId,
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

        // Refresh the CATEGORY list
        if (self.onSuccessCallback) {
          self.onSuccessCallback();
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
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
    mechanicId,
    onSuccessCallback,
    isDeletedMode
  ) => {
    self.currentMechanicId = mechanicId;
    self.onSuccessCallback = onSuccessCallback;
    self.isDeleteMode = isDeletedMode;
    self.FetchMechanicDetails();
    self.Show();
  };

  self.CloseModal = () => {
    self.currentMechanicId = null;
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  self.BuildModal();
}
