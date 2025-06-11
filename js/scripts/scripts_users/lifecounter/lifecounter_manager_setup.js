function life_counter_manager_setup() {
  let self = this;
  self.defaultPlayersCount = null;

  self.LoadReferences = () => {
    self.DOM = $("#main-lifeCounter-manager-setUp");

    self.Form = self.DOM.find("#form-lifeCounter-manager-setUp");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Close = self.DOM.find(
      "#button-close-lifeCounter-manager-setUp"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.BackToLifeCounterManager =
      self.DOM.find("#button-back-lifeCounter-manager-setUp");
    self.Buttons[self.Buttons.length] = self.Buttons.ClearForm = self.DOM.find(
      "#button-clear-lifeCounter-manager-setup"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Confirm = self.DOM.find(
      "#button-confirm-lifeCounter-manager-setUp"
    );

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.UsersPage =
      "/html/pages_users/users_page.html";

    self.Locations[self.Locations.length] = self.Locations.LifeCounterManager =
      "/html/pages_users/lifecounter/lifecounter_manager.html";

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.GameName = self.DOM.find(
      "#input-gameName-lifeCounter-manager-setup"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.PlayersStartingLifePoints =
      self.DOM.find(
        "#input-PlayersStartingLifePoints-lifeCounter-manager-setup"
      );
    self.Inputs[self.Inputs.length] = self.Inputs.PlayersCount = self.DOM.find(
      ".players-count-options"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.FixedMaxLifePointsMode =
      self.DOM.find("#input-fixedMaxLifePointsMode-lifeCounter-manager-setup");
    self.Inputs[self.Inputs.length] = self.Inputs.MaxLifePointsInputWrapper =
      self.DOM.find("#div-MaxLifePoints-input-wrapper");
    self.Inputs[self.Inputs.length] = self.Inputs.MaxLifePoints = self.DOM.find(
      "#input-MaxLifePoints-lifeCounter-manager-setup"
    );

    self.Inputs[self.Inputs.length] = self.Inputs.AutoEndMode = self.DOM.find(
      "#input-autoEndMode-lifeCounter-manager-setup"
    );
  };

  self.RedirectToUsersPage = () => {
    window.location.href = self.Locations.UsersPage;
  };
  self.RedirectToSetUpLifeCounterPage = () => {
    window.location.href = self.Locations.SetUpLifeCounter;
  };
  self.RedirectToLifeCounterManager = (lifeCounterId) => {
    window.location.href = `${
      self.Locations.LifeCounterManager
    }?id=${encodeURIComponent(lifeCounterId)}`;
  };

  self.PreFillForm = () => {
    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/countlifecounters",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (resp.content === null) {
          sweetAlertError(resp.message);
        } else {
          self.Inputs.GameName.val(
            `Life Counter #${resp.content.lifeCountersCount}`
          )
            .trigger("focus")
            .trigger("select");

          self.Inputs.PlayersCount.eq(0).addClass("clickedState");

          self.defaultPlayersCount = parseInt(
            self.Inputs.PlayersCount.filter(".clickedState").text()
          );
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };
  self.CheckFormFilling = () => {
    let areFieldsFilled = true;
    let isPlayersCountChosen = true;

    $("#form-lifeCounter-manager-setUp .required:visible:enabled").each(
      function () {
        console.log("Results:", $(this).val());
        if ($(this).val().trim() === "") {
          areFieldsFilled = false;
        }
      }
    );

    isPlayersCountChosen =
      self.Inputs.PlayersCount.filter(".clickedState").length > 0;

    console.log("!areFieldsFilled  => ", !areFieldsFilled);
    console.log("!isPlayersCountChosen => ", !isPlayersCountChosen);
    console.log(
      "!areFieldsFilled || !isPlayersCountChosen => ",
      !areFieldsFilled || !isPlayersCountChosen
    );
    // Set disabled state
    $("#button-confirm-lifeCounter-manager-setup").attr(
      "disabled",
      !areFieldsFilled || !isPlayersCountChosen
    );

    // Tooltip logic
    const tooltipMessage = "All fields must be filled";

    if (!areFieldsFilled) {
      self.Buttons.Confirm.parent().attr("title", tooltipMessage);
    } else {
      self.Buttons.Confirm.parent().removeAttr("title");
    }
  };
  self.ClearForm = () => {
    $.each(self.Inputs, function (i, input) {
      input.val("");
    });
    self.Inputs.FixedMaxLifePointsMode.prop("checked", false);
    self.Inputs.MaxLifePointsInputWrapper.fadeOut().addClass("d-none");

    self.Inputs.AutoEndMode.prop("checked", false);

    self.Inputs.GameName.trigger("focus");
    self.Inputs.PlayersCount.removeClass("clickedState");
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

  self.LoadEvents = () => {
    self.Buttons.Close.on("click", function (e) {
      e.preventDefault();
      self.RedirectToLifeCounterManager();
    });

    self.Inputs.FixedMaxLifePointsMode.on("change", function (e) {
      if ($(this).is(":checked")) {
        // Checkbox is checked
        self.Inputs.MaxLifePointsInputWrapper.removeClass("d-none");
      } else {
        // Checkbox is unchecked
        self.Inputs.MaxLifePointsInputWrapper.addClass("d-none");
      }
    });

    self.Buttons.BackToLifeCounterManager.on("click", function (e) {
      e.preventDefault();
      self.RedirectToSetUpLifeCounterPage();
    });

    self.Buttons.ClearForm.on("click", (e) => {
      e.preventDefault();

      self.ClearForm();

      self.CheckFormFilling();
    });

    self.Buttons.Confirm.on("click", (e) => {
      self.ConfirmLifeCounterManagerSetUp();
    });

    // Hook input and change events for form inputs
    self.Form.find(".required:visible:enabled").on("input change", function () {
      self.CheckFormFilling();
    });

    self.Inputs.PlayersCount.on("click", function (e) {
      e.preventDefault();
      // Remove the class from all
      self.Inputs.PlayersCount.removeClass("clickedState");

      self.defaultPlayersCount = parseInt($(this).text());
      console.log("Choosing for: >", self.defaultPlayersCount, "< players..");

      // Add the class to the one that was clicked
      $(this).addClass("clickedState");
    });

    closeOnAnyKey();
  };

  self.SetUpLifeCounterForm = () => {
    $(document)
      .off("submit", self.Form)
      .on("submit", self.Form, function (e) {
        e.preventDefault();

        self.ConfirmLifeCounterManagerSetUp(false);
      });
  };
  self.ConfirmLifeCounterManagerSetUp = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.CreateLifeCounter;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    const formData = new FormData();
    formData.append("Name", self.Inputs.GameName.val());
    formData.append("DefaultPlayersCount", self.defaultPlayersCount);
    formData.append(
      "PlayersStartingLifePoints",
      self.Inputs.PlayersStartingLifePoints.val()
    );
    formData.append(
      "FixedMaxLife",
      self.Inputs.FixedMaxLifePointsMode.is(":checked")
    );
    formData.append("MaxLifePoints", self.Inputs.MaxLifePoints.val());
    formData.append("AutoEndMatch", self.Inputs.AutoEndMode.is(":checked"));

    let lifeCounterId = null;

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/editlifecountermanager",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (resp.content === null) {
          sweetAlertError(resp.message);
        } else {
          if (isPlayMode === true) {
            lifeCounterId = resp.content.lifeCounterId;

            $("body").loadpage("charge");
          } else {
            sweetAlertSuccess(resp.message);
          }
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        submitBtn.attr("disabled", false).text(originalBtnText);
        self.ClearForm();

        if (isPlayMode === true) {
          self.RedirectToLifeCounterManager(lifeCounterId);
        }
      },
    });
  };

  self.Build = () => {
    self.LoadReferences();
    self.LoadEvents();
    self.PreFillForm();
    self.SetUpLifeCounterForm();
  };

  self.Build();
}

$(function () {
  new life_counter_manager_setup();
});
