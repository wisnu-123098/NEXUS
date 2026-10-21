// 1. Mengambil elemen tombol dari HTML berdasarkan ID 'sapaButton'
const tombolSapa = document.getElementById('sapaButton');

// 2. Menambahkan aksi ketika tombol tersebut diklik oleh pengguna
tombolSapa.addEventListener('click', function() {
  // Menampilkan kotak dialog (pop-up) di layar
  alert('Halo! Terima kasih sudah berkunjung!');
});
