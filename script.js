const API_url = "https://66ec09692b6cf2b89c5cf3c8.mockapi.io/incomeExpenses";

async function fetchAndDisplay(filterText = { type: "" }) {
  try {
    const res = await fetch(API_url);
    const data = await res.json();
    const tableBody = document
      .getElementById("table")
      .getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Clear existing table data

    let totalIncome = 0;
    let totalExpenses = 0;

    data
      .filter((item) => {
        if (filterText.type === "" || filterText.type === "all") {
          return true;
        }
        return filterText.type === item.type;
      })
      .forEach((item) => {
        const row = document.createElement("tr");
        row.className = "text-center"; // Align text to center in each row
        tableBody.appendChild(row);

        const tabdescription = document.createElement("td");
        tabdescription.textContent = item.description;
        tabdescription.className = "p-4 border"; // Add padding and border for neatness
        row.appendChild(tabdescription);

        const tabamt = document.createElement("td");
        tabamt.textContent = item.amount;
        tabamt.className = "p-4 border";
        row.appendChild(tabamt);

        const tabtype = document.createElement("td");
        tabtype.textContent = item.type;
        tabtype.className = "p-4 border";
        row.appendChild(tabtype);

        const tabaction = document.createElement("td");
        tabaction.className = "p-4 border";
        row.appendChild(tabaction);

        const editButton = document.createElement("button");
        editButton.className =
          "border-2 bg-green-600 text-white hover:outline rounded-md py-2 px-4 hover:bg-green-700 hover:text-xl";
        editButton.innerText = "Edit";
        editButton.onclick = () =>
          editItem(item.id, tabdescription, tabamt, item.type);
        tabaction.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.className =
          "border-2 bg-red-600 text-white hover:outline rounded-md py-2 px-4 hover:bg-red-700 hover:text-xl";
        deleteButton.innerText = "Delete";
        deleteButton.onclick = () => deleteItem(item.id);
        tabaction.appendChild(deleteButton);

        // Calculate totals
        if (item.type === "income") {
          totalIncome += parseFloat(item.amount);
        } else {
          totalExpenses += parseFloat(item.amount);
        }
      });

    // Update totals
    document.getElementById("incomeNum").innerText = `$${totalIncome}`;
    document.getElementById("expenseNum").innerText = `$${totalExpenses}`;
    document.getElementById("balNum").innerText = `$${
      totalIncome - totalExpenses
    }`;
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

async function deleteItem(id) {
  try {
    await fetch(`${API_url}/${id}`, { method: "DELETE" });
    fetchAndDisplay();
  } catch (error) {
    console.error("Error deleting item", error);
  }
}

function editItem(id, tabdescription, tabamt, originalType) {
  const newDescription = prompt(
    "Edit Description:",
    tabdescription.textContent
  );
  const newAmount = prompt("Edit Amount:", tabamt.textContent);
  const newType = prompt("Edit Type (income/expense):", originalType); // Get new type

  if (newDescription !== null && newAmount !== null && newType !== null) {
    const updatedItem = {
      description: newDescription,
      amount: newAmount,
      type: newType, // Use the new type from user input
    };

    fetch(`${API_url}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    })
      .then(() => fetchAndDisplay())
      .catch((error) => console.error("Error updating item", error));
  }
}

window.onload = () => {
  const nav = document.createElement("div");
  nav.className = "flex flex-row justify-center gap-2 py-4 shadow-lg font-mono";
  document.body.appendChild(nav);

  // Income Expense Calculator
  const heading = document.createElement("h1");
  heading.innerText = "Income Expense Calculator";
  heading.className = "text-4xl text-teal-700 font-bold";
  nav.appendChild(heading);

  const headingImg = document.createElement("img");
  headingImg.src = "calc.png";
  headingImg.alt = "calc";
  headingImg.className = "w-10";
  nav.appendChild(headingImg);

  const check = document.createElement("div");
  check.className = "flex flex-col gap-3 mx-24 mt-5 font-mono";
  document.body.appendChild(check);

  // Income
  const incomeDisplay = document.createElement("div");
  incomeDisplay.className =
    "bg-teal-700 text-white font-semibold text-2xl flex justify-around p-3 font-mono";
  check.appendChild(incomeDisplay);

  const incomeName = document.createElement("h3");
  incomeName.innerText = "Income";
  incomeDisplay.appendChild(incomeName);

  const incomeNum = document.createElement("h3");
  incomeNum.id = "incomeNum"; // Set ID for updating later
  incomeNum.innerText = "$0"; // Initialize with $0
  incomeDisplay.appendChild(incomeNum);

  // Expenses
  const expenseDisplay = document.createElement("div");
  expenseDisplay.className =
    "bg-teal-700 text-white font-semibold text-2xl flex justify-around p-3 font-mono";
  check.appendChild(expenseDisplay);

  const expenseName = document.createElement("h3");
  expenseName.innerText = "Expenses";
  expenseDisplay.appendChild(expenseName);

  const expenseNum = document.createElement("h3");
  expenseNum.id = "expenseNum"; // Set ID for updating later
  expenseNum.innerText = "$0"; // Initialize with $0
  expenseDisplay.appendChild(expenseNum);

  // Net Balance
  const balDisplay = document.createElement("div");
  balDisplay.className =
    "bg-teal-700 text-white font-semibold text-2xl flex justify-around p-3 font-mono";
  check.appendChild(balDisplay);

  const balName = document.createElement("h3");
  balName.innerText = "Net Balance";
  balDisplay.appendChild(balName);

  const balNum = document.createElement("h3");
  balNum.id = "balNum"; // Set ID for updating later
  balNum.innerText = "$0"; // Initialize with $0
  balDisplay.appendChild(balNum);

  // Add New Entry
  const newEntry = document.createElement("div");
  newEntry.className = "mx-24 mt-8 font-mono shadow-xl";
  document.body.appendChild(newEntry);

  const addNewEntry = document.createElement("h6");
  addNewEntry.innerText = "Add New Entry";
  addNewEntry.className = "text-2xl font-bold";
  newEntry.appendChild(addNewEntry);

  // Description and Amount Entry Section
  const desAmtDiv = document.createElement("div");
  desAmtDiv.className = "flex flex-row justify-around";
  newEntry.appendChild(desAmtDiv);

  // Description
  const desDiv = document.createElement("div");
  desDiv.className = "flex flex-col mt-3";
  desAmtDiv.appendChild(desDiv);

  const des = document.createElement("p");
  des.innerText = "Description";
  desDiv.appendChild(des);

  const desInput = document.createElement("input");
  desInput.type = "text";
  desInput.placeholder = "ex: Salary";
  desInput.className = "border-2 border-zinc-200 rounded-lg";
  desDiv.appendChild(desInput);

  // Amount
  const amtDiv = document.createElement("div");
  amtDiv.className = "flex flex-col mt-3";
  desAmtDiv.appendChild(amtDiv);

  const amt = document.createElement("p");
  amt.innerText = "Amount";
  amtDiv.appendChild(amt);

  const amtInput = document.createElement("input");
  amtInput.type = "number";
  amtInput.placeholder = "ex: 1000";
  amtInput.className = "border-2 border-zinc-200 rounded-lg";
  amtDiv.appendChild(amtInput);

  // Type add Entry Section
  const typeEntryDiv = document.createElement("div");
  typeEntryDiv.className = "flex flex-row justify-around mt-4";
  newEntry.appendChild(typeEntryDiv);

  // Type
  const typeDiv = document.createElement("div");
  typeDiv.className = "flex flex-col";
  typeEntryDiv.appendChild(typeDiv);

  const typeLabel = document.createElement("p");
  typeLabel.innerText = "Type";
  typeDiv.appendChild(typeLabel);

  // Income
  const incexpDiv = document.createElement("div");
  incexpDiv.className = "flex flex-row gap-3";
  typeDiv.appendChild(incexpDiv);

  const incomeInput = document.createElement("input");
  incomeInput.type = "radio";
  incomeInput.name = "type";
  incomeInput.value = "income";
  incomeInput.checked = true;
  incomeInput.className = "border-2 border-zinc-200 rounded-lg ml-2";
  incexpDiv.appendChild(incomeInput);

  const incomeLabel = document.createElement("label");
  incomeLabel.innerText = "Income";
  incomeLabel.className = "text-sm font-medium text-capitalize"; // Add 'text-capitalize' class
  incexpDiv.appendChild(incomeLabel);

  // Expense
  const expenseInput = document.createElement("input");
  expenseInput.type = "radio";
  expenseInput.name = "type";
  expenseInput.value = "expense";
  expenseInput.className = "border-2 border-zinc-200 rounded-lg ml-2";
  incexpDiv.appendChild(expenseInput);

  const expenseLabel = document.createElement("label");
  expenseLabel.innerText = "Expense";
  expenseLabel.className = "text-sm font-medium text-capitalize";
  incexpDiv.appendChild(expenseLabel);

  // ADD entry Button
  const addEntryButton = document.createElement("button");
  addEntryButton.innerText = "Add Entry";
  addEntryButton.className =
    "border-2 bg-teal-600 hover:bg-teal-700 text-white hover:cursor-pointer hover:outline rounded-md px-2";
  typeEntryDiv.appendChild(addEntryButton);

  addEntryButton.addEventListener("click", async function additem() {
    if (desInput.value === "" || amtInput.value === "") {
      alert("Please fill all the fields!!!");
      return;
    }
    const newAddEvent = {
      description: desInput.value,
      amount: amtInput.value,
      type: incomeInput.checked ? "income" : "expense",
    };
    try {
      await fetch(API_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddEvent),
      });
      fetchAndDisplay();
      desInput.value = "";
      amtInput.value = "";
    } catch (error) {
      console.error("Error adding item", error);
    }
  });

  // Filter Section
  const filterDiv = document.createElement("div");
  filterDiv.className = "flex flex-row mx-24 font-mono mt-8";
  document.body.appendChild(filterDiv);

  // Filter - All
  const allInput = document.createElement("input");
  allInput.type = "radio";
  allInput.name = "filter";
  allInput.value = "all";
  allInput.checked = true; // Default to All
  allInput.className = "border border-zinc-200 rounded-lg ml-5";
  filterDiv.appendChild(allInput);

  const allLabel = document.createElement("label");
  allLabel.innerText = "All";
  filterDiv.appendChild(allLabel);

  // Filter - Income
  const incFilterInput = document.createElement("input");
  incFilterInput.type = "radio";
  incFilterInput.name = "filter";
  incFilterInput.value = "income";
  incFilterInput.className = "border border-zinc-200 rounded-lg ml-5";
  filterDiv.appendChild(incFilterInput);

  const incFilterLabel = document.createElement("label");
  incFilterLabel.innerText = "Income";
  filterDiv.appendChild(incFilterLabel);

  // Filter - Expense
  const expFilterInput = document.createElement("input");
  expFilterInput.type = "radio";
  expFilterInput.name = "filter";
  expFilterInput.value = "expense";
  expFilterInput.className = "border border-zinc-200 rounded-lg ml-5";
  filterDiv.appendChild(expFilterInput);

  const expFilterLabel = document.createElement("label");
  expFilterLabel.innerText = "Expenses";
  filterDiv.appendChild(expFilterLabel);

  // Event listener for filter change
  filterDiv.addEventListener("change", (event) => {
    fetchAndDisplay({ type: event.target.value });
  });

  // Entries Section
  const entries = document.createElement("p");
  entries.innerText = "Entries";
  entries.className = "text-center font-bold text-2xl font-mono mt-6"; // Center the heading
  document.body.appendChild(entries);

  const tableWrapper = document.createElement("div"); // Create a div to wrap the table
  tableWrapper.className = "flex justify-center"; // Center the table wrapper
  document.body.appendChild(tableWrapper);

  const table = document.createElement("table");
  table.className = "bg-zinc-100 w-full max-w-5xl"; // Set table width and maximum width
  table.id = "table";
  tableWrapper.appendChild(table);

  //thead
  const thead = table.appendChild(document.createElement("thead"));
  thead.className = "font-semibold text-xl";

  const theadRow = thead.appendChild(document.createElement("tr"));
  theadRow.className = "text-center"; // Align text to center in header

  const thr1 = theadRow.appendChild(document.createElement("th"));
  thr1.innerText = "Description";
  thr1.className = "p-4 border"; // Add padding and border

  const thr2 = theadRow.appendChild(document.createElement("th"));
  thr2.innerText = "Amount";
  thr2.className = "p-4 border";

  const thr3 = theadRow.appendChild(document.createElement("th"));
  thr3.innerText = "Type";
  thr3.className = "p-4 border";

  const thr4 = theadRow.appendChild(document.createElement("th"));
  thr4.innerText = "Actions";
  thr4.className = "p-4 border";

  //tbody
  const tbody = table.appendChild(document.createElement("tbody"));
  tbody.className = "text-center"; // Center the text in the table body
  tbody.id = "tbodyid";

  // Initial fetch to display all entries
  fetchAndDisplay();
};
