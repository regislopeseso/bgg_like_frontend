function modal_SignIn() {
  let self = this;
  self.IsBuilt = false;

  self.LoadReferences = () => {
    self.DOM = $("#signInModal");
    console.log("DOM: ", self.DOM);

    //self.DOM_signInModal = $("#signInModal");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.UserName =
      self.DOM.find("#user-name");
    self.Inputs[self.Inputs.length] = self.Inputs.UserPassword =
      self.DOM.find("#user-password");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.CloseSignInModal =
      self.DOM.find("#button-close-signIn-modal");
    self.Buttons[self.Buttons.length] = self.Buttons.ConfirmSignIn =
      self.DOM.find("#button-confirm-signIn");
  };

  self.LoadEvents = () => {
    self.Buttons.CloseSignInModal.on("click", (e) => {
      e.preventDefault();

      self.CloseModal();
    });

    self.Buttons.ConfirmSignIn.on("click", function (e) {
      e.preventDefault();

      const form = document.getElementById("form-sign-in-modal");

      if (form.checkValidity()) {
        const userEmail = self.Inputs.UserName.val();
        const userPassword = self.Inputs.UserPassword.val();

        self.ConfirmSignIn(userEmail, userPassword, false);
      } else {
        form.reportValidity(); // Shows validation errors
      }
    });
  };

  function sweetAlertSuccess(title_text, message_text) {
    Swal.fire({
      position: "center",
      cancelButtonText: "close",
      icon: "success",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: true,
      didOpen: () => {
        // Attach keydown listener
        document.addEventListener("keydown", closeOnAnyKey);
      },
      willClose: () => {
        // Clean up listener when modal closes
        document.removeEventListener("keydown", closeOnAnyKey);
      },
    });
  }

  function sweetAlertError(title_text, message_text) {
    Swal.fire({
      position: "center",
      cancelButtonText: "close",
      icon: "error",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: false,
      showCancelButton: true,
      didOpen: () => {
        // Attach keydown listener
        document.addEventListener("keydown", closeOnAnyKey);
      },
      willClose: () => {
        // Clean up listener when modal closes
        document.removeEventListener("keydown", closeOnAnyKey);
      },
    });
  }

  function closeOnAnyKey() {
    Swal.close();
  }

  self.Show = () => {
    if (!self.DOM || self.DOM.length === 0) {
      console.error("Modal DOM element not found.");
      return;
    }

    const modalInstance = new bootstrap.Modal(self.DOM[0], {
      backdrop: "static",
      keyboard: false,
    });

    modalInstance.show();
  };

  self.OpenModal = (onSuccessfullSigningIn) => {
    self.OnSuccessfullSigningIn = onSuccessfullSigningIn;
    self.Show();
  };

  self.CloseModal = () => {
    const modalInstance = bootstrap.Modal.getInstance(self.DOM[0]);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  self.ConfirmSignIn = (userEmail, userPassword) => {
    const formData = new FormData();
    formData.append("Email", userEmail);
    formData.append("Password", userPassword);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/signin",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (response.content === null) {
          sweetAlertError("Login failed!", response.message);
          return;
        } else if (response.content.remainingSignInAttempts === null) {
          sweetAlertSuccess(response.message);
          if (self.OnSuccessfullSigningIn) {
            self.OnSuccessfullSigningIn();
          }
          self.CloseModal();
        } else {
          sweetAlertError("Login failed!", response.message);
        }
      },
      error: function (response) {
        sweetAlertError("Login failed!", response.message);
      },
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

  self.BuildModal();
}
