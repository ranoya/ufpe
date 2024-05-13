let deltaanos = function (arr) {
  let anos = [];

  for (let a = 0; a < arr.length; a++) {
    anos[extraiano(arr[a].Inicio)] = true;
    anos[extraiano(arr[a].Fim)] = true;
  }

  let listano = [];

  let i = 0;

  for (let k in anos) {
    listano[i] = k;
    i++;
  }

  return {
    inicial: Math.min(...listano),
    final: Math.max(...listano),
  };
};

let extraiano = function (valor) {
  let patt = /\d\d\d\d/gi;
  let arr = valor.match(patt);
  return arr[0];
};

let extraimes = function (valor) {
  let patt = /\d{1,2}/gi;
  let arr = valor.match(patt);
  return arr[1];
};

let extraidata = function (dt) {
  let patt = /(\d\d\d\d)/i;

  let hoje = "01/" + (parseInt(dt.getMonth()) + 1) + "/" + dt.getFullYear();

  return hoje;
};

let contames = function (dataA, dataB) {
  let anoI = extraiano(dataA);
  let anoF = extraiano(dataB);
  let mesI = extraimes(dataA);
  let mesF = extraimes(dataB);

  let conta = 0;
  let mescomeca = mesI;

  for (let an = anoI; an <= anoF; an++) {
    while (mescomeca < 12) {
      if (an < anoF || (an == anoF && mescomeca <= mesF)) {
        mescomeca++;
        conta++;
      } else {
        mescomeca = 50;
      }
    }

    mescomeca = 0;
  }

  return conta;
};

let menordata = function (arr) {
  let menorano = deltaanos(arr).inicial;

  let menormes = 12;

  for (let i = 0; i < arr.length; i++) {
    if (extraiano(arr[i].Inicio) == menorano) {
      if (extraimes(arr[i].Inicio) <= menormes) {
        menormes = extraimes(arr[i].Inicio);
      }
    }
  }

  return "01/" + menormes + "/" + menorano;
};

let maiordata = function (arr) {
  let maiorano = deltaanos(arr).final;

  let menormes = 1;

  for (let i = 0; i < arr.length; i++) {
    if (extraiano(arr[i].Fim) == maiorano) {
      if (extraimes(arr[i].Fim) >= menormes) {
        menormes = extraimes(arr[i].Fim);
      }
    }
  }

  return "01/" + menormes + "/" + maiorano;
};

let adicionames = function (dataI, meses) {
  let anoI = extraiano(dataI);
  let mesI = extraimes(dataI);

  let mesA = mesI;
  let anoA = anoI;

  for (let i = 0; i < meses; i++) {
    mesA++;
    if (mesA > 12) {
      mesA = 1;
      anoA++;
    }
  }

  return "01/" + mesA + "/" + anoA;
};

let levantataxos = function (arr, grupo) {
  let newarr = [];
  for (let i = 0; i < arr.length; i++) {
    let separa = arr[i][grupo].split(",");

    for (let k = 0; k < separa.length; k++) {
      if (separa[k] != "") {
        newarr[separa[k].trim()] = true;
      }
    }
  }

  let resultarray = [];
  let c = 0;

  for (let t in newarr) {
    resultarray[c] = t;
    c++;
  }

  return resultarray;
};

let taxoarr = function (arr, taxo) {
  let newarr = [];
  let na = 0;

  let listacriterios = levantataxos(arr, taxo);

  for (let i = 0; i < listacriterios.length; i++) {
    for (let r = 0; r < arr.length; r++) {
      let patt = listacriterios[i];
      if (arr[r][taxo].match(listacriterios[i]) && listacriterios[i] != "") {
        newarr[na] = arr[r];
        na++;
      }
    }
  }

  return newarr;
};

let quantosnataxo = function (arr, grupo, qualtaxo) {
  let quantos = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i][grupo].match(qualtaxo) && arr[i].Atividade != "") {
      quantos++;
    }
  }

  return quantos;
};

let listanos = function (arr) {
  let datas = levantataxos(arr, "Inicio");
  let anos = [];
  for (let i = 0; i < datas.length; i++) {
    anos[i] = {};
    anos[i].registro = extraiano(datas[i]);
  }

  let relacao = levantataxos(anos, "registro");

  return relacao;
};

