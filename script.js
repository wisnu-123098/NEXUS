let notes = [];
let bookmarks = [];
let readLater = [];
let currentGrade = 'all';
let currentView = 'all'; // 'all', 'bookmarks', atau 'readLater'

document.addEventListener('DOMContentLoaded', () => {
    loadNotesFromStorage();
    loadBookmarksFromStorage();
    loadReadLaterFromStorage();
});

function toggleModal(isOpen) {
    const modal = document.getElementById('uploadModal');
    modal.style.display = isOpen ? 'flex' : 'none';
}

function loadNotesFromStorage() {
    const savedNotes = localStorage.getItem('nexus_smaneka_notes');

    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    } else {
        notes = [
            {
                id: '1',
                grade: '10',
                subject: 'Biologi',
                title: 'Keanekaragaman Hayati & Ekosistem',
                desc: 'Ringkasan lengkap tingkatan keanekaragaman hayati, konsep rantai makanan, dan komponen ekosistem.',
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
                desc: 'Rumus cepat suku ke-n, pembahasan latihan soal, serta penerapan deret aritmatika.',
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
                desc: 'Cara ringkas menghitung potensial sel standar (E°cell) dan menyusun diagram sel elektrokimia.',
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

function loadBookmarksFromStorage() {
    const savedBookmarks = localStorage.getItem('nexus_smaneka_bookmarks');
    if (savedBookmarks) {
        bookmarks = JSON.parse(savedBookmarks);
    }
    updateBookmarkCount();
}

function loadReadLaterFromStorage() {
    const savedReadLater = localStorage.getItem('nexus_smaneka_readlater');
    if (savedReadLater) {
        readLater = JSON.parse(savedReadLater);
    }
    updateReadLaterCount();
}

function saveNotesToStorage() {
    localStorage.setItem('nexus_smaneka_notes', JSON.stringify(notes));
}

function saveBookmarksToStorage() {
    localStorage.setItem('nexus_smaneka_bookmarks', JSON.stringify(bookmarks));
    updateBookmarkCount();
}

function saveReadLaterToStorage() {
    localStorage.setItem('nexus_smaneka_readlater', JSON.stringify(readLater));
    updateReadLaterCount();
}

function updateBookmarkCount() {
    document.getElementById('bookmarkCount').innerText = bookmarks.length;
}

function updateReadLaterCount() {
    document.getElementById('readLaterCount').innerText = readLater.length;
}

function toggleBookmark(id) {
    if (bookmarks.includes(id)) {
        bookmarks = bookmarks.filter(bId => bId !== id);
    } else {
        bookmarks.push(id);
    }
    saveBookmarksToStorage();
    renderNotes();
}

function toggleReadLater(id) {
    if (readLater.includes(id)) {
        readLater = readLater.filter(rId => rId !== id);
    } else {
        readLater.push(id);
    }
    saveReadLaterToStorage();
    renderNotes();
}

function toggleBookmarksView() {
    const bookmarkBtn = document.getElementById('bookmarkToggleBtn');
    const readLaterBtn = document.getElementById('readLaterToggleBtn');
    const title = document.getElementById('catalogTitle');

    if (currentView === 'bookmarks') {
        currentView = 'all';
        bookmarkBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        bookmarkBtn.style.color = 'var(--text-main)';
        title.innerText = 'Katalog Catatan & Video';
    } else {
        currentView = 'bookmarks';
        bookmarkBtn.style.background = 'var(--primary)';
        bookmarkBtn.style.color = '#fff';
        readLaterBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        readLaterBtn.style.color = 'var(--text-main)';
        title.innerText = '⭐ Materi Favorit Tersimpan';
    }
    renderNotes();
}

function toggleReadLaterView() {
    const bookmarkBtn = document.getElementById('bookmarkToggleBtn');
    const readLaterBtn = document.getElementById('readLaterToggleBtn');
    const title = document.getElementById('catalogTitle');

    if (currentView === 'readLater') {
        currentView = 'all';
        readLaterBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        readLaterBtn.style.color = 'var(--text-main)';
        title.innerText = 'Katalog Catatan & Video';
    } else {
        currentView = 'readLater';
        readLaterBtn.style.background = 'var(--primary)';
        readLaterBtn.style.color = '#fff';
        bookmarkBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        bookmarkBtn.style.color = 'var(--text-main)';
        title.innerText = '⏳ Daftar Baca Nanti';
    }
    renderNotes();
}

function getEmbedVideoHtml(url) {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return `<div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${match[2]}" allowfullscreen></iframe>
                </div>`;
    }

    if (url.match(/\.(mp4|webm|ogg)$/i)) {
        return `<div class="video-container">
                    <video controls src="${url}"></video>
                </div>`;
    }

    return `<p style="margin-bottom:1rem;"><a href="${url}" target="_blank" style="color:var(--accent);">📺 Tonton Video Pembelajaran</a></p>`;
}

function renderNotes() {
    const notesGrid = document.getElementById('notesGrid');
    notesGrid.innerHTML = '';

    let videoCount = 0;
    let uniqueAuthors = new Set();

    notes.forEach(note => {
        uniqueAuthors.add(note.author);
        if (note.videoUrl || (note.fileType && note.fileType.startsWith('video/'))) {
            videoCount++;
        }
    });

    let displayNotes = notes;
    if (currentView === 'bookmarks') {
        displayNotes = notes.filter(note => bookmarks.includes(note.id));
    } else if (currentView === 'readLater') {
        displayNotes = notes.filter(note => readLater.includes(note.id));
    }

    displayNotes.forEach(note => {
        const searchKeyword = `${note.subject} ${note.title} ${note.author}`.toLowerCase();
        const card = document.createElement('div');
        card.className = 'note-card';
        card.setAttribute('data-grade', note.grade);
        card.setAttribute('data-title', searchKeyword);

        let videoHtml = '';
        if (note.videoUrl) {
            videoHtml = getEmbedVideoHtml(note.videoUrl);
        } else if (note.fileType && note.fileType.startsWith('video/')) {
            videoHtml = `<div class="video-container">
                            <video controls src="${note.fileDataUrl}"></video>
                         </div>`;
        }

        const isBookmarked = bookmarks.includes(note.id);
        const isReadLater = readLater.includes(note.id);

        card.innerHTML = `
            <div>
                <div class="card-top">
                    <span class="badge">${note.subject} • Kelas ${note.grade}</span>
                    <div class="card-actions-top">
                        <button class="btn-read-later ${isReadLater ? 'active-read-later' : ''}" onclick="toggleReadLater('${note.id}')" title="${isReadLater ? 'Hapus dari Baca Nanti' : 'Simpan ke Baca Nanti'}">
                            ${isReadLater ? '⏳' : '⌛'}
                        </button>
                        <button class="btn-bookmark ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark('${note.id}')" title="${isBookmarked ? 'Hapus Favorit' : 'Tambah Favorit'}">
                            ${isBookmarked ? '⭐' : '☆'}
                        </button>
                        <button class="btn-delete" onclick="deleteNote('${note.id}')" title="Hapus Materi">🗑️</button>
                    </div>
                </div>
                <h3>${note.title}</h3>
                <p>${note.desc}</p>
                ${videoHtml}
            </div>
            <div class="card-footer">
                <span>Oleh: <strong>${note.author}</strong></span>
                <button class="btn-download" onclick="downloadNote('${note.id}')">Unduh</button>
            </div>
        `;
        notesGrid.appendChild(card);
    });

    document.getElementById('statTotal').innerText = notes.length;
    document.getElementById('statVideos').innerText = videoCount;
    document.getElementById('statContributors').innerText = uniqueAuthors.size;

    applyFilters();
}

function deleteNote(id) {
    if (confirm("Apakah Anda yakin ingin menghapus materi ini?")) {
        notes = notes.filter(note => note.id !== id);
        bookmarks = bookmarks.filter(bId => bId !== id);
        readLater = readLater.filter(rId => rId !== id);
        saveNotesToStorage();
        saveBookmarksToStorage();
        saveReadLaterToStorage();
        renderNotes();
    }
}

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
                        `  NEXUS SMANEKA: ${note.title.toUpperCase()}\n` +
                        `=====================================\n\n` +
                        `Mata Pelajaran : ${note.subject}\n` +
                        `Kelas          : Kelas ${note.grade}\n` +
                        `Penulis        : ${note.author}\n` +
                        (note.videoUrl ? `Link Video     : ${note.videoUrl}\n` : '') +
                        `\n-------------------------------------\n` +
                        `RINGKASAN MATERI:\n` +
                        `-------------------------------------\n` +
                        `${note.desc}\n\n` +
                        `-------------------------------------\n` +
                        `Diunduh dari NEXUS SMANEKA Platform`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_NEXUS.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

function filterGrade(grade) {
    currentGrade = grade;
    const buttons = document.querySelectorAll('.filter-pill');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (window.event) window.event.target.classList.add('active');

    applyFilters();
}

function searchNotes() {
    applyFilters();
}

function applyFilters() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.note-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const cardGrade = card.getAttribute('data-grade');
        const titleData = card.getAttribute('data-title');

        const matchGrade = (currentGrade === 'all' || cardGrade === currentGrade);
        const matchSearch = titleData.includes(query);

        if (matchGrade && matchSearch) {
            card.style.display = "flex";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    document.getElementById('notesCount').innerText = `Menampilkan ${visibleCount} modul`;
}

function addNewNote() {
    const grade = document.getElementById('inputGrade').value;
    const subject = document.getElementById('inputSubject').value;
    const title = document.getElementById('inputTitle').value;
    const desc = document.getElementById('inputDesc').value;
    const author = document.getElementById('inputAuthor').value;
    const videoUrl = document.getElementById('inputVideoUrl').value;
    const fileInput = document.getElementById('inputFile');

    if (!subject || !title || !desc || !author) {
        alert("Mohon lengkapi data teks (Mata Pelajaran, Judul, Ringkasan, dan Nama)!");
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

        document.getElementById('inputSubject').value = '';
        document.getElementById('inputTitle').value = '';
        document.getElementById('inputDesc').value = '';
        document.getElementById('inputAuthor').value = '';
        document.getElementById('inputVideoUrl').value = '';
        if (fileInput) fileInput.value = '';

        toggleModal(false);
        alert("Materi berhasil dipublikasikan ke NEXUS SMANEKA!");
    };

    if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];

        if (file.size > 8 * 1024 * 1024) {
            alert("Ukuran berkas terlalu besar! Maksimal berkas adalah 8 MB.");
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
