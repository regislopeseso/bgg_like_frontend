$(document).ready(function () {
  function loadGames(data = {}) {
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
  loadGames();

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

        $(".table-bestRatedGames tbody").empty(); // Limpa a tabela

        // Acessa a lista de mostPlayedBoardGames
        const bestRatedBG = response.content.bestRatedBoardGames;

        // Verifica se a lista existe e tem elementos
        if (bestRatedBG.length > 0) {
          $.each(bestRatedBG, function (index, bgname) {
            let tr = `
            <tr>
              <td>${index + 1}</td>             
              <td class="text-start">${bgname}</td>         
            </tr>
          `;
            $(".table-bestRatedGames tbody").append(tr);
          });
        } else {
          $(".table-bestRatedGames tbody").append(`
          <tr>
            <td colspan="2">No data available</td>
          </tr>
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }
  loadBestRatedGames();

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

        $(".table-mostPlayedGames tbody").empty(); // Limpa a tabela

        // Acessa a lista de mostPlayedBoardGames
        const mostPlayedBG = response.content.mostPlayedBoardGames;

        // Verifica se a lista existe e tem elementos
        if (mostPlayedBG.length > 0) {
          $.each(mostPlayedBG, function (index, bgname) {
            let tr = `
            <tr>
              <td>${index + 1}</td>             
              <td class="text-start">${bgname}</td>         
            </tr>
          `;
            $(".table-mostPlayedGames tbody").append(tr);
          });
        } else {
          $(".table-mostPlayedGames tbody").append(`
          <tr>
            <td colspan="2">No data available</td>
          </tr>
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }
  loadMostPlayedGames();

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

        $(".table-shortestGames tbody").empty(); // Limpa a tabela

        // Acessa a lista de mostPlayedBoardGames
        const shortestBG = response.content.shortestBoardGames;

        // Verifica se a lista existe e tem elementos
        if (shortestBG.length > 0) {
          $.each(shortestBG, function (index, bgname) {
            let tr = `
            <tr>
              <td>${index + 1}</td>             
              <td class="text-start">${bgname}</td>         
            </tr>
          `;
            $(".table-shortestGames tbody").append(tr);
          });
        } else {
          $(".table-shortestGames tbody").append(`
          <tr>
            <td colspan="2">No data available</td>
          </tr>
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

        $(".table-longestGames tbody").empty(); // Limpa a tabela

        // Acessa a lista de mostPlayedBoardGames
        const longestBG = response.content.longestBoardGames;

        // Verifica se a lista existe e tem elementos
        if (longestBG.length > 0) {
          $.each(longestBG, function (index, bgname) {
            let tr = `
            <tr>
              <td>${index + 1}</td>             
              <td class="text-start">${bgname}</td>         
            </tr>
          `;
            $(".table-longestGames tbody").append(tr);
          });
        } else {
          $(".table-longestGames tbody").append(`
          <tr>
            <td colspan="2">No data available</td>
          </tr>
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

        $(".table-adultsFavoriteGames tbody").empty(); // Limpa a tabela

        // Acessa a lista de mostPlayedBoardGames
        const adultsFavoriteBG = response.content.adultsFavoriteBoardGames;

        // Verifica se a lista existe e tem elementos
        if (adultsFavoriteBG.length > 0) {
          $.each(adultsFavoriteBG, function (index, bgname) {
            let tr = `
            <tr>
              <td>${index + 1}</td>             
              <td class="text-start">${bgname}</td>         
            </tr>
          `;
            $(".table-adultsFavoriteGames tbody").append(tr);
          });
        } else {
          $(".table-adultsFavoriteGames tbody").append(`
          <tr>
            <td colspan="2">No data available</td>
          </tr>
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

        $(".table-teensFavoriteGames tbody").empty(); // Limpa a tabela

        // Acessa a lista de mostPlayedBoardGames
        const adultsFavoriteBG = response.content.teensFavoriteBoardGames;

        // Verifica se a lista existe e tem elementos
        if (adultsFavoriteBG.length > 0) {
          $.each(adultsFavoriteBG, function (index, bgname) {
            let tr = `
            <tr>
              <td>${index + 1}</td>             
              <td class="text-start">${bgname}</td>         
            </tr>
          `;
            $(".table-teensFavoriteGames tbody").append(tr);
          });
        } else {
          $(".table-teensFavoriteGames tbody").append(`
          <tr>
            <td colspan="2">No data available</td>
          </tr>
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
    // $("#secondaryGamesTable").toggle();
  });
});
