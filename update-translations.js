const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const enTranslations = {
  Navigation: {
    dashboard: "Dashboard",
    account: "Account",
    apiKeys: "API Keys",
    docs: "Docs",
    plans: "Plans",
    billing: "Billing",
    logout: "Logout"
  },
  AdminSidebar: {
    adminPanel: "Admin Panel",
    dashboard: "Dashboard",
    users: "Users",
    movies: "Movies",
    plans: "Plans",
    historyPlan: "History Plan",
    paymentGateway: "Payment Gateway",
    iptvManagement: "IPTV Management",
    countries: "Countries",
    categories: "Categories",
    streams: "Streams",
    backToSite: "Back to Site"
  },
  Auth: {
    login: "Login",
    welcomeBack: "Welcome back",
    signInDesc: "Sign in to enjoy thousands of favorite titles.",
    signInSub: "Movies, dramas, short dramas, anime, and the latest serials available in one platform.",
    email: "Email",
    password: "Password",
    processing: "Processing...",
    noAccount: "Don't have an account?",
    registerNow: "Register now",
    register: "Register",
    createAccount: "Create your account",
    createDesc: "Join us and unlock premium features for the best experience.",
    username: "Username",
    haveAccount: "Already have an account?"
  },
  DashboardUser: {
    overview: "Overview",
    welcomeBack: "Welcome back",
    accountStatus: "Account Status",
    currentPlan: "Current Plan",
    apiKey: "API Key",
    active: "Active",
    notGenerated: "Not Generated",
    planDetails: "Plan Details",
    planName: "Plan Name",
    apiRequests: "API Requests",
    bandwidthUsage: "Bandwidth Usage",
    validUntil: "Valid Until",
    lifetime: "Lifetime / No Expiry",
    upgradePlan: "Upgrade Plan",
    noPlan: "You don't have an active membership plan yet.",
    viewPlans: "View Plans",
    recentTransactions: "Recent Transactions",
    viewAll: "View All",
    plan: "Plan",
    price: "Price",
    date: "Date",
    status: "Status",
    noTransactions: "No transactions found."
  },
  AccountPage: {
    profile: "Profile",
    account: "Account",
    loading: "Loading account...",
    error: "Error: Account not found",
    userInfo: "User Information",
    username: "Username",
    email: "Email",
    joined: "Joined",
    updatePassword: "Update Password",
    newPassword: "New Password",
    enterNewPassword: "Enter new password",
    updating: "Updating...",
    updateUsername: "Update Username",
    enterNewUsername: "Enter new username",
    dangerZone: "Danger Zone",
    deleteWarning: "Deleting your account will remove all data, API keys, and payment history permanently.",
    deleteAccount: "Delete Account",
    deleteModalTitle: "Delete Account",
    deleteModalMessage: "Are you sure you want to delete your account? All data, API keys, and payment history will be permanently removed. This action cannot be undone."
  },
  ApiKeysPage: {
    title: "API Keys",
    desc: "Manage your API keys to access DBMovie services programmatically.",
    activeKey: "Active API Key",
    hiddenKey: "••••••••••••••••••••••••••••••••",
    generateNew: "Generate New Key",
    copy: "Copy",
    copied: "Copied!",
    generating: "Generating...",
    usage: "Usage Example",
    generateModalTitle: "Generate New API Key",
    generateModalMessage: "Are you sure you want to generate a new API key? Your current key will be permanently replaced and will stop working immediately."
  },
  HistoryPlanPage: {
    billing: "Billing",
    historyPlan: "History Plan",
    loading: "Loading history...",
    error: "Error: ",
    noHistory: "No payment history yet.",
    amount: "Amount",
    date: "Date",
    action: "Action",
    details: "Details",
    paymentDetails: "Payment Details:",
    method: "Method:",
    processedAt: "Processed At:"
  }
};

