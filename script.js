// Call this function when the user inputs current annual expenses
function handleCurrentExpensesInput() {
    const present = parseFloat(document.getElementById("currentexpenses").value);
    if (!isNaN(present) && present > 0) {
        document.getElementById("withdrawalSection").style.display = 'block';
        // Remove this line as it's causing the output to show
        document.getElementById("output").style.display = 'none'; // Keep output hidden
        futureValue(); // Only calculate future value
    } else {
        document.getElementById("withdrawalSection").style.display = 'none';
        document.getElementById("result").innerHTML = '';
        document.getElementById("output").style.display = 'none';
    }
}

function futureValue() {
    const present = parseFloat(document.getElementById("currentexpenses").value);
    const rate = parseFloat(document.getElementById("inflation").value);
    const fireAge = parseFloat(document.getElementById("retirementage").value);
    const presentAge = parseFloat(document.getElementById("currentage").value);
    
    const time = fireAge - presentAge;

    if (isNaN(present) || present <= 0 || isNaN(rate) || isNaN(fireAge) || isNaN(presentAge)) {
        document.getElementById("result").innerHTML = '';
        return;
    }

    const future = present * Math.pow((1 + (rate / 100)), time);
    const result = document.getElementById("result");
    result.innerHTML = `Your future annual expenses will be $<mark>${future.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</mark>`;
}

function updateMessages() {
    var currentAge = parseFloat(document.getElementById("currentage").value);
    var retirementAge = parseFloat(document.getElementById("retirementage").value);
    var coastFireAge = parseFloat(document.getElementById("coastfireage").value);

    var x = !isNaN(currentAge) && !isNaN(retirementAge) ? retirementAge - currentAge : NaN;
    var y = !isNaN(currentAge) && !isNaN(coastFireAge) ? coastFireAge - currentAge : NaN;

    var messagesDiv = document.getElementById("messages");

    if (!isNaN(x) && !isNaN(y)) {
        messagesDiv.innerHTML = "Nice! You have <mark>" + x.toFixed(1) + "</mark> years until retirement, and <mark>" + y.toFixed(1) + "</mark> years to reach Coast FIRE.";
        messagesDiv.style.display = 'block';
    } else {
        messagesDiv.style.display = 'none';
    }

    if (!isNaN(coastFireAge)) {
        document.querySelector('.marketprofile').style.display = 'block';
    } else {
        document.querySelector('.marketprofile').style.display = 'none';
    }
}

function updateRate() {
    var rateval = document.getElementById("withdrawalrate").value;
    document.getElementById("rate_val").innerText = rateval;
}

 
function calculate() {
    // Hide the output initially
    document.getElementById("output").style.display = 'none';

    const presentExpenses = parseFloat(document.getElementById("currentexpenses").value); 
    const rate = parseFloat(document.getElementById("inflation").value) / 100; 
    const fireAge = parseFloat(document.getElementById("retirementage").value); 
    const presentAge = parseFloat(document.getElementById("currentage").value); 
    const coastFireAge = parseFloat(document.getElementById("coastfireage").value); 
    const nominalMarketReturn = parseFloat(document.getElementById("nomreturn").value) / 100; 
    
    // Calculate future expenses and FIRE number
    const time = fireAge - presentAge;
    const futureExpenses = presentExpenses * Math.pow((1 + rate), time);
    const withdrawalRate = parseFloat(document.getElementById("withdrawalrate").value) / 100;
    const fireNumber = futureExpenses / withdrawalRate;

    // Validate input
    if (isNaN(presentExpenses) || isNaN(rate) || isNaN(fireAge) || isNaN(presentAge) || time <= 0) {
        document.getElementById("fireNumber").innerHTML = "";
        document.getElementById("coastFireNumber").innerHTML = "";
        document.getElementById("monthlyContributions").innerHTML = "";
        return;
    }

    // Calculate coast fire number and monthly payments
    const coastFireNumber = fireNumber / Math.pow((1 + nominalMarketReturn), (fireAge - coastFireAge));
    const initialInvestment = parseFloat(document.getElementById("initialInvestment").value) || 0;
    const yearsToGrow = coastFireAge - presentAge; // Fix this variable

    const FV_initialInvestment = initialInvestment * Math.pow((1 + nominalMarketReturn), yearsToGrow);
    const FV_payments = coastFireNumber - FV_initialInvestment;
    
    let monthlyPayments = 0;
    if (FV_payments > 0 && yearsToGrow > 0) {
        monthlyPayments = ((FV_payments * nominalMarketReturn) / (((1 + nominalMarketReturn) ** yearsToGrow )-1)) / 12;
    }

    // Update the display elements
    document.getElementById("fireNumber").innerHTML = "Fire Number: $<mark>" + fireNumber.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</mark>";
    document.getElementById("coastFireNumber").innerHTML = "Coast Fire Number: $<mark>" + coastFireNumber.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</mark>";
    document.getElementById("monthlyContributions").innerHTML = `You need to invest <mark>$${monthlyPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</mark> monthly in order to reach Coast Fire.`;

    // Show the output section
    document.getElementById("output").style.display = 'block';
}

// Helper function to display results
function displayResults(fireNumber, coastFireNumber, monthlyPayments) {
    document.getElementById("fireNumber").innerHTML = "FIRE Number: $<mark>" + 
        fireNumber.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</mark>";
    document.getElementById("coastFireNumber").innerHTML = "Coast FIRE Number: $<mark>" + 
        coastFireNumber.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</mark>";
    document.getElementById("monthlyContributions").innerHTML = `You need to invest <mark>$${
        monthlyPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</mark> monthly in order to reach Coast FIRE.`;
    
    // Show the output section only after all calculations are complete
    document.getElementById("output").style.display = 'block';
}

// Initialize everything on page load
window.onload = function() {
    // Make sure output is hidden initially
    document.getElementById("output").style.display = 'none';
    
    // Add event listeners
    document.getElementById("currentexpenses").addEventListener("input", handleCurrentExpensesInput);
    
    // Add event listeners for future value updates
    ["inflation", "retirementage", "currentage", "withdrawalrate", "coastfireage", "nomreturn"].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("input", () => {
                // Ensure output stays hidden when other inputs change
                document.getElementById("output").style.display = 'none';
                futureValue();
            });
        }
    });
};
