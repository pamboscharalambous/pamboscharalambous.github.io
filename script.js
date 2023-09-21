document.addEventListener('DOMContentLoaded', function () {
    const mainOptions = document.getElementById('main-options');
    const subOptions = document.getElementById('sub-options');
    const popup = document.getElementById('popup');

    // Load and parse the CSV data
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            // Extract and populate main options
            const options = [...new Set(jsonData.map(row => row['Option']))];
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                mainOptions.appendChild(optionElement);
            });

            // Event listener for main option selection
            mainOptions.addEventListener('change', function () {
                const selectedOption = mainOptions.value;

                // Populate sub-options dropdown based on the selected main option
                subOptions.innerHTML = '<option value="">Select a sub-option</option>';
                const subOptionData = jsonData.filter(row => row['Option'] === selectedOption);
                subOptionData.forEach(row => {
                    const subOptionElement = document.createElement('option');
                    subOptionElement.value = row['Sub-Option'];
                    subOptionElement.textContent = row['Sub-Option'];
                    subOptions.appendChild(subOptionElement);
                });
            });

            // Event listener for sub-option selection
            subOptions.addEventListener('change', function () {
                const selectedSubOption = subOptions.options[subOptions.selectedIndex].text;
                const subOptionData = jsonData.find(row => row['Sub-Option'] === selectedSubOption);

                // Display the explanation pop-up
                if (subOptionData && subOptionData['Explanation']) {
                    popup.style.display = 'block';
                    popup.innerHTML = `<p>${subOptionData['Explanation']}</p>`;
                } else {
                    popup.style.display = 'none';
                }
            });
        });
});