const idTranslations = {
  Navigation: {
    dashboard: "Dasbor",
    account: "Akun",
    apiKeys: "Kunci API",
    docs: "Dokumentasi",
    plans: "Paket",
    billing: "Tagihan",
    logout: "Keluar"
  },
  AdminSidebar: {
    adminPanel: "Panel Admin",
    dashboard: "Dasbor",
    users: "Pengguna",
    movies: "Film",
    plans: "Paket",
    historyPlan: "Riwayat Paket",
    paymentGateway: "Gateway Pembayaran",
    iptvManagement: "Manajemen IPTV",
    countries: "Negara",
    categories: "Kategori",
    streams: "Siaran",
    backToSite: "Kembali ke Situs"
  },
  Auth: {
    login: "Masuk",
    welcomeBack: "Selamat datang kembali",
    signInDesc: "Masuk untuk menikmati ribuan judul favorit.",
    signInSub: "Film, drama, short drama, anime, dan serial terbaru tersedia dalam satu platform.",
    email: "Email",
    password: "Kata Sandi",
    processing: "Memproses...",
    noAccount: "Belum punya akun?",
    registerNow: "Daftar sekarang",
    register: "Daftar",
    createAccount: "Buat akun Anda",
    createDesc: "Bergabunglah dengan kami dan buka fitur premium untuk pengalaman terbaik.",
    username: "Nama Pengguna",
    haveAccount: "Sudah punya akun?"
  },
  DashboardUser: {
    overview: "Ringkasan",
    welcomeBack: "Selamat datang kembali",
    accountStatus: "Status Akun",
    currentPlan: "Paket Saat Ini",
    apiKey: "Kunci API",
    active: "Aktif",
    notGenerated: "Belum Dibuat",
    planDetails: "Detail Paket",
    planName: "Nama Paket",
    apiRequests: "Permintaan API",
    bandwidthUsage: "Penggunaan Bandwidth",
    validUntil: "Berlaku Hingga",
    lifetime: "Seumur Hidup / Tanpa Batas Waktu",
    upgradePlan: "Tingkatkan Paket",
    noPlan: "Anda belum memiliki paket keanggotaan aktif.",
    viewPlans: "Lihat Paket",
    recentTransactions: "Transaksi Terakhir",
    viewAll: "Lihat Semua",
    plan: "Paket",
    price: "Harga",
    date: "Tanggal",
    status: "Status",
    noTransactions: "Tidak ada transaksi yang ditemukan."
  },
  AccountPage: {
    profile: "Profil",
    account: "Akun",
    loading: "Memuat akun...",
    error: "Kesalahan: Akun tidak ditemukan",
    userInfo: "Informasi Pengguna",
    username: "Nama Pengguna",
    email: "Email",
    joined: "Bergabung",
    updatePassword: "Perbarui Kata Sandi",
    newPassword: "Kata Sandi Baru",
    enterNewPassword: "Masukkan kata sandi baru",
    updating: "Memperbarui...",
    updateUsername: "Perbarui Nama Pengguna",
    enterNewUsername: "Masukkan nama pengguna baru",
    dangerZone: "Zona Berbahaya",
    deleteWarning: "Menghapus akun Anda akan menghapus semua data, kunci API, dan riwayat pembayaran secara permanen.",
    deleteAccount: "Hapus Akun",
    deleteModalTitle: "Hapus Akun",
    deleteModalMessage: "Apakah Anda yakin ingin menghapus akun? Semua data, kunci API, dan riwayat pembayaran akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
  },
  ApiKeysPage: {
    title: "Kunci API",
    desc: "Kelola kunci API Anda untuk mengakses layanan DBMovie secara terprogram.",
    activeKey: "Kunci API Aktif",
    hiddenKey: "••••••••••••••••••••••••••••••••",
    generateNew: "Buat Kunci Baru",
    copy: "Salin",
    copied: "Tersalin!",
    generating: "Membuat...",
    usage: "Contoh Penggunaan",
    generateModalTitle: "Buat Kunci API Baru",
    generateModalMessage: "Apakah Anda yakin ingin membuat kunci API baru? Kunci Anda saat ini akan diganti secara permanen dan akan segera berhenti berfungsi."
  },
  HistoryPlanPage: {
    billing: "Tagihan",
    historyPlan: "Riwayat Paket",
    loading: "Memuat riwayat...",
    error: "Kesalahan: ",
    noHistory: "Belum ada riwayat pembayaran.",
    amount: "Jumlah",
    date: "Tanggal",
    action: "Aksi",
    details: "Detail",
    paymentDetails: "Detail Pembayaran:",
    method: "Metode:",
    processedAt: "Diproses Pada:"
  }
};

const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const filePath = path.join(messagesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const toMerge = file === 'id.json' ? idTranslations : enTranslations;
  
  Object.assign(data, toMerge);
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated ${file}`);
}
