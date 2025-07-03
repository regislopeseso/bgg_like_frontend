function life_counter_template_edit() {
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

  self.LifeCounterTemplates = null;
  self.LifeCounterTemplate = null;

  self.LifeCounterTemplates = [];
  self.GetLifeCounterTemplates = () => {
    return JSON.parse(localStorage.getItem("LifeCounterTemplates"));
  };
  self.SetLifeCounterTemplates = () => {
    localStorage.setItem(
      "LifeCounterTemplates",
      JSON.stringify(self.LifeCounterTemplates)
    );
  };

  self.GetLifeCounterTemplate = () => {
    return JSON.parse(localStorage.getItem("LifeCounterTemplate"));
  };
  self.SetLifeCounterTemplate = () => {
    localStorage.setItem(
      "LifeCounterTemplate",
      JSON.stringify(self.LifeCounterTemplate)
    );
  };

  self.LoadReferences = () => {
    self.DOM = $("#main-lifeCounterTemplate-edit");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] =
      self.Buttons.LifeCounterTemplate_EditForm_Close = self.DOM.find(
        "#button-close-lifeCounterTemplate-edit"
      );
    self.Buttons[self.Buttons.length] =
      self.Buttons.LifeCounterTemplate_EditForm_Clear = self.DOM.find(
        "#button-clearEditForm-lifeCounterTemplate-edit"
      );
    self.Buttons[self.Buttons.length] =
      self.Buttons.LifeCounterTemplate_EditForm_ConfirmCreate = self.DOM.find(
        "#button-confirmCreate-lifeCounterTemplate-edit"
      );
    self.Buttons[self.Buttons.length] =
      self.Buttons.LifeCounterTemplate_EditForm_CreateAndStart = self.DOM.find(
        "#button-createAndStart-lifeCounterTemplate-edit"
      );

    self.Inputs = [];
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_EditForm_Name = self.DOM.find(
        "#input-name-lifeCounterTemplate-edit"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_EditForm_PlayersStartingLifePoints =
        self.DOM.find(
          "#input-playersStartingLifePoints-lifeCounterTemplate-edit"
        );
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_EditForm_PlayersCount = self.DOM.find(
        ".players-count-options"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_EditForm_FixedMaxLifePointsMode =
        self.DOM.find("#input-fixedMaxLifePointsMode-lifeCounterTemplate-edit");
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_EditForm_MaxLifePointsInputWrapper =
        self.DOM.find("#wrapper-PlayersMaxLifePoints-lifeCounterTemplate-edit");
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_EditForm_PlayersMaxLifePoints =
        self.DOM.find("#input-playersMaxLifePoints-lifeCounterTemplate-edit");
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_EditForm_AutoDefeatMode = self.DOM.find(
        "#input-autoDefeatMode-lifeCounterTemplate-edit"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.LifeCounterTemplate_EditForm_AutoEndMode = self.DOM.find(
        "#input-autoEndMode-lifeCounterTemplate-edit"
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

  self.PreFillEditForm = () => {
    self.LifeCounterTemplate = self.GetLifeCounterTemplate();

    let template = self.LifeCounterTemplate;

    self.Inputs.LifeCounterTemplate_EditForm_Name.val(
      template.LifeCounterTemplateName
    )
      .trigger("focus")
      .trigger("select");
  };
  self.CheckFormFilling = () => {
    let isNameEmpty =
      self.Inputs.LifeCounterTemplate_EditForm_Name.val().trim() === "";
    let isLifePointsEmpty =
      self.Inputs.LifeCounterTemplate_EditForm_PlayersStartingLifePoints.val().trim() ===
      "";

    let isFormValid = !isNameEmpty && !isLifePointsEmpty;

    self.Buttons.LifeCounterTemplate_EditForm_ConfirmCreate.attr(
      "disabled",
      !isFormValid
    );
    self.Buttons.LifeCounterTemplate_EditForm_CreateAndStart.attr(
      "disabled",
      !isFormValid
    );
  };
  self.ForceClearForm = () => {
    self.Inputs.LifeCounterTemplate_EditForm_Name.val("").trigger("focus");

    self.Inputs.LifeCounterTemplate_EditForm_PlayersStartingLifePoints.val("");
  };

  self.EditLifeCounterTemplate = () => {
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
        self.Inputs.LifeCounterTemplate_EditForm_Name.val();

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
        self.Inputs.LifeCounterTemplate_EditForm_PlayersStartingLifePoints.val();

      let playersCount = self.PlayersCount != null ? self.PlayersCount : 1;

      let fixedMaxLifePointsMode =
        self.Inputs.LifeCounterTemplate_EditForm_FixedMaxLifePointsMode.is(
          ":checked"
        );

      let playersMaxLifePoints = null;
      if (fixedMaxLifePointsMode === true) {
        playersMaxLifePoints =
          self.Inputs.LifeCounterTemplate_EditForm_PlayersMaxLifePoints.val();
      }

      let autoDefeatMode =
        self.Inputs.LifeCounterTemplate_EditForm_AutoDefeatMode.is(":checked");

      let autoEndMode =
        self.Inputs.LifeCounterTemplate_EditForm_AutoEndMode.is(":checked");

      let newLifeCounterTemplate = {
        LifeCounterTemplateId: virtualId,
        LifeCounterTemplateName: lifeCounterTemplateName,
        PlayersStartingLifePoints: playersStartingLifePoints,
        PlayersCount: playersCount,
        FixedMaxLifePointsMode: fixedMaxLifePointsMode,
        PlayersMaxLifePoints: playersMaxLifePoints,
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
    //       self.Inputs.LifeCounterTemplate_EditForm_Name.val(),
    //     PlayersStartingLifePoints:
    //       self.Inputs.LifeCounterTemplate_EditForm_PlayersStartingLifePoints.val(),
    //     PlayersCount: self.PlayersCount,
    //     FixedMaxLifePointsMode:
    //       self.Inputs.LifeCounterTemplate_EditForm_FixedMaxLifePointsMode.is(
    //         ":checked"
    //       ),
    //     PlayersMaxLifePoints:
    //       self.Inputs.LifeCounterTemplate_EditForm_PlayersMaxLifePoints.val(),
    //     AutoDefeatMode:
    //       self.Inputs.LifeCounterTemplate_EditForm_AutoDefeatMode.is(
    //         ":checked"
    //       ),
    //     AutoEndMode:
    //       self.Inputs.LifeCounterTemplate_EditForm_AutoEndMode.is(":checked"),
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

  self.LoadEvents = () => {
    self.Buttons.LifeCounterTemplate_EditForm_Close.on("click", function (e) {
      e.preventDefault();

      self.RedirectToLifeCounterManager();
    });

    self.Inputs.LifeCounterTemplate_EditForm_Name.on("input", () => {
      self.CheckFormFilling();
    });

    self.Inputs.LifeCounterTemplate_EditForm_PlayersStartingLifePoints.on(
      "input",
      () => {
        self.CheckFormFilling();
      }
    );

    self.Inputs.LifeCounterTemplate_EditForm_PlayersCount.on(
      "click",
      function (e) {
        e.preventDefault();

        // Remove the class from all
        self.Inputs.LifeCounterTemplate_EditForm_PlayersCount.removeClass(
          "clickedState"
        );

        // Add class to selected
        $(this).addClass("clickedState");

        // Update the player count
        self.PlayersCount = parseInt($(this).text(), 10);

        self.CheckFormFilling(true);
      }
    );

    self.Inputs.LifeCounterTemplate_EditForm_FixedMaxLifePointsMode.on(
      "change",
      function (e) {
        if ($(this).is(":checked")) {
          // Checkbox is checked
          self.Inputs.LifeCounterTemplate_EditForm_MaxLifePointsInputWrapper.removeClass(
            "d-none"
          );
        } else {
          // Checkbox is unchecked
          self.Inputs.LifeCounterTemplate_EditForm_MaxLifePointsInputWrapper.addClass(
            "d-none"
          );
        }
      }
    );
    self.Inputs.LifeCounterTemplate_EditForm_AutoDefeatMode.on(
      "change",
      (e) => {
        if (
          !self.Inputs.LifeCounterTemplate_EditForm_AutoDefeatMode.is(
            ":checked"
          )
        ) {
          self.Inputs.LifeCounterTemplate_EditForm_AutoEndMode.prop(
            "checked",
            false
          ) // <-- Correct way to uncheck
            .attr("disabled", true); // <-- Properly disables the checkbox
        } else {
          self.Inputs.LifeCounterTemplate_EditForm_AutoEndMode.prop(
            "disabled",
            false
          ); // Re-enable if needed
        }
      }
    );

    self.Buttons.LifeCounterTemplate_EditForm_Clear.on("click", () => {
      self.ForceClearForm();
    });

    self.Buttons.LifeCounterTemplate_EditForm_ConfirmCreate.on("click", () => {
      let startMode = false;
      self.CreateLifeCounterTemplate(startMode);
    });

    self.Buttons.LifeCounterTemplate_EditForm_CreateAndStart.on(
      "click",
      function (e) {
        e.preventDefault();

        //self.CreateLifeCounterTemplate(true);
      }
    );
  };

  self.Build = () => {
    self.LoadReferences();

    self.PreFillEditForm();

    //self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new life_counter_template_edit();
});
