// Komentar: Fungsi untuk Membuka atau Menutup Kotak Formulir Unggah
function toggleModal(isOpen) {
    const modal = document.getElementById('uploadModal');
    modal.style.display = isOpen ? 'flex' : 'none';
}

// Komentar: Fungsi Simulasi saat Tombol Unduh Diklik
function downloadNote(title) {
    alert("Berhasil! Mengunduh ringkasan materi: " + title);
}

// Komentar: Fungsi Fitur Pencarian Judul/Pelajaran secara Real-Time
function searchNotes() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.note-card');

    cards.forEach(card => {
        const titleData = card.getAttribute('data-title');
        if (titleData.includes(query)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

// Komentar: Fungsi untuk Menambahkan Catatan Baru ke Layar Website
function addNewNote() {
    const subject = document.getElementById('inputSubject').value;
    const title = document.getElementById('inputTitle').value;
    const desc = document.getElementById('inputDesc').value;
    const author = document.getElementById('inputAuthor').value;

    // Komentar: Validasi jika ada kolom formulir yang kosong
    if (!subject || !title || !desc || !author) {
        alert("Mohon lengkapi semua data sebelum mengunggah!");
        return;
    }

    const notesGrid = document.getElementById('notesGrid');
    const searchKeyword = (subject + " " + title).toLowerCase();

    // Komentar: Membuat elemen kartu baru secara otomatis melalui kode
    const newCard = document.createElement('div');
    newCard.className = 'note-card';
    newCard.setAttribute('data-title', searchKeyword);
    newCard.innerHTML = `
        <div>
            <span class="badge">${subject}</span>
            <h3>${title}</h3>
            <p>${desc}</p>
        </div>
        <div class="note-footer">
            <span>Oleh: ${author}</span>
            <button class="btn-download" onclick="downloadNote('${title}')">Unduh</button>
        </div>
    `;

    // Komentar: Meletakkan kartu catatan baru di urutan paling atas
    notesGrid.prepend(newCard);

    // Komentar: Mengosongkan kembali form dan menutup jendela modal
    document.getElementById('inputSubject').value = '';
    document.getElementById('inputTitle').value = '';
    document.getElementById('inputDesc').value = '';
    document.getElementById('inputAuthor').value = '';
    toggleModal(false);

    alert("Catatan berhasil dibagikan ke platform!");
}
