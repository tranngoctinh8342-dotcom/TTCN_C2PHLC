const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

// Cấu hình để lát nữa dùng giao diện HTML/EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Kết nối CSDL MySQL (XAMPP)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'quanlykho_qr'
});

db.connect((err) => {
    if (err) {
        console.log('Lỗi kết nối CSDL:', err);
    } else {
        console.log('Đã kết nối Database quanlykho_qr thành công!');
    }
});

// Chạy server
app.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
    // --- API: Hiển thị trang đăng nhập ---
app.get('/login', (req, res) => {
    res.render('login');
});

// --- API: Xử lý dữ liệu đăng nhập ---
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Truy vấn MySQL kiểm tra tài khoản
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // Đăng nhập thành công -> Chuyển hướng tới trang Dashboard (sẽ làm sau)
            res.send('<h1>Đăng nhập thành công! Chào ' + username + '</h1>');
        } else {
            // Sai pass -> Trả về lỗi
            res.render('login', { error: 'Sai tài khoản hoặc mật khẩu!' });
        }
    });
});
});