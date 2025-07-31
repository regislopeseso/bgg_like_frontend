function modal_Mab_Cards_Delete() {
  let self = this;
  self.IsBuilt = false;
  self.currentMabCardId = null;
  self.onSuccessCallback = null;

  self.LoadReferences = () => {
    self.DOM = $("#dom-modal-mab-cards-delete");

    self.ModalTitle = self.DOM.find("#title-modal-mab-cards-delete");

    self.ModalBody = self.DOM.find(".modal-body");

    self.ModalBox = self.DOM.find("#modalbox-modal-mab-cards-delete");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Confirm = self.DOM.find(
      "#button-modal-mab-cards-delete-confirm"
    );
  };

  self.LoadEvents = () => {
    self.Buttons.Confirm.on("click", function (e) {
      e.preventDefault();

      self.SetUpDelete();
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
    });
  }

  self.FetchMabCardDetails = () => {
    self.AddContentLoader();

    $.ajax({
      method: "GET",
      url: `https://localhost:7081/admins/showcarddetails?CardId=${self.currentMabCardId}`,
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          sweetAlertError("Failed to fetch card details:", response.message);
          return;
        }

        // Open the edit modal with the CATEGORY data
        __global.MabCardsDeleteModalController.RenderDeleteMode(
          response.content.cardName
        );
        self.RemoveContentLoader();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching card details:", error);
      },
    });
  };

  // Methods to fill the MODAL BODY with CARD NAME
  self.RenderDeleteMode = (cardName) => {
    self.ModalBox.removeClass("restore-warning");
    self.ModalBox.addClass("delete-warning");

    // Update the modal title and button text
    self.ModalTitle.html(
      `<h5><span style="color: var(--reddish)">D</span>eleting the following <span style="color: var(--reddish)">C</span>ard</h5>`
    );

    // Fill in the MODAL BODY with the CATEGORY NAME
    self.ModalBody.html(
      `<h3><span style="color: var(--reddish)">${cardName}</span></h3>`
    );
  };

  self.SetUpDelete = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Confirm;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "DELETE",
      url: "https://localhost:7081/admins/destructcard",
      data: JSON.stringify({
        CardId: self.currentMabCardId,
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

  self.OpenDeleteModal = (mabCardId, onSuccessCallback) => {
    self.currentMabCardId = mabCardId;
    self.onSuccessCallback = onSuccessCallback;
    self.FetchMabCardDetails();
    self.Show();
  };

  self.CloseModal = () => {
    self.currentMabCardId = null;
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  self.BuildModal();
}
