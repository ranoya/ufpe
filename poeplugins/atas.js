let atas = function (par) {
  let jsonfile = `https://docs.google.com/spreadsheets/d/1lncqczCIBX0fl9O0XpDt_ogiqQW5iZUKX-kqH6yHNVQ/edit#gid=55426927`;

  getcsvdata(GoogleSheetCsvURL(jsonfile), function (dados) {
    dados.reverse();

    let newarr = select(dados, multipatterncheck_exclude, par);

    let xpto = `
          
          
          <style>

          .gridatas {
            display: grid;
            grid-template-columns: [init] 130px 160px 1fr 1fr 1fr [ fim ];
            gap: 3px 10px;
            width: calc(100vw - 50px);
            margin-left: 20px;
            margin-right: 20px;
            padding-bottom: 20px;
          }

          .groupatas {
                padding: 4px 8px 4px 8px;
                margin: -4px -8px -4px -8px;
                text-decoration: none;
                color: var(--text-color, #bbbbbb);
                font-size: 11px;
                display: inline-block;
                text-transform: uppercase;
            }

          </style>
          
          <div class='gridatas'>

          <div class="groupatas">DATA</div>
          <div class="groupatas">ÓRGÃO</div>
          <div class="groupatas">PAUTA</div>
          <div class="groupatas">DEFERIMENTOS</div>
          <div class="groupatas">INDEFERIMENTOS</div>
          `;

    let temlink = "";
    for (let i = 0; i < newarr.length; i++) {
      xpto += `
                <span class='separaline'></span>`;

      if (
        typeof newarr[i].Link != "undefined" &&
        newarr[i].Link != null &&
        newarr[i].Link != ""
      ) {
        if (
          typeof newarr[i].Data != "undefined" &&
          newarr[i].Data != null &&
          newarr[i].Data != ""
        ) {
          xpto += `<a class='atasdata' target='_blank' href='${newarr[
            i
          ].Link.replace(/\/view\?.*$/, "/preview")}'>${newarr[i].Data}</a>`;
        } else {
          xpto += `<a class='atasdata' target='_blank' href='${newarr[
            i
          ].Link.replace(/\/view\?.*$/, "/preview")}'>---</a>`;
        }
      } else {
        if (
          typeof newarr[i].Data != "undefined" &&
          newarr[i].Data != null &&
          newarr[i].Data != ""
        ) {
          xpto += `<div>${newarr[i].Data}</div>`;
        } else {
          xpto += `<div>---</div>`;
        }
      }

      if (
        typeof newarr[i].Unidade != "undefined" &&
        newarr[i].Unidade != null &&
        newarr[i].Unidade != ""
      ) {
        xpto += `<div>${newarr[i].Unidade}</div>`;
      } else {
        xpto += `<div></div>`;
      }

      if (
        typeof newarr[i].Pontos != "undefined" &&
        newarr[i].Pontos != null &&
        newarr[i].Pontos != ""
      ) {
        xpto += `<div class='ataspontos'>${newarr[i].Pontos.replace(
          /;/g,
          "<br>"
        )}</div>`;
      } else {
        xpto += `<div></div>`;
      }

      if (
        typeof newarr[i].Deferimentos != "undefined" &&
        newarr[i].Deferimentos != null &&
        newarr[i].Deferimentos != ""
      ) {
        xpto += `<div class='atasDeferimentos'>${newarr[i].Deferimentos.replace(
          /;/g,
          "<br>"
        )}</div>`;
      } else {
        xpto += `<div></div>`;
      }

      if (
        typeof newarr[i].Indeferimentos != "undefined" &&
        newarr[i].Indeferimentos != null &&
        newarr[i].Indeferimentos != ""
      ) {
        xpto += `<div class='atasIndeferimentos'>${newarr[
          i
        ].Indeferimentos.replace(/;/g, "<br>")}</div>`;
      } else {
        xpto += `<div></div>`;
      }
    }

    xpto += `
          <span class='separaline'></span>
          </div>
          `;

    present(xpto);
  });
};
