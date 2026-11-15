const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const qrcode = require('qrcode'); // Khai báo thư viện QR
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Kết nối CSDL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'quanlykho_qr'
});

db.connect((err) => {
    if (err) console.log('Lỗi kết nối CSDL:', err);
    else console.log('Đã kết nối Database quanlykho_qr thành công!');
});

// --- API 1: ĐĂNG NHẬP ---
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            // Đăng nhập thành công, có kèm link bấm sang Dashboard
            res.send('<h1>Đăng nhập thành công! Chào ' + username + '</h1><br><a href="/dashboard">Bấm vào đây để tới Dashboard tạo mã QR</a>');
        } else {
            res.render('login', { error: 'Sai tài khoản hoặc mật khẩu!' });
        }
    });
});

// --- API 2: DASHBOARD & SINH MÃ QR ---
app.get('/dashboard', (req, res) => {
    res.render('dashboard', { qrImage: null });
});

app.post('/generate-qr', async (req, res) => {
    const productCode = req.body.productCode;
    try {
        const qrDataUrl = await qrcode.toDataURL(productCode);
        res.render('dashboard', { qrImage: qrDataUrl, productCode: productCode });
    } catch (err) {
        res.send('Lỗi khi tạo mã QR');
    }
});
// --- API 3: HIỂN THỊ DANH SÁCH SẢN PHẨM ---
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('products', { products: results }); // Đẩy danh sách ra giao diện
    });
});

// --- KHỞI ĐỘNG SERVER (Luôn nằm dưới cùng) ---
app.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});