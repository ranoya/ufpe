let cppd = function (par) {
  let jsonfile = `https://docs.google.com/spreadsheets/d/1tOhc22AxUFcwH6AZ1GcUvmTTYpCTJw6UB-3uUg8Cuzc/edit#gid=0`;

  getcsvdata(GoogleSheetCsvURL(jsonfile), function (dados) {
    let pautas = select(dados, multipatterncheck_exclude, par);

    let code = `
        
        <style>
        .tabelaNotas {
            display: grid;
            grid-template-columns: [inicio] 90px 1fr 160px 2fr [fim];
            gap: 4px 16px;
            width: calc(100vw - 50px);
            margin-left: 20px;
            margin-right: 20px;
            padding-bottom: 20px;
            
        }

        .pulalinha {
            grid-column: inicio / fim;
            border-top: 1px solid var(--line-separator, #e9ecee);
            height: 1px;
        }

        .separaplenos {
            grid-column: inicio / fim;
            font-weight: bolder;
            font-size: 22px;
            padding-top: 30px;
        }

        .datareuniao {
            font-size: 12px;
            color: var(--color-link, #c4c6ca);
            width: 100%;
            line-height: 16px;
            border-bottom: 1px solid var(--line-separator, #e9ecee);
            margin-bottom: 15px;
            grid-column: 1 / Span 2;
            padding-bottom: 5px;
            padding-top: 5px;
            margin-top: 30px;
        }

        .botaoatas {
            margin-left: 20px;
            color: var(--color-hover, #ffaa46);
            background-color: var(--line-separator, #e9ecee);
            padding-right: 8px;
            padding-left: 8px;
            padding-top: 5px;
            padding-bottom: 5px;
            margin-top: -5px;
            margin-bottom: -5px;
            text-decoration: none !important;

        }

        .botaoatas:hover {
            background-color: var(--color-hover, #ffaa46);
            color: var(--color-link, #c4c6ca);
        }

        .voltaaonormal {
            margin-left: 0;
        }

        .datapadding {
            padding-right: 8px;
            padding-left: 8px;
            padding-top: 5px;
            padding-bottom: 5px;
            margin-top: -5px;
            marrgin-bottom: -5px;
        }

        .datamenor {
            font-size: 12px;
        }

        .docslinks {
            margin-left: 25px;
        }

        .linkpequeno {
            font-size: 13px;
            line-height: 15px;
        }

        .checkmark {
            font-size: 12px;
            line-height: 14px;
            text-align: right;
            color: green;
        }

        .mao {
            font-size: 20px;
            line-height: 30px;
            vertical-align: middle;
            font-weight: bolder;
        }

        .Deferido {
            color: #005599 !important;
        }

        .Indeferido {
            color: #770000 !important;
        }

        .custombutton {
            display: inline-block;
            font-size: 16px;
            line-height: 26px;
            height: 26px;
            border: 3px solid var(--line-separator, #e9ecee);
            padding-left: 10px;
            padding-right: 10px;
            background-color: var(--line-separator, #e9ecee);
            cursor: pointer;
            margin-right: 6px;
            color: white;
        }

        .custombutton:hover {
            background-color: var(--color-hover, #ffaa46);
            border: 3px solid var(--color-hover, #ffaa46);
        }

        </style>


        <div class='tabelaNotas'><div class='datamenor'>Data</div><div class='datamenor'>Título</div><div class='datamenor'>Registro</div><div class='datamenor'>Resumo</div>`;

    for (let p = pautas.length - 1; p >= 0; p--) {
      code += `<div class='pulalinha'></div>`;

      code += `<div class='datapadding datamenor' style='padding-left: 0 !important;'>${pautas[p].Data}</div>`;

      code += `<div>${pautas[p].Titulo}<br></div>`;

      if (
        typeof pautas[p]["Link-Doc"] != "undefined" &&
        pautas[p]["Link-Doc"] != null &&
        pautas[p]["Link-Doc"] != ""
      ) {
        code += `<div><a target='_blank' class='botaoatas voltaaonormal datamenor' href='${pautas[p]["Link-Doc"]}'>${pautas[p]["Número de Registro"]}</a></div>`;
      } else {
        code += `<div class='datapadding datamenor'>${pautas[p]["Número de Registro"]}</div>`;
      }

      code += `<div>${pautas[p].Resumo}<br></div>`;
    }

    code += `</div>`;

    present(code);
  });
};
