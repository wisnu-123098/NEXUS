// Fungsi Membuka / Menutup Modal Form
function toggleModal(isOpen) {
    const modal = document.getElementById('uploadModal');
    modal.style.display = isOpen ? 'flex' : 'none';
}

// Fungsi Simulasi Unduh Catatan
function downloadNote(title) {
    alert("Berhasil! Mengunduh ringkasan materi: " + title);
}

// Fungsi Fitur Pencarian Real-Time
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

// Fungsi Tambah Catatan Baru secara Interaktif
function addNewNote() {
    const subject = document.getElementById('inputSubject').value;
    const title = document.getElementById('inputTitle').value;
    const desc = document.getElementById('inputDesc').value;
    const author = document.getElementById('inputAuthor').value;

    if (!subject || !title || !desc || !author) {
        alert("Mohon lengkapi semua data sebelum mengunggah!");
        return;
    }

    const notesGrid = document.getElementById('notesGrid');
    const searchKeyword = (subject + " " + title).toLowerCase();

    // Buat elemen kartu baru
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

    // Masukkan ke urutan paling atas grid
    notesGrid.prepend(newCard);

    // Reset form dan tutup modal
    document.getElementById('inputSubject').value = '';
    document.getElementById('inputTitle').value = '';
    document.getElementById('inputDesc').value = '';
    document.getElementById('inputAuthor').value = '';
    toggleModal(false);

    alert("Catatan berhasil dibagikan ke platform!");
}
