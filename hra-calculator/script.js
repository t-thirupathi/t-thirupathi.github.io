function calculateHRA() {
    const basic_pay = parseFloat(document.getElementById("basic_pay").value);
    const hra = parseFloat(document.getElementById("hra").value);
    const rent = parseFloat(document.getElementById("rent").value);
    const metro_city = document.getElementById("metro_city").checked;

    const basic_ratio = metro_city ? 0.50 : 0.40;
    const basic_40 = basic_ratio * basic_pay;
    let rent_over_basic_10 = rent - 0.10 * basic_pay;
    rent_over_basic_10 = Math.max(0, rent_over_basic_10);
    const result = Math.min(basic_40, hra, rent_over_basic_10);

    document.getElementById("result").textContent = `Calculated HRA: ${result.toFixed(2)}`;
}
