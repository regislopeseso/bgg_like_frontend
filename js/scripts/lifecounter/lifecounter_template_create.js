function life_counter_template_create() {
  let self = this;

  self.IsBuilt = false;

  self.IsUserLoggedIn = false;
  self.CheckAuthenticationStatus = () => {
    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/validatestatus",
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          sweetAlertError("Error", response.message);
          return;
        }

        self.IsUserLoggedIn = response.content.isUserLoggedIn;
      },
      error: function (xhr, status, error) {
        sweetAlertError("Failed to fetch user details. Try again later.");
      },
    });
  };

  self.LifeCounterTemplateId = null;
  self.LifeCounterTemplate = {};
  self.LifeCounterManagerId = null;
  self.PlayersCount = null;

  self.LifeCounterTemplates = [];
  self.GetLifeCounterTemplates = () => {
    self.LifeCounterTemplates = JSON.parse(
      localStorage.getItem("LifeCounterTemplates")
    );
  };
  self.SetLifeCounterTemplates = () => {
    localStorage.setItem(
      "LifeCounterTemplates",
      JSON.stringify(self.LifeCounterTemplates)
    );
  };

  self.LoadReferences = () => {
    self.DOM = $("#main-lifeCounterTemplate-create");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] =
      self.Buttons.LifeCounterTemplate_CreateForm_Close = self.DOM.find(
        "#button-close-lifeCounterTemplate-create"
      );
    self.Buttons[self.Buttons.length] =
      self.Buttons.LifeCounterTemplate_CreateForm_Clear = self.DOM.find(
        "#button-clearCreateForm-lifeCounterTemplate-create"
      );
    self.Buttons[self.Buttons.length] =
      self.Buttons.LifeCounterTemplate_CreateForm_ConfirmCreate = self.DOM.find(
        "#button-confirmCreate-lifeCounterTemplate-create"
      );
    self.Buttons[self.Buttons.length] =
      self.Buttons.LifeCounterTemplate_CreateForm_CreateAndStart =
        self.DOM.find("#button-createAndStart-lifeCounterTemplate-create");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_CreateForm_Name = self.DOM.find(
        "#input-name-lifeCounterTemplate-create"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_CreateForm_PlayersStartingLifePoints =
        self.DOM.find(
          "#input-playersStartingLifePoints-lifeCounterTemplate-create"
        );
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_CreateForm_PlayersCount = self.DOM.find(
        ".players-count-options"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_CreateForm_FixedMaxLifePointsMode =
        self.DOM.find(
          "#input-fixedMaxLifePointsMode-lifeCounterTemplate-create"
        );
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_CreateForm_MaxLifePointsInputWrapper =
        self.DOM.find(
          "#wrapper-PlayersMaxLifePoints-lifeCounterTemplate-create"
        );
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_CreateForm_PlayersMaxLifePoints =
        self.DOM.find("#input-playersMaxLifePoints-lifeCounter-create");
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_CreateForm_AutoDefeatMode = self.DOM.find(
        "#input-autoDefeatMode-lifeCounterTemplate-create"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_CreateForm_AutoEndMode = self.DOM.find(
        "#input-autoEndMode-lifeCounterTemplate-create"
      );

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.LifeCounterManager =
      "/html/lifecounter/lifecounter_manager.html";
  };

  self.RedirectToLifeCounterManager = () => {
    window.location.href = `${self.Locations.LifeCounterManager}`;
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

  self.CheckFormFilling = () => {
    let isNameEmpty =
      self.Inputs.LifeCounterTemplate_CreateForm_Name.val().trim() === "";
    let isLifePointsEmpty =
      self.Inputs.LifeCounterTemplate_CreateForm_PlayersStartingLifePoints.val().trim() ===
      "";

    let isFormValid = !isNameEmpty && !isLifePointsEmpty;

    self.Buttons.LifeCounterTemplate_CreateForm_ConfirmCreate.attr(
      "disabled",
      !isFormValid
    );
    self.Buttons.LifeCounterTemplate_CreateForm_CreateAndStart.attr(
      "disabled",
      !isFormValid
    );
  };
  self.ForceClearForm = () => {
    self.Inputs.LifeCounterTemplate_CreateForm_Name.val("").trigger("focus");

    self.Inputs.LifeCounterTemplate_CreateForm_PlayersStartingLifePoints.val(
      ""
    );
    // self.Inputs.EditTemplate_PlayersCount.eq(self.PlayersCount - 1).removeClass(
    //   "clickedState"
    // );
    // self.Inputs.EditTemplate_PlayersCount.eq(0).addClass("clickedState");
    // self.PlayersCount = 1;
    // self.Inputs.EditTemplate_MaxLifePointsInputWrapper.addClass("d-none");
    // self.Inputs.EditTemplate_FixedMaxLifePointsMode.prop("checked", false);
    // self.Inputs.EditTemplate_AutoDefeatMode.prop("checked", false);
    // self.Inputs.EditTemplate_AutoEndMode.prop("checked", false);
  };

  self.ResetMenuOptions = () => {
    self.RemoveExtraLines();

    self.EditLifeCounterTermplateForm.addClass("d-none");
    self.Togglers.forEach((toggler) => {
      toggler.css("display", "none");
    });

    self.Options.forEach((option) => {
      option.removeClass("chosenMenuOption");
    });
  };

  self.CreateLifeCounterTemplate = (startMode) => {
    self.GetLifeCounterTemplates();

    self.DOM.loadcontent("charge-contentloader");

    //Disable submit button to prevent double submissions
    // const createBtn = self.Buttons.ConfirmCreateLifeCounterTemplate;
    // const createAndStartBtn = self.Buttons.CreateAndStartLifeCounterTemplate;
    // const originalBtnText_create = createBtn.text();
    // const originalBtnText_createAndStart = createAndStartBtn.text();
    // createBtn.attr("disabled", true).text("Submitting...");
    // createAndStartBtn.attr("disabled", true).text("Submitting...");

    if (self.IsUserLoggedIn === false) {
      let countTemplates = self.LifeCounterTemplates.length;
      let virtualId = "lct" + (countTemplates + 1);

      let lifeCounterTemplateName =
        self.Inputs.LifeCounterTemplate_CreateForm_Name.val();
      let doesNameExist = self.LifeCounterTemplates.some(
        (template) =>
          template.LifeCounterTemplateName.trim().toLowerCase() ===
          lifeCounterTemplateName.trim().toLowerCase()
      );
      if (doesNameExist === true) {
        sweetAlertError("Error:", "Life Counter Template Name already exists!");
        return;
      }

      let playersStartingLifePoints =
        self.Inputs.LifeCounterTemplate_CreateForm_PlayersStartingLifePoints.val();

      let playersCount = self.PlayersCount != null ? self.PlayersCount : 1;

      let fixedMaxLifePointsMode =
        self.Inputs.LifeCounterTemplate_CreateForm_FixedMaxLifePointsMode.is(
          ":checked"
        );

      let playesMaxLifePoints =
        self.Inputs.LifeCounterTemplate_CreateForm_FixedMaxLifePointsMode.is(
          ":checked"
        );

      let autoDefeatMode =
        self.Inputs.LifeCounterTemplate_CreateForm_AutoDefeatMode.is(
          ":checked"
        );

      let autoEndMode =
        self.Inputs.LifeCounterTemplate_CreateForm_AutoEndMode.is(":checked");

      let newLifeCounterTemplate = {
        LifeCounterTemplateId: virtualId,
        LifeCounterTemplateName: lifeCounterTemplateName,
        PlayersStartingLifePoints: playersStartingLifePoints,
        PlayersCount: playersCount,
        FixedMaxLifePointsMode: fixedMaxLifePointsMode,
        PlayersMaxLifePoints: playesMaxLifePoints,
        AutoDefeatMode: autoDefeatMode,
        AutoEndMode: autoEndMode,
        LifeCounterManagersCount: 0,
      };

      self.LifeCounterTemplates.push(newLifeCounterTemplate);

      self.SetLifeCounterTemplates();

      return;
    }

    // $.ajax({
    //   type: "POST",
    //   url: "https://localhost:7081/users/createlifecountertemplate",
    //   data: {
    //     LifeCounterTemplateName:
    //       self.Inputs.LifeCounterTemplate_CreateForm_Name.val(),
    //     PlayersStartingLifePoints:
    //       self.Inputs.LifeCounterTemplate_CreateForm_PlayersStartingLifePoints.val(),
    //     PlayersCount: self.PlayersCount,
    //     FixedMaxLifePointsMode:
    //       self.Inputs.LifeCounterTemplate_CreateForm_FixedMaxLifePointsMode.is(
    //         ":checked"
    //       ),
    //     PlayersMaxLifePoints:
    //       self.Inputs.LifeCounterTemplate_CreateForm_PlayersMaxLifePoints.val(),
    //     AutoDefeatMode:
    //       self.Inputs.LifeCounterTemplate_CreateForm_AutoDefeatMode.is(
    //         ":checked"
    //       ),
    //     AutoEndMode:
    //       self.Inputs.LifeCounterTemplate_CreateForm_AutoEndMode.is(":checked"),
    //   },
    //   xhrFields: {
    //     withCredentials: true,
    //   },
    //   success: (resp) => {
    //     if (resp.content == null) {
    //       sweetAlertError(resp.message);
    //       return;
    //     }

    //     self.LifeCounterTemplateId = resp.content.lifeCounterTemplateId;

    //     sweetAlertSuccess(resp.message);

    //     if (startMode == true) {
    //       self.StartLifeCounterManager();
    //       return;
    //     }

    //     self.ForceClearForm(true);
    //   },
    //   error: (err) => {
    //     sweetAlertError(err);
    //   },
    //   complete: () => {
    //     createBtn.attr("disabled", true).text(originalBtnText_create);
    //     createAndStartBtn
    //       .attr("disabled", true)
    //       .text(originalBtnText_createAndStart);

    //     self.DOM.loadcontent("demolish-contentloader");
    //   },
    // });
  };

  self.StartLifeCounterManager = () => {
    self.DOM.loadcontent("charge-contentloader");
    $.ajax({
      type: "POST",
      url: `https://localhost:7081/users/startlifecountermanager?LifeCounterTemplateId=${self.LifeCounterTemplateID}`,
      data: {
        LifeCounterTemplateId: self.LifeCounterTemplateId,
      },
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content != null) {
          self.LifeCounterManagerId = response.content.lifeCounterManagerId;

          sweetAlertSuccess(
            response.message,
            "Life Counter Manager Id: " + self.LifeCounterManagerId
          );

          if (self.LifeCounterManagerId != null) {
            self.RedirectToLifeCounterManager(self.LifeCounterManagerId);
            self.DOM.loadcontent("demolish-contentloader");
          }
        } else {
          sweetAlertError(response.message);
        }
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch requested LIFE COUNTER MANAGER DETAILS."
        );
      },
    });
  };

  self.LoadEvents = () => {
    self.Buttons.LifeCounterTemplate_CreateForm_Close.on("click", function (e) {
      e.preventDefault();

      self.RedirectToLifeCounterManager();
    });

    self.Inputs.LifeCounterTemplate_CreateForm_Name.on("input", () => {
      self.CheckFormFilling();
    });

    self.Inputs.LifeCounterTemplate_CreateForm_PlayersStartingLifePoints.on(
      "input",
      () => {
        self.CheckFormFilling();
      }
    );

    self.Inputs.LifeCounterTemplate_CreateForm_PlayersCount.on(
      "click",
      function (e) {
        e.preventDefault();

        // Remove the class from all
        self.Inputs.LifeCounterTemplate_CreateForm_PlayersCount.removeClass(
          "clickedState"
        );

        // Add class to selected
        $(this).addClass("clickedState");

        // Update the player count
        self.PlayersCount = parseInt($(this).text(), 10);

        self.CheckFormFilling(true);
      }
    );

    self.Inputs.LifeCounterTemplate_CreateForm_FixedMaxLifePointsMode.on(
      "change",
      function (e) {
        if ($(this).is(":checked")) {
          // Checkbox is checked
          self.Inputs.LifeCounterTemplate_CreateForm_MaxLifePointsInputWrapper.removeClass(
            "d-none"
          );
        } else {
          // Checkbox is unchecked
          self.Inputs.LifeCounterTemplate_CreateForm_MaxLifePointsInputWrapper.addClass(
            "d-none"
          );
        }
      }
    );
    self.Inputs.LifeCounterTemplate_CreateForm_AutoDefeatMode.on(
      "change",
      (e) => {
        if (
          !self.Inputs.LifeCounterTemplate_CreateForm_AutoDefeatMode.is(
            ":checked"
          )
        ) {
          self.Inputs.LifeCounterTemplate_CreateForm_AutoEndMode.prop(
            "checked",
            false
          ) // <-- Correct way to uncheck
            .attr("disabled", true); // <-- Properly disables the checkbox
        } else {
          self.Inputs.LifeCounterTemplate_CreateForm_AutoEndMode.prop(
            "disabled",
            false
          ); // Re-enable if needed
        }
      }
    );

    self.Buttons.LifeCounterTemplate_CreateForm_Clear.on("click", () => {
      self.ForceClearForm();
    });

    self.Buttons.LifeCounterTemplate_CreateForm_ConfirmCreate.on(
      "click",
      () => {
        let startMode = false;
        self.CreateLifeCounterTemplate(startMode);
      }
    );

    self.Buttons.LifeCounterTemplate_CreateForm_CreateAndStart.on(
      "click",
      function (e) {
        e.preventDefault();

        //self.CreateLifeCounterTemplate(true);
      }
    );
  };

  self.Build = () => {
    self.LoadReferences();

    self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new life_counter_template_create();
});
