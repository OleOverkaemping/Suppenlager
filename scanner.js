function startScan() {
    const resultEl = document.getElementById('scan-result');
    resultEl.innerText = "Frage Kamera an...";

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-container'),
            constraints: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: "environment" // Rückkamera
            },
        },
        decoder: {
            readers: ["ean_reader", "ean_8_reader"]
        },
        locate: true
    }, function (err) {
        if (err) {
            console.error(err);
            var msg = "";
            if (err.name === "NotAllowedError") {
                msg = "Die App ist nicht berechtigt auf die Kamera zuzugreifen." +
                    "Bitte in den Einstellungen die Kamera auf 'Erlauben' oder 'Fragen' stellen."
            }
            else {
                msg = "Fehler: " + err.name;
            }
            resultEl.innerHTML = msg;
            return;
        }
        Quagga.start();
        resultEl.innerText = "Warte auf Barcode...";
    });
}

Quagga.onDetected((data) => {
    const code = data.codeResult.code;
    const resultEl = document.getElementById('scan-result');

    resultEl.innerHTML = "Erkannt: <span class='status-ok'>" + code + "</span>";

    if (navigator.vibrate) navigator.vibrate(200);
    Quagga.stop();
});