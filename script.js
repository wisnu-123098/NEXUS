// Array global untuk menyimpan data catatan
let notes = [];
let currentGrade = 'all';

// Jalankan otomatis saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadNotesFromStorage();
});

// Buka/tutup modal form
function toggleModal(isOpen) {
    const modal = document.getElementById('uploadModal');
    modal.style.display = isOpen ? 'flex' : 'none';
}

// Memuat data dari localStorage atau inisialisasi data default
function loadNotesFromStorage() {
    const savedNotes = localStorage.getItem('smaneka_notes');

    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    } else {
        // Data bawaan saat pertama kali dibuka
        notes = [
            {
                id: '1',
                grade: '10',
                subject: 'Biologi',
                title: 'Keanekaragaman Hayati & Ekosistem',
                desc: 'Ringkasan materi tingkatan keanekaragaman hayati, flora, fauna, dan komponen ekosistem.',
                author: 'Rina (X E-1)',
                fileDataUrl: null,
                fileName: null
            },
            {
                id: '2',
                grade: '11',
                subject: 'Matematika',
                title: 'Barisan & Deret Aritmatika',
                desc: 'Rumus cepat suku ke-n, jumlah n suku pertama, beserta 5 contoh soal pembahasan.',
                author: 'Budi (XI IPA)',
                fileDataUrl: null,
                fileName: null
            },
            {
                id: '3',
                grade: '12',
                subject: 'Kimia',
                title: 'Sel Volta & Reaksi Redoks',
                desc: 'Cara mudah menghitung potensial sel standar (E°cell) dan diagram sel elektrokimia.',
                author: 'Dimas (XII MIPA)',
                fileDataUrl: null,
                fileName: null
            }
        ];
        saveNotesToStorage();
    }

    renderNotes();
}

// Menyimpan array catatan ke localStorage browser
function saveNotesToStorage() {
    localStorage.setItem('smaneka_notes', JSON.stringify(notes));
}

// Rendering elemen kartu ke halaman web
function renderNotes() {
    const notesGrid = document.getElementById('notesGrid');
    notesGrid.innerHTML = '';

    notes.forEach(note => {
        const searchKeyword = `${note.subject} ${note.title}`.toLowerCase();
        const card = document.createElement('div');
        card.className = 'note-card';
        card.setAttribute('data-grade', note.grade);
        card.setAttribute('data-title', searchKeyword);

        card.innerHTML = `
            <div>
                <span class="badge">${note.subject} Kelas ${note.grade}</span>
                <h3>${note.title}</h3>
                <p>${note.desc}</p>
            </div>
            <div class="note-footer">
                <span>Oleh: ${note.author}</span>
                <button class="btn-download" onclick="downloadNote('${note.id}')">Unduh</button>
            </div>
        `;
        notesGrid.appendChild(card);
    });

    applyFilters();
}

// Logika untuk Mengunduh File Catatan
function downloadNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    if (note.fileDataUrl) {
        // Jika ada file terlampir yang diunggah
        const a = document.createElement('a');
        a.href = note.fileDataUrl;
        a.download = note.fileName || `${note.title}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        // Jika tidak ada berkas terlampir, generate file teks (.txt) otomatis
        const content = `=====================================\n` +
                        `  CATATAN: ${note.title.toUpperCase()}\n` +
                        `=====================================\n\n` +
                        `Mata Pelajaran : ${note.subject}\n` +
                        `Kelas          : Kelas ${note.grade}\n` +
                        `Penulis        : ${note.author}\n\n` +
                        `-------------------------------------\n` +
                        `RINGKASAN MATERI:\n` +
                        `-------------------------------------\n` +
                        `${note.desc}\n\n` +
                        `-------------------------------------\n` +
                        `Diunduh dari NotesShare SMANEKA`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_SMANEKA.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Filter berdasarkan Tingkat Kelas
function filterGrade(grade) {
    currentGrade = grade;
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (window.event) window.event.target.classList.add('active');

    applyFilters();
}

// Pencarian Real-time
function searchNotes() {
    applyFilters();
}

// Menerapkan Filter & Pencarian Gabungan
function applyFilters() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.note-card');

    cards.forEach(card => {
        const cardGrade = card.getAttribute('data-grade');
        const titleData = card.getAttribute('data-title');

        const matchGrade = (currentGrade === 'all' || cardGrade === currentGrade);
        const matchSearch = titleData.includes(query);

        card.style.display = (matchGrade && matchSearch) ? "flex" : "none";
    });
}

// Menambahkan Catatan Baru & Menyimpannya
function addNewNote() {
    const grade = document.getElementById('inputGrade').value;
    const subject = document.getElementById('inputSubject').value;
    const title = document.getElementById('inputTitle').value;
    const desc = document.getElementById('inputDesc').value;
    const author = document.getElementById('inputAuthor').value;
    const fileInput = document.getElementById('inputFile');

    if (!subject || !title || !desc || !author) {
        alert("Mohon lengkapi semua data teks sebelum mengunggah!");
        return;
    }

    const processAndSave = (fileDataUrl = null, fileName = null) => {
        const newNote = {
            id: Date.now().toString(),
            grade,
            subject,
            title,
            desc,
            author,
            fileDataUrl,
            fileName
        };

        // Masukkan catatan baru ke urutan paling atas
        notes.unshift(newNote);
        
        // Simpan ke storage dan perbarui tampilan web
        saveNotesToStorage();
        renderNotes();

        // Reset Isian Form
        document.getElementById('inputSubject').value = '';
        document.getElementById('inputTitle').value = '';
        document.getElementById('inputDesc').value = '';
        document.getElementById('inputAuthor').value = '';
        if (fileInput) fileInput.value = '';

        toggleModal(false);
        alert("Catatan berhasil disimpan dan dibagikan!");
    };

    // Pembacaan Berkas yang Diunggah Pengguna
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        
        // Membatasi ukuran simpan lokal jika berkas terlalu besar (> 4MB)
        if (file.size > 4 * 1024 * 1024) {
            alert("Ukuran berkas terlalu besar! Maksimal berkas yang didukung di penyimpanan browser adalah 4 MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            processAndSave(e.target.result, file.name);
        };
        reader.readAsDataURL(file);
    } else {
        processAndSave();
    }
}
