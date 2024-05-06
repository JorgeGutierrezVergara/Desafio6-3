const cantidad = document.querySelector("#clp");
const select = document.querySelector(".selector");
const button = document.querySelector(".buscar");
const total = document.querySelector(".total");
const grafico = document.querySelector(".grafico");

let mi_grafico;

button.addEventListener("click", async () => {
  const money = cantidad.value;
  const selected = select.value;

  try {
    const coin_value = await getCoinValues(selected);
    total_value = (money / Number(coin_value)).toFixed(2);

    if (["dolar", "euro"].includes(selected)) {
      total.innerHTML = `Resultado: $${total_value}`;
    } else {
      total.innerHTML = `Resultado: ${total_value}`;
    }

    if (mi_grafico) {
      mi_grafico.destroy();
      data = await getCoinHistory(selected);
      createGraph(data.labels, data.dataValues, selected);
    } else {
      data = await getCoinHistory(selected);
      createGraph(data.labels, data.dataValues, selected);
    }
  } catch (e) {
    total.innerHTML = `Error! Algo salió mal :(`;
  }
});

async function getCoinValues(val) {
  try {
    const res = await fetch("https://mindicador.cl/api/");
    const resjson = await res.json();
    const values = resjson[val];
    return values.valor;
  } catch (e) {
    total.innerHTML = `Error! Algo salió mal :(`;
  }
}

async function getCoinHistory(coin) {
  try {
    const res = await fetch(`https://mindicador.cl/api/${coin}`);
    const resjson = await res.json();
    const history = resjson.serie.slice(0, 10);

    const labels = history.map((data) => data.fecha.slice(0, 10));
    const dataValues = history.map((data) => data.valor);

    return { labels, dataValues };
  } catch (e) {
    total.innerHTML = `Error! Algo salió mal :(`;
  }
}

function createGraph(labels, dataValues, coin) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: `Valor de ${coin}`,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        data: dataValues,
      },
    ],
  };
  mi_grafico = new Chart(grafico, {
    type: "line",
    data: data,
  });
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}

function addData(chart, label, newData) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(newData);
  });
  chart.update();
}
