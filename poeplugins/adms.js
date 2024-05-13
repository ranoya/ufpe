let adms = function (par) {
  let jsonfile = `https://docs.google.com/spreadsheets/d/1lncqczCIBX0fl9O0XpDt_ogiqQW5iZUKX-kqH6yHNVQ/edit#gid=1858811885`;

  getcsvdata(GoogleSheetCsvURL(jsonfile), function (dados) {
    let newarr = select(dados, multipatterncheck_exclude, par);

    let registroscat = unique(newarr, "cargoadm");
    let separaregistros = [];
    let z = 0;
    for (let i = 0; i < registroscat.length; i++) {
      if (
        typeof registroscat[i] != "undefined" &&
        registroscat[i] != "undefined" &&
        registroscat[i] != "" &&
        registroscat[i] != null
      ) {
        separaregistros[z] = {};
        separaregistros[z].cargoadm = registroscat[i];
        z++;
      }
    }

    let categorias = tags(separaregistros, "cargoadm", ",");

    let colunas = "";
    let itemheads = `<div class="gridcom">`;
    let heads = `<span class="categoriacomis">`;

    for (let i = 0; i < categorias.length; i++) {
      colunas += "1fr ";
      heads += ` `;
    }

    for (let i = 0; i < categorias.length; i++) {
      itemheads += `<div class="ithead">${categorias[i]}</div>`;
    }

    heads += `</span>`;
    itemheads += `</div>`;

    let xpto = `
        <style>

        .categoriacomis {
            grid-column: 1 / Span ${categorias.length} !important;
            margin-top: 16px;
            border-bottom: 1px solid var(--line-separator, #dddddd);
            color: var(--text-color, #bbbbbb);
            text-transform: uppercase;
            font-size: 11px;
        }

        .ithead {
            margin-top: 16px;
            color: var(--text-color, #bbbbbb);
            text-transform: uppercase;
            font-size: 11px;
        }

        .gridcom {

            display: grid;
            grid-template-columns: [init] ${colunas} [ fim ];
            gap: 3px 10px;
            width: calc(100vw - 50px);
            margin-left: 20px;
            margin-right: 20px;
            padding-bottom: 20px;

        }

        .itemhead {

        }
        </style>
        
        ${itemheads}

        <div class="gridcom">
        
        ${heads}
        `;

    let patt = "";

    for (let c = 0; c < categorias.length; c++) {
      xpto += `<div>`;

      for (let i = 0; i < newarr.length; i++) {
        if (
          typeof newarr[i].cargoadm != "undefined" &&
          newarr[i].cargoadm != "undefined" &&
          newarr[i].cargoadm != null &&
          newarr[i].cargoadm != ""
        ) {
          patt = String(newarr[i].cargoadm);
          if (patt.match(categorias[c])) {
            xpto += newarr[i].professor + "<br>";
          }
        }
      }

      xpto += `</div>`;
    }

    xpto += `</div>`;
    present(xpto);
  });
};
