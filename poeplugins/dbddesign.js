let dbddesign = function (par) {
  let linkkey = `link`;
  let namekey = `titulo`;

  let jsonfile = `https://docs.google.com/spreadsheets/d/1lncqczCIBX0fl9O0XpDt_ogiqQW5iZUKX-kqH6yHNVQ/edit#gid=1411182170`;

  getcsvdata(GoogleSheetCsvURL(jsonfile), function (dados) {
    let newarr = select(dados, multipatterncheck_exclude, par);
    let xpto = `<div class="outputgrid">`;

    for (let i = 0; i < newarr.length; i++) {
      xpto += `<a target='_self' href='${newarr[i][linkkey]}'>${newarr[i][namekey]}`;
    }

    xpto += `</div>`;
    present(xpto);
  });
};
