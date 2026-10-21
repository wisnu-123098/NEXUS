// Komentar: Variabel untuk melacak status filter kelas yang sedang aktif
let currentGrade = 'all';

// Komentar: Fungsi untuk Membuka atau Menutup Kotak Formulir Unggah
function toggleModal(isOpen) {
    const modal = document.getElementById('uploadModal');
    modal.style.display = isOpen ? 'flex' : 'none';
}

// Komentar: Fungsi Simulasi saat Tombol Unduh Diklik
function downloadNote(title) {
    alert("Berhasil! Mengunduh ringkasan materi: " + title);
}

// Komentar: Fungsi untuk Memfilter Catatan Berdasarkan Kelas (10, 11, 12, atau Semua)
function filterGrade(grade) {
    currentGrade = grade;
    
    // Mengubah tampilan tombol aktif pada navigasi filter
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    applyFilters();
}

// Komentar: Fungsi Fitur Pencarian Real-Time yang digabungkan dengan Filter Kelas
function searchNotes() {
    applyFilters();
}

// Komentar: Logika Utama untuk Menyaring Tampilan Kartu Berdasarkan Kelas dan Pencarian
function applyFilters() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.note-card');

    cards.forEach(card => {
        const cardGrade = card.getAttribute('data-grade');
        const titleData = card.getAttribute('data-title');
        
        // Cek kecocokan kelas
        const matchGrade = (currentGrade === 'all' || cardGrade === currentGrade);
        // Cek kecocokan kata kunci pencarian
        const matchSearch = titleData.includes(query);

        if (matchGrade && matchSearch) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

// Komentar: Fungsi untuk Menambahkan Catatan Baru Sesuai Pilihan Kelas
function addNewNote() {
    const grade = document.getElementById('inputGrade').value;
    const subject = document.getElementById('inputSubject').value;
    const title = document.getElementById('inputTitle').value;
    const desc = document.getElementById('inputDesc').value;
    const author = document.getElementById('inputAuthor').value;

    // Komentar: Validasi formulir kosong
    if (!subject || !title || !desc || !author) {
        alert("Mohon lengkapi semua data sebelum mengunggah!");
        return;
    }

    const notesGrid = document.getElementById('notesGrid');
    const searchKeyword = (subject + " " + title).toLowerCase();

    // Komentar: Membuat elemen kartu baru dengan data kelas yang dipilih
    const newCard = document.createElement('div');
    newCard.className = 'note-card';
    newCard.setAttribute('data-grade', grade);
    newCard.setAttribute('data-title', searchKeyword);
    newCard.innerHTML = `
        <div>
            <span class="badge">${subject} Kelas ${grade}</span>
            <h3>${title}</h3>
            <p>${desc}</p>
        </div>
        <div class="note-footer">
            <span>Oleh: ${author}</span>
            <button class="btn-download" onclick="downloadNote('${title}')">Unduh</button>
        </div>
    `;

    // Komentar: Meletakkan catatan baru ke urutan paling atas
    notesGrid.prepend(newCard);

    // Komentar: Reset formulir dan tutup modal
    document.getElementById('inputSubject').value = '';
    document.getElementById('inputTitle').value = '';
    document.getElementById('inputDesc').value = '';
    document.getElementById('inputAuthor').value = '';
    toggleModal(false);

    alert("Catatan berhasil dibagikan ke platform!");
}
