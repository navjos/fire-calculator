
// Call this function when the user inputs current annual expenses
function handleCurrentExpensesInput() {
    const present = parseFloat(document.getElementById("currentexpenses").value);
    if (!isNaN(present) && present > 0) {
        document.getElementById("withdrawalSection").style.display = 'block';
        updateCalculations();
    } else {
        document.getElementById("withdrawalSection").style.display = 'none';
        document.getElementById("result").innerHTML = '';
    }
}


// Main function to update all calculations
function updateCalculations() {
    futureValue();
    calculateFireAndCoastFireNumbers();
    updateMessages();
}
// Consolidated window.onload function
window.onload = function() {
    checkPersonalProfile();
    
    // Add event listener for current expenses
    document.getElementById("currentexpenses").addEventListener("input", handleCurrentExpensesInput);

    // Add event listeners for other fields
    const inputElements = [
        "inflation",
        "retirementage",
        "currentage",
        "withdrawalrate",
        "coastfireage",
        "nomreturn"
    ];

    inputElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener("input", futureValue);
        }
    });
};


function futureValue() {
    const present = parseFloat(document.getElementById("currentexpenses").value);
    const rate = parseFloat(document.getElementById("inflation").value);
    const futureAge = parseInt(document.getElementById("retirementage").value);
    const presentAge = parseInt(document.getElementById("currentage").value);
    
    const time = futureAge - presentAge;

    if (isNaN(present) || present <= 0 || isNaN(rate) || isNaN(futureAge) || isNaN(presentAge)) {
        document.getElementById("result").innerHTML = ''; // Clear result if input is invalid
        return;
    }

    const future = present * Math.pow((1 + (rate / 100)), time);
    const result = document.getElementById("result");
    result.innerHTML = `Your future annual expenses will be $<mark>${future.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</mark>`;
}

function checkPersonalProfile() {
    var currentAge = document.getElementById("currentage").value;
    var retirementAge = document.getElementById("retirementage").value;
    var coastFireAge = document.getElementById("coastfireage").value;

    // Check if all fields are filled
    if (currentAge && retirementAge && coastFireAge) {
        // Show the Market Profile if all fields are filled
        document.querySelector('.marketprofile').style.display = 'block';
    } else {
        // Hide the Market Profile if any field is empty
        document.querySelector('.marketprofile').style.display = 'none';
    }
}

function updateMessages() {
    var currentAge = parseFloat(document.getElementById("currentage").value); // Changed to parseFloat
    var retirementAge = parseFloat(document.getElementById("retirementage").value); // Changed to parseFloat
    var coastFireAge = parseFloat(document.getElementById("coastfireage").value); // Changed to parseFloat

    // Calculate years until retirement and years to reach Coast Fire
    var x = !isNaN(currentAge) && !isNaN(retirementAge) ? retirementAge - currentAge : NaN; 
    var y = !isNaN(currentAge) && !isNaN(coastFireAge) ? coastFireAge - currentAge : NaN;

    var messagesDiv = document.getElementById("messages");

    if (!isNaN(x) && !isNaN(y)) {
        messagesDiv.innerHTML = "Nice! You have <mark>" + x.toFixed(1) + "</mark> years until retirement, and <mark>" + y.toFixed(1) + "</mark> years to reach Coast Fire.";
        messagesDiv.style.display = 'block'; // Show the message
    } else {
        messagesDiv.style.display = 'none'; // Hide message if input is invalid
    }

    // Show the Market Profile if Coast Fire Age is filled
    if (!isNaN(coastFireAge)) {
        document.querySelector('.marketprofile').style.display = 'block';
    } else {
        document.querySelector('.marketprofile').style.display = 'none';
    }
}


function showMarketProfile() {
    // Show the Market Profile section
    document.querySelector('.marketprofile').style.display = 'block';
}

// New function to show the savings plan section
function showSavingsPlan() {
    document.getElementById("savingsPlan").style.display = 'block'; // Show savings plan section
}

function calculateSavingsPlan() {
    // Get values from inputs and calculations
    const coastFireNumber = parseFloat(document.getElementById("savingsGoal").value.replace(/,/g, ''));
    const initialInvestment = parseFloat(document.getElementById("initialInvestment").value);
    const currentAge = parseInt(document.getElementById("currentage").value);
    const coastFireAge = parseInt(document.getElementById("coastfireage").value);
    const nominalMarketReturn = parseFloat(document.getElementById("nomreturn").value) / 100; // Convert percentage to decimal

    // Calculate years to grow
    const yearsToGrow = coastFireAge - currentAge;

    // Calculate future value of initial investment
    const FV_initialInvestment = initialInvestment * Math.pow((1 + nominalMarketReturn), yearsToGrow);

    // Calculate future value of payments needed
    const FV_payments = coastFireNumber - FV_initialInvestment;

    // Calculate monthly payments if FV_payments is greater than 0
    let monthlyPayments = 0;
    if (FV_payments > 0) {
        monthlyPayments = (FV_payments * nominalMarketReturn) / ((Math.pow((1 + nominalMarketReturn), yearsToGrow) - 1) / 12);
    }
    // Display savings message
    const savingsMessage = document.getElementById("savingsMessage");
    if (monthlyPayments > 0) {
        savingsMessage.innerHTML = `You need to invest <mark>$${monthlyPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</mark> monthly to reach Coast Fire.`;
        savingsMessage.style.display = 'block'; // Show message
    } else {
        savingsMessage.style.display = 'none'; // Hide message if no contributions are needed
    }

    document.getElementById("savingsResult").style.display = 'block'; // Show savings result section
}


function updateRate(){
    var rateval = document.getElementById("withdrawalrate").value;
    document.getElementById("rate_val").innerText = rateval;
}

function calculateFireAndCoastFireNumbers() {
    const presentExpenses = parseFloat(document.getElementById("currentexpenses").value);
    const rate = parseFloat(document.getElementById("inflation").value);
    const futureAge = parseInt(document.getElementById("retirementage").value);
    const presentAge = parseInt(document.getElementById("currentage").value);
    
    const time = futureAge - presentAge;

    // Validate inputs without showing alert
    if (isNaN(presentExpenses) || isNaN(rate) || isNaN(futureAge) || isNaN(presentAge) || time <= 0) {
        // Clear or hide relevant output elements instead of showing alert
        document.getElementById("fireNumber").innerHTML = "";
        document.getElementById("coastFireNumber").innerHTML = "";
        document.getElementById("monthlyContributions").innerHTML = "";
        return;
    }

    // Rest of the calculation code remains the same...
    const futureExpenses = presentExpenses * Math.pow((1 + (rate / 100)), time);

    const withdrawalRate = parseFloat(document.getElementById("withdrawalrate").value);
    let multiplier;

    switch (withdrawalRate) {
        case 2:
            multiplier = 50;
            break;
        case 2.5:
            multiplier = 40;
            break;
        case 3:
            multiplier = 33;
            break;
        case 3.5:
            multiplier = 28.57;
            break;
        case 4:
            multiplier = 25;
            break;
        case 4.5:
            multiplier = 22;
            break;
        case 5:
            multiplier = 20;
            break;
        default:
            // Instead of console.error, just return
            return;
    }

    const fireNumber = futureExpenses * multiplier;
    
    const currentAge = parseFloat(document.getElementById("currentage").value);
    const coastFireAge = parseFloat(document.getElementById("coastfireage").value);
    const nominalMarketReturn = parseFloat(document.getElementById("nomreturn").value) / 100;

    // Additional validation for coast fire calculation
    if (isNaN(coastFireAge) || isNaN(nominalMarketReturn)) {
        return;
    }

    const coastFireNumber = fireNumber / Math.pow((1 + nominalMarketReturn), (coastFireAge - currentAge));

    // Update the results
    document.getElementById("fireNumber").innerHTML = "Fire Number: $<mark>" + fireNumber.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</mark>";
    document.getElementById("coastFireNumber").innerHTML = "Coast Fire Number: $<mark>" + coastFireNumber.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</mark>";

    // Calculate Monthly Contributions
    const initialInvestment = parseFloat(document.getElementById("initialInvestment").value) || 0;
    const yearsToGrow = coastFireAge - currentAge;

    const FV_initialInvestment = initialInvestment * Math.pow((1 + nominalMarketReturn), yearsToGrow);
    const FV_payments = coastFireNumber - FV_initialInvestment;
    
    let monthlyPayments = 0;
    if (FV_payments > 0 && yearsToGrow > 0) {
        monthlyPayments = ((FV_payments * nominalMarketReturn) / (((1 + nominalMarketReturn) ** yearsToGrow )-1)) / 12;
    }

    document.getElementById("monthlyContributions").innerHTML = `You need to invest <mark>$${monthlyPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</mark> monthly in order to reach Coast Fire.`;

    document.getElementById("output").style.display = 'block';
}