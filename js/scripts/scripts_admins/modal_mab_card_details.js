function modal_Mab_Card_Details() {
  let self = this;
  self.IsBuilt = false;
  self.isDeleteMode = false;
  self.currentMabCardId = null;
  self.onSuccessCallback = null;

  self.LoadReferences = () => {
    self.DOM = $("#dom-modal-mab-card-details");

    self.ModalTitle = self.DOM.find("#title-modal-mab-card-details");

    self.ModalBody = self.DOM.find(".modal-body");

    self.ModalBox = self.DOM.find("#modalbox-modal-mab-card-details");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Confirm = self.DOM.find(
      "#button-modal-mab-card-details"
    );

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.CardName = self.DOM.find(
      "#span-modal-card-details-card-name"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.CardPower = self.DOM.find(
      "#span-modal-card-details-card-power"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.CardUpperHand = self.DOM.find(
      "#span-modal-card-details-card-upper-hand"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.CardType = self.DOM.find(
      "#img-modal-card-details-card-type"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.CardCode = self.DOM.find(
      "#span-modal-card-details-card-code"
    );

    self.Imgs = [];
    self.Imgs[self.Imgs.length] =
      self.Imgs.MabCardTypeNeutral = `/images/icons/mab_card_types/cardtype_neutral.svg`;
    self.Imgs[self.Imgs.length] =
      self.Imgs.MabCardTypeRanged = `/images/icons/mab_card_types/cardtype_ranged.svg`;
    self.Imgs[self.Imgs.length] =
      self.Imgs.MabCardTypeCavalry = `/images/icons/mab_card_types/cardtype_cavalry.svg`;
    self.Imgs[self.Imgs.length] =
      self.Imgs.MabCardTypeInfantry = `/images/icons/mab_card_types/cardtype_infantry.svg`;
    self.Imgs[self.Imgs.length] =
      self.Imgs.MabCardTruce = `/images/icons/mab_card_types/neutral/truce.svg`;
    self.Imgs[self.Imgs.length] =
      self.Imgs.MabCardPickeAxe = `/images/icons/mab/card_types/pickeaxe_infantry.svg`;
  };

  self.LoadEvents = () => {
    self.Buttons.Confirm.on("click", function (e) {
      e.preventDefault();
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
  function sweetAlertWarning(title_text, message_text) {
    Swal.fire({
      position: "center",
      confirmButtonText: "OK!",
      icon: "warning",
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
      url: `https://localhost:7081/admins/showmabcarddetails?CardId=${self.currentMabCardId}`,
      xhrFields: {
        withCredentials: true,
      },
      success: function (resp) {
        if (!resp.content) {
          sweetAlertError("Failed to fetch card details:", response.message);
          return;
        }

        let card = resp.content;

        console.log("self.Inputs.CardName: ", self.Inputs.CardName);

        self.Inputs.CardName.html(card.cardName);
        self.Inputs.CardPower.html(card.cardPower);
        self.Inputs.CardUpperHand.html(card.cardUpperHand);
        self.Inputs.CardCode.html(card.cardCode);

        let imgPath = "";

        switch (card.cardType) {
          case "Neutral":
            imgPath = self.Imgs.MabCardTypeNeutral;

            imgPath =
              card.cardPower === 0 && card.cardUpperHand === 0
                ? self.Imgs.MabCardTruce
                : self.Imgs.MabCardTypeNeutral;
            break;
          case "Ranged":
            imgPath = self.Imgs.MabCardTypeRanged;
            break;
          case "Cavalry":
            imgPath = self.Imgs.MabCardTypeCavalry;
            break;
          case "Infantry":
            imgPath =
              card.cardPower === card.cardUpperHand
                ? self.Imgs.MabCardPickeAxe
                : self.Imgs.MabCardTypeInfantry;
            break;
          default:
            sweetAlertError("Failed to fetch mab card type");
            break;
        }

        self.Inputs.CardType.attr("src", imgPath);

        self.RemoveContentLoader();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching card details:", error);
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

  self.OpenCardDetails = (mabCardId, onSuccessCallback) => {
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