let timelinerMeses = function (arr, taxo, esp) {
  let whitsp = 25;
  let hoje = extraidata(new Date());

  let vazios = 0;
  for (let c = 0; c < arr.length; c++) {
    if (arr[c].Atividade == "") {
      vazios++;
    }
  }

  let totalY = (arr.length + 1.5 - vazios) * whitsp + 60;
  let agrupa = [];

  if (typeof esp != "undefined") {
    whitsp = esp;
  }

  let paddingtop = (whitsp - 20) / 2;

  let colunas = contames(menordata(arr), maiordata(arr));

  let nomemeses = [
    "",
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];

  if (taxo != "" && typeof taxo != "undefined") {
    agrupa = taxoarr(arr, taxo);
    totalY = (agrupa.length - vazios) * whitsp + 60;
  }

  // identifica o tamanho em pixels do primeiro texto escrito
  let primeirotermo = -5000;
  for (let f = 0; f < arr.length; f++) {
    if (extraiano(arr[f].Inicio) == deltaanos(arr).inicial) {
      if (arr[f].Atividade.length > primeirotermo) {
        primeirotermo = arr[f].Atividade.length / 1.75;
      }
    }
  }
  if (primeirotermo > 30) {
    primeirotermo = 30;
  }

  let html = `<svg class='timeliner' width='${
    primeirotermo * 20 + colunas * 20 + 5
  }' viewBox='0 0 ${primeirotermo * 20 + colunas * 20 + 5} ${totalY + 30}'>
`;

  // desenha os meses

  let iniciaano = 0;

  for (
    let tempo = 0;
    tempo <= contames(menordata(arr), maiordata(arr));
    tempo++
  ) {
    html += `<text class='timelinemarks' x='0' y='0' style='transform: matrix(0, -1, 1, 0, ${
      primeirotermo * 20 + tempo * 20 + 3
    }, 25);'>${
      nomemeses[parseInt(extraimes(adicionames(menordata(arr), tempo)))]
    }</text>
`;

    if (iniciaano != extraiano(adicionames(menordata(arr), tempo))) {
      iniciaano = extraiano(adicionames(menordata(arr), tempo));

      html += `<text text-anchor="end" class='timelinemarks' x='0' y='0' style='transform: matrix(0, -1, 1, 0, ${
        primeirotermo * 20 + tempo * 20 + 3
      }, ${totalY + 5});'>${iniciaano}</text>
`;
    }
  }

  if (taxo == "" || typeof taxo == "undefined") {
    // pinta hoje
    html += `<rect x='${
      primeirotermo * 20 + (contames(menordata(arr), hoje) - 1) * 20
    }' y='30' width='20' height='${totalY - 30}' class='timeliner_hoje' />
`;

    // desenha linhas dos anos

    for (let la = 0; la <= colunas; la++) {
      html += `<line class='timelinerlinhasano' x1='${
        primeirotermo * 20 + la * 20
      }' y1='30' x2='${primeirotermo * 20 + la * 20}' y2='${totalY}' />
`;
    }

    // desenha blocos
    let yb = 0;
    for (let y = 0; y < arr.length; y++) {
      html += `<rect x='${
        primeirotermo * 20 + (contames(menordata(arr), arr[y].Inicio) - 1) * 20
      }' y='${47 + yb * whitsp}' width='${
        contames(arr[y].Inicio, arr[y].Fim) * 20
      }' height='18' class='timelinebox ${arr[y].Estado}' />
`;
      if (y < arr.length - 1 && arr[y + 1].Atividade != "") {
        yb++;
      }
    }

    // desenha os termos
    let ib = 0;
    for (let i = 0; i < arr.length; i++) {
      html += `<text text-anchor="end" x='${
        primeirotermo * 20 +
        (contames(menordata(arr), arr[i].Inicio) - 1) * 20 -
        8
      }' y='${60 + ib * whitsp}' class='timelinelabels'>${
        arr[i].Atividade
      }</text>
`;
      if (arr[i].Atividade != "") {
        ib++;
      }
    }
  } else {
    // desenha blocos taxonomicos
    let pretaxo = 0;
    let qualcss = "";
    let listataxos = levantataxos(arr, taxo);
    let contaitens = 0;

    for (let lt = 0; lt < listataxos.length; lt++) {
      contaitens = quantosnataxo(arr, taxo, listataxos[lt]);

      if (qualcss == "timelinerfundoB") {
        qualcss = "timelinerfundoA";
      } else {
        qualcss = "timelinerfundoB";
      }
      html += `<rect class='${qualcss}' x='0' y='${pretaxo + 45}' width='${
        primeirotermo * 20 + colunas * 20 + 5
      }' height='${contaitens * whitsp}' />

<text text-anchor='end' x='${primeirotermo * 20 + colunas * 20 - 10}' y='${
        pretaxo + 75
      }' class='timelinercategoria'>${listataxos[lt]}</text>
`;
      pretaxo += contaitens * whitsp;
    }

    // pinta hoje
    html += `<rect x='${
      primeirotermo * 20 + (contames(menordata(arr), hoje) - 1) * 20
    }' y='47' width='20' height='${totalY - 62}' class='timeliner_hoje' />
`;

    // desenha linhas dos anos

    for (let la = 0; la <= colunas; la++) {
      html += `<line class='timelinerlinhasano' x1='${
        primeirotermo * 20 + la * 20
      }' y1='30' x2='${primeirotermo * 20 + la * 20}' y2='${totalY}' />
`;
    }

    // desenha blocos
    let yb = 0;
    for (let y = 0; y < agrupa.length; y++) {
      html += `<rect x='${
        primeirotermo * 20 +
        (contames(menordata(agrupa), agrupa[y].Inicio) - 1) * 20
      }' y='${47 + paddingtop + yb * whitsp}' width='${
        contames(agrupa[y].Inicio, agrupa[y].Fim) * 20
      }' height='18' class='timelinebox ${agrupa[y].Estado}' />
`;

      if (y < agrupa.length - 1 && agrupa[y + 1].Atividade != "") {
        yb++;
      }
    }

    // desenha os termos
    let ib = 0;
    for (let i = 0; i < agrupa.length; i++) {
      html += `<text text-anchor="end" x='${
        primeirotermo * 20 +
        (contames(menordata(agrupa), agrupa[i].Inicio) - 1) * 20 -
        8
      }' y='${60 + paddingtop + ib * whitsp}' class='timelinelabels'>${
        agrupa[i].Atividade
      }</text>
`;
      if (i < agrupa.length - 1 && agrupa[i + 1].Atividade != "") {
        ib++;
      }
    }
  }

  html += "</svg>";
  return html;
};

