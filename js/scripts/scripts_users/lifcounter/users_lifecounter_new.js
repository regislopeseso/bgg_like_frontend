function life_counter_new() {
  let self = this;

  self.LoadReferences = () => {
    self.DOM = $("#lifecounter-new");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.CloseNew = self.DOM.find(
      "#close-lifecounter-new"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.BackToSetup =
      self.DOM.find("#back-lifecounter-new");
    self.Buttons[self.Buttons.length] = self.Buttons.ClearForm = self.DOM.find(
      "#clear-lifecounter-new"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.CreateLifeCounter =
      self.DOM.find("#create-lifecounter-new");

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.UsersPage =
      "/html/pages_users/users_page.html";
    self.Locations[self.Locations.length] = self.Locations.SetUpLifeCounter =
      "/html/pages_users/lifecounter/users_lifecounter_setup.html";
    self.Locations[self.Locations.length] = self.Locations.LifeCounter =
      "/html/pages_users/lifecounter/users_lifecounter.html";

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.GameName = self.DOM.find(
      "#name-lifecounter-new"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.StartingLife = self.DOM.find(
      "#players-starting-life-lifecounter-new"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.FixedMaxLife = self.DOM.find(
      "#fixed-max-life-lifecounter-new"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.AutoEndMatch = self.DOM.find(
      "#auto-end-match-lifecounter-new"
    );
  };

  self.RedirectToUsersPage = () => {
    window.location.href = self.Locations.UsersPage;
  };
  self.RedirectToSetUpLifeCounterPage = () => {
    window.location.href = self.Locations.SetUpLifeCounter;
  };
  self.RedirectToLifeCounter = () => {
    window.location.href = self.Locations.LifeCounter;
  };

  self.ClearForm = () => {
    $.each(self.Inputs, function (i, input) {
      input.val("");
    });

    self.Inputs.GameName.trigger("focus");
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

  self.CreateLifeCounter = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "POST",
      url: "https://localhost:7136/admins/creategame",
      data: self.Form.serialize(),

      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        self.forceClearForm();

        sweetAlertSuccess(resp.message);
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        // Re-enable button
        submitBtn.attr("disabled", true).text(originalBtnText);
        self.ClearForm();
      },
    });
  };

  self.LoadEvents = () => {
    self.Buttons.CloseNew.on("click", function (e) {
      e.preventDefault();
      self.RedirectToUsersPage();
    });

    self.Buttons.BackToSetup.on("click", function (e) {
      e.preventDefault();
      self.RedirectToSetUpLifeCounterPage();
    });

    self.Buttons.ClearForm.on("click", (e) => {
      e.preventDefault();

      self.ClearForm();
    });

    self.Buttons.CreateLifeCounter.on("click", (e) => {
      e.preventDefault();
      self.RedirectToLifeCounter();
    });
  };

  self.Build = () => {
    self.LoadReferences();
    self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new life_counter_new();
});
