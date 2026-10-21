// Array global untuk menyimpan data catatan & video
let notes = [];
let currentGrade = 'all';

// Jalankan otomatis saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadNotesFromStorage();
});

// Buka/Tutup Modal Form Upload
function toggleModal(isOpen) {
    const modal = document.getElementById('uploadModal');
    modal.style.display = isOpen ? 'flex' : 'none';
}

// Memuat data dari localStorage atau inisialisasi contoh data awal
function loadNotesFromStorage() {
    const savedNotes = localStorage.getItem('smaneka_notes');

    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    } else {
        // Data default jika penyimpanan browser masih kosong
        notes = [
            {
                id: '1',
                grade: '10',
                subject: 'Biologi',
                title: 'Keanekaragaman Hayati & Ekosistem',
                desc: 'Ringkasan materi tingkatan keanekaragaman hayati, flora, fauna, dan komponen ekosistem.',
                author: 'Rina (X E-1)',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                fileDataUrl: null,
                fileName: null,
                fileType: null
            },
            {
                id: '2',
                grade: '11',
                subject: 'Matematika',
                title: 'Barisan & Deret Aritmatika',
                desc: 'Rumus cepat suku ke-n, jumlah n suku pertama, beserta pembahasan latihan soal.',
                author: 'Budi (XI IPA)',
                videoUrl: '',
                fileDataUrl: null,
                fileName: null,
                fileType: null
            },
            {
                id: '3',
                grade: '12',
                subject: 'Kimia',
                title: 'Sel Volta & Reaksi Redoks',
                desc: 'Cara mudah menghitung potensial sel standar (E°cell) dan diagram sel elektrokimia.',
                author: 'Dimas (XII MIPA)',
                videoUrl: '',
                fileDataUrl: null,
                fileName: null,
                fileType: null
            }
        ];
        saveNotesToStorage();
    }

    renderNotes();
}

// Menyimpan data array catatan ke localStorage
function saveNotesToStorage() {
    localStorage.setItem('smaneka_notes', JSON.stringify(notes));
}

// Mengonversi URL YouTube menjadi format iframe embed
function getEmbedVideoHtml(url) {
    if (!url) return '';
    
    // Cek jika link merupakan link YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        const videoId = match[2];
        return `<div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
                </div>`;
    }

    // Jika berupa link MP4 / video direct link
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
        return `<div class="video-container">
                    <video controls src="${url}"></video>
                </div>`;
    }

    // Fallback jika berupa link eksternal biasa
    return `<p><a href="${url}" target="_blank" style="color: var(--primary); text-decoration: underline;">📺 Tonton Video Pembelajaran</a></p>`;
}

// Menampilkan seluruh kartu ke dalam grid HTML
function renderNotes() {
    const notesGrid = document.getElementById('notesGrid');
    notesGrid.innerHTML = '';

    notes.forEach(note => {
        const searchKeyword = `${note.subject} ${note.title}`.toLowerCase();
        const card = document.createElement('div');
        card.className = 'note-card';
        card.setAttribute('data-grade', note.grade);
        card.setAttribute('data-title', searchKeyword);

        // Menyiapkan tampilan video jika ada
        let videoHtml = '';
        if (note.videoUrl) {
            videoHtml = getEmbedVideoHtml(note.videoUrl);
        } else if (note.fileType && note.fileType.startsWith('video/')) {
            videoHtml = `<div class="video-container">
                            <video controls src="${note.fileDataUrl}"></video>
                         </div>`;
        }

        card.innerHTML = `
            <div>
                <div class="badge-wrapper">
                    <span class="badge">${note.subject} Kelas ${note.grade}</span>
                    <button class="btn-delete" onclick="deleteNote('${note.id}')" title="Hapus Catatan">🗑️</button>
                </div>
                <h3>${note.title}</h3>
                <p>${note.desc}</p>
                ${videoHtml}
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

// Fitur HAPUS Catatan
function deleteNote(id) {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus catatan/video ini?");
    if (confirmDelete) {
        notes = notes.filter(note => note.id !== id);
        saveNotesToStorage();
        renderNotes();
        alert("Catatan berhasil dihapus!");
    }
}

// Logika Mengunduh File / Membuat dokumen Rangkuman
function downloadNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    if (note.fileDataUrl) {
        const a = document.createElement('a');
        a.href = note.fileDataUrl;
        a.download = note.fileName || `${note.title}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        const content = `=====================================\n` +
                        `  CATATAN: ${note.title.toUpperCase()}\n` +
                        `=====================================\n\n` +
                        `Mata Pelajaran : ${note.subject}\n` +
                        `Kelas          : Kelas ${note.grade}\n` +
                        `Penulis        : ${note.author}\n` +
                        (note.videoUrl ? `Link Video     : ${note.videoUrl}\n` : '') +
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

// Pencarian Kata Kunci Real-Time
function searchNotes() {
    applyFilters();
}

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

// Menambahkan Catatan / Video Baru
function addNewNote() {
    const grade = document.getElementById('inputGrade').value;
    const subject = document.getElementById('inputSubject').value;
    const title = document.getElementById('inputTitle').value;
    const desc = document.getElementById('inputDesc').value;
    const author = document.getElementById('inputAuthor').value;
    const videoUrl = document.getElementById('inputVideoUrl').value;
    const fileInput = document.getElementById('inputFile');

    if (!subject || !title || !desc || !author) {
        alert("Mohon lengkapi data teks wajib (Mata Pelajaran, Judul, Deskripsi, dan Nama)!");
        return;
    }

    const processAndSave = (fileDataUrl = null, fileName = null, fileType = null) => {
        const newNote = {
            id: Date.now().toString(),
            grade,
            subject,
            title,
            desc,
            author,
            videoUrl,
            fileDataUrl,
            fileName,
            fileType
        };

        notes.unshift(newNote);
        saveNotesToStorage();
        renderNotes();

        // Reset Isian Form Input
        document.getElementById('inputSubject').value = '';
        document.getElementById('inputTitle').value = '';
        document.getElementById('inputDesc').value = '';
        document.getElementById('inputAuthor').value = '';
        document.getElementById('inputVideoUrl').value = '';
        if (fileInput) fileInput.value = '';

        toggleModal(false);
        alert("Catatan / Video berhasil disimpan dan dibagikan!");
    };

    if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];

        // Pembatasan ukuran memori browser (maksimal 8 MB untuk demo LocalStorage)
        if (file.size > 8 * 1024 * 1024) {
            alert("Ukuran berkas terlalu besar! Maksimal berkas yang bisa disimpan langsung di browser adalah 8 MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            processAndSave(e.target.result, file.name, file.type);
        };
        reader.readAsDataURL(file);
    } else {
        processAndSave();
    }
}