let ppgdbolsas = function (par) {
  let jsonfile = `https://docs.google.com/spreadsheets/d/1tjmcRwo4mLUYKrlitWA1c41T8iWebQcpBjEw77Y5LpU/edit#gid=308662190`;

  getcsvdata(GoogleSheetCsvURL(jsonfile), function (dados) {
    let newarr = select(dados, multipatterncheck_exclude, par);

    let xpto = `
    
        <style>
        .gridcom {
            width: calc(100vw - 50px);
            margin-left: 20px;
            margin-right: 20px;
            padding-bottom: 20px;
            overflow: auto;

        }

        .timeliner {
            overflow: auto;
        }
        
        .timelinerlinhasano {
            stroke-width: thinline;
            stroke: var(--line-separator, #37605f);
            opacity: 0.3;
            
        }

        .timelinelabels {
            font-size: 13px;
            line-height: 20px;
            font-family: Helvetica, Arial, sans-serif !important;
            font-weight: bolder;
            fill: var(--color-link, #bdb5b5);
        }

        .timelinemarks {
            font-size: 9px;
            line-height: 20px;
            font-family: Helvetica, Arial, sans-serif !important;
            font-weight: lighter;
            fill: var(--color-link, #bdb5b5);
        }

        .timelinebox {
            stroke: none;
            stroke-width: 1;
            fill: var(--color-hover, #34f8d1);
        }


        .timelinerfundoA {
            fill: var(--color-link, #bdb5b5);
            opacity: 0.15;
        }

        .timelinerfundoB {
            fill: var(--color-link, #bdb5b5);
            opacity: 0.5;
        }

        .timelinercategoria {
            fill: #00000044;
            font-family: Helvetica, Arial, sans-serif !important;
            font-size: 28px !important;
            font-weight: bolder;
            line-height: 28px;
        }

        .timeliner_hoje {
            fill: var(--text-color, #a7caca);
        }

        </style>
        
        <div class="gridcom">

        `;

    xpto += timelinerMeses(newarr, "Nível");

    xpto += `</div>`;
    present(xpto);
  });
};
