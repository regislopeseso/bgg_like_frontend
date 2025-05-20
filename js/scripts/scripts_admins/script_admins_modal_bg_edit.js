function modal_BG_Edit() {
  let self = this;
  self.IsBuilt = false;

  self.LoadReferences = () => {
    self.DOM = $("#bg-add-edit-modal");

    self.Form = $("#bg-add-edit-form");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.Required =
      self.DOM.find(".required");
    self.Inputs[self.Inputs.length] = self.Inputs.BgName =
      self.DOM.find("#new-bg-name");
    self.Inputs[self.Inputs.length] = self.Inputs.BgDescription = self.DOM.find(
      "#new-bg-description"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.BgMinPlayers = self.DOM.find(
      "#new-bg-min-players"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.BgMaxPlayers = self.DOM.find(
      "#new-bg-max-players"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.BgMinAge =
      self.DOM.find("#new-bg-min-age");

    self.SelectCategory = $("#new-bg-category-select");
    self.SelectMechanics = $("#new-bg-mechanics-select");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Submit =
      self.DOM.find("#bg-submit-button");
    self.Buttons[self.Buttons.length] = self.Buttons.Reset = self.DOM.find(
      "#reset-add-edit-bg-form"
    );
  };

  self.LoadEvents = () => {
    self.Buttons.Submit.on("click", function (e) {
      e.preventDefault();

      self.SetUpAddBgForm();
    });

    self.Buttons.Reset.on("click", function (e) {
      self.forceClearForm();
    });

    self.CheckForm();
  };

  self.loadCategories = () => {
    // First destroy any existing select2 instance to prevent duplicates
    if ($("#new-bg-category-select").hasClass("select2-hidden-accessible")) {
      $("#new-bg-category-select").select2("destroy");
    }

    // Fetch the category list once from the backend
    fetch("https://localhost:7081/admins/showcategories", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) {
          console.error("Failed to load categories:", data.message);
          return;
        }

        const categories = data.content.map((item) => ({
          id: item.categoryId,
          text: item.categoryName,
        }));

        $("#new-bg-category-select").select2({
          data: categories,
          dropdownParent: self.DOM,
          placeholder: "Select a category",
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
        console.error("Error fetching categories:", err);
      });
  };

  self.loadMechanics = () => {
    // First destroy any existing select2 instance to prevent duplicates
    if ($("#new-bg-mechanics-select").hasClass("select2-hidden-accessible")) {
      $("#new-bg-mechanics-select").select2("destroy");
    }

    // First, fetch the category list once from the backend
    fetch("https://localhost:7081/admins/showmechanics", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.content) {
          console.error("Failed to load mechanics:", data.message);
          return;
        }

        const mechanics = data.content.map((item) => ({
          id: item.mechanicId,
          text: item.mechanicName,
        }));

        $("#new-bg-mechanics-select").select2({
          data: mechanics,
          dropdownParent: self.DOM,
          placeholder: "Select mechanics",
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
        console.error("Error fetching mechanics:", err);
      });
  };

  self.checkFormFilling = () => {
    let areFieldsFilled = true;

    const isCategorySelected =
      self.SelectCategory.val() !== null && self.SelectCategory.val() !== "";

    const areMechanicsSelected =
      self.SelectMechanics.val() !== null && self.SelectMechanics.val() !== "";

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

    self.Buttons.Submit.prop(
      "disabled",
      !(areFieldsFilled && isCategorySelected && areMechanicsSelected)
    );
  };

  self.CheckForm = () => {
    // React to mechanics selection
    self.SelectMechanics.on("select2:select", self.checkFormFilling);
    self.SelectMechanics.on("select2:clear", () => {
      self.checkFormFilling();
    });
    // React to category selection
    self.SelectCategory.on("select2:select", self.checkFormFilling);
    self.SelectCategory.on("select2:clear", () => {
      self.checkFormFilling();
    });
    // React to typing in any input
    self.Inputs.Required.on("input", self.checkFormFilling);
    // React to clicking on the clear button:
    self.Buttons.Reset.on("click", () => {
      self.forceClearForm();
    });
  };

  self.forceClearForm = () => {
    // Block form submission button
    self.Buttons.Submit.prop("disabled", true);

    //Clear form
    self.Inputs.forEach((input) => {
      input.val(null);
    });

    // Clear catergory and mechanics selection
    self.SelectCategory.trigger("change");
    self.SelectMechanics.trigger("change");
  };

  self.SetUpAddBgForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    console.log(self.Form.serialize());

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/admins/addboardgame",
      data: self.Form.serialize(),

      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        alert(resp.message);

        self.forceClearForm();
      },
      error: (err) => {
        alert(err);
      },
      complete: () => {
        // Re-enable button
        submitBtn.attr("disabled", true).text(originalBtnText);
      },
    });
  };

  self.SetUpEditBgForm = () => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.Submit;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    console.log(self.Form.serialize());

    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/admins/editboardgame",
      data: self.Form.serialize(),

      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        alert(resp.message);

        self.forceClearForm();
      },
      error: (err) => {
        alert(err);
      },
      complete: () => {
        // Re-enable button
        submitBtn.attr("disabled", true).text(originalBtnText);
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
    self.loadCategories();
    self.loadMechanics();
    self.LoadEvents();
    self.IsBuilt = true;
  };

  self.OpenModal = () => {
    self.Show();
  };

  self.CloseModal = () => {};

  self.BuildModal();
}
