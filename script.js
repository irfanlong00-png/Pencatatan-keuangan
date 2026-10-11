const transactionForm = document.getElementById('transaction-form');
const transNameInput = document.getElementById('trans-name');
const transAmountInput = document.getElementById('trans-amount');
const transTypeInput = document.getElementById('trans-type');
const transactionList = document.getElementById('transaction-list');
const totalIncomeElement = document.getElementById('total-income');
const totalExpenseElement = document.getElementById('total-expense');
const totalBalanceElement = document.getElementById('total-balance');

// Ambil data transaksi dari LocalStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Fungsi format mata uang Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(number);
}

// Fungsi memperbarui UI dan menampilkan riwayat
function updateUI() {
    transactionList.innerHTML = '';
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((trans, index) => {
        if (trans.type === 'income') {
            totalIncome += trans.amount;
        } else {
            totalExpense += trans.amount;
        }

        const li = document.createElement('li');
        li.classList.add(trans.type);

        const sign = trans.type === 'income' ? '+' : '-';
        
        li.innerHTML = `
            <div>
                <strong>${trans.name}</strong>
                <div class="trans-info">
                    <span>${trans.date}</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-weight: bold; color: ${trans.type === 'income' ? '#28a745' : '#dc3545'};">
                    ${sign} ${formatRupiah(trans.amount)}
                </span>
                <button class="delete-btn" onclick="deleteTransaction(${index})">x</button>
            </div>
        `;
        
        transactionList.appendChild(li);
    });

    const balance = totalIncome - totalExpense;

    totalIncomeElement.innerText = formatRupiah(totalIncome);
    totalExpenseElement.innerText = formatRupiah(totalExpense);
    totalBalanceElement.innerText = formatRupiah(balance);

    // Simpan ke LocalStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Tambah transaksi baru
transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = transNameInput.value.trim();
    const amount = parseFloat(transAmountInput.value);
    const type = transTypeInput.value;

    if (name !== '' && !isNaN(amount) && amount > 0) {
        // Buat format tanggal dan waktu Indonesia
        const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        const currentDate = new Date().toLocaleDateString('id-ID', options);

        transactions.unshift({ // Menambahkan transaksi baru ke urutan paling atas
            name,
            amount,
            type,
            date: currentDate
        });

        updateUI();

        // Reset form
        transNameInput.value = '';
        transAmountInput.value = '';
        transTypeInput.value = 'expense';
    }
});

// Hapus transaksi berdasarkan index
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

// Jalankan saat pertama kali dimuat
updateUI();