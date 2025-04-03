$(document).ready(function () {
  function loadAllGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/listboardgames",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (!response.content || !Array.isArray(response.content)) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".table-allBoardGames tbody").empty(); // Limpa a tabela
        let tre = `
          <tr>
            <td class="text-start"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `;
        $(".table-allBoardGames tbody").append(tre);

        $.each(response.content, function (index, item) {
          let tr = `
          <tr>
            <td class="text-start">${item.boardGameName}</td>
            <td>${item.avgRating}</td>
            <td>${item.ratingsCount}</td>
            <td>${item.playersCount}</td>
            <td>${item.avgDuration}</td>
            <td>${item.sessionsLogged}</td>
          </tr>
        `;
          $(".table-allBoardGames tbody").append(tr);
        });
        let trf = `
          <tr>
            <td class="text-start"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `;
        $(".table-allBoardGames tbody").append(trf);

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }
  loadAllGames();

  function loadMostPlayedGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.mostPlayedBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".mostPlayedGames").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const mostPlayedBG = response.content.mostPlayedBoardGames;

        // Verifica se a lista existe e tem elementos
        if (mostPlayedBG.length > 0) {
          $.each(mostPlayedBG, function (index, bgname) {
            let firstLetter = bgname[0];
            let allOtherLetters = bgname.slice(1, bgname.length);
            let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
            $(".mostPlayedGames").append(li);
          });
        } else {
          $(".mostPlayedGames").append(`
            <li class="No data available"></li>          
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }
  loadMostPlayedGames();

  function loadBestRatedGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.bestRatedBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".bestRatedGames").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const bestRatedBG = response.content.bestRatedBoardGames;

        // Verifica se a lista existe e tem elementos
        if (bestRatedBG.length > 0) {
          $.each(bestRatedBG, function (index, bgname) {
            let firstLetter = bgname[0];
            let allOtherLetters = bgname.slice(1, bgname.length);
            let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
            $(".bestRatedGames").append(li);
          });
        } else {
          $(".bestRatedGames").append(`
            <li class="No data available"></li>          
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }
  loadBestRatedGames();

  function loadShortestGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.shortestBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".shortestGames").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const shortestBG = response.content.shortestBoardGames;

        // Verifica se a lista existe e tem elementos
        if (shortestBG.length > 0) {
          $.each(shortestBG, function (index, bgname) {
            let firstLetter = bgname[0];
            let allOtherLetters = bgname.slice(1, bgname.length);
            let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
            $(".shortestGames").append(li);
          });
        } else {
          $(".shortestGames").append(`
            <li class="No data available"></li>          
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }
  loadShortestGames();

  function loadLongestGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.longestBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".longestGames").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const longestBG = response.content.longestBoardGames;

        // Verifica se a lista existe e tem elementos
        if (longestBG.length > 0) {
          $.each(longestBG, function (index, bgname) {
            let firstLetter = bgname[0];
            let allOtherLetters = bgname.slice(1, bgname.length);
            let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
            $(".longestGames").append(li);
          });
        } else {
          $(".longestGames").append(`
            <li class="No data available"></li>          
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }
  loadLongestGames();

  function loadAdultsFavoriteGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.adultsFavoriteBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".adultsFavoriteGames").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const adultsFavoriteBG = response.content.adultsFavoriteBoardGames;

        // Verifica se a lista existe e tem elementos
        if (adultsFavoriteBG.length > 0) {
          $.each(adultsFavoriteBG, function (index, bgname) {
            let firstLetter = bgname[0];
            let allOtherLetters = bgname.slice(1, bgname.length);
            let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
            $(".adultsFavoriteGames").append(li);
          });
        } else {
          $(".adultsFavoriteGames").append(`
            <li class="No data available"></li>          
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }
  loadAdultsFavoriteGames();

  function loadTeensFavoriteGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.teensFavoriteBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".teensFavoriteGames").empty(); // Limpa a lista

        // Acessa a lista de mostPlayedBoardGames
        const teensFavoriteBG = response.content.teensFavoriteBoardGames;

        // Verifica se a lista existe e tem elementos
        if (teensFavoriteBG.length > 0) {
          $.each(teensFavoriteBG, function (index, bgname) {
            let firstLetter = bgname[0];
            let allOtherLetters = bgname.slice(1, bgname.length);
            let li = `
            <li><span>${firstLetter}</span>${allOtherLetters}</li>            
          `;
            $(".teensFavoriteGames").append(li);
          });
        } else {
          $(".teensFavoriteGames").append(`
            <li class="No data available"></li>          
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }
  loadTeensFavoriteGames();

  $("#boardGamesRanking").on("click", function () {
    event.preventDefault();

    $("#allGamesTable").toggle();
    $("#bgRankingListsToggler").toggle();
  });
});
