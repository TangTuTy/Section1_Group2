# วิธีการใช้งาน ALOHA WEB APPLICATION
##### ALOHA Football Store เป็นเว็บแอปพลิเคชันที่พัฒนาขึ้นเพื่อเป็นแพลตฟอร์มสำหรับการเลือกซื้ออุปกรณ์ฟุตบอล พร้อมด้วยระบบจัดการข้อมูลผ่าน Backend และฐานข้อมูล MySQL เพื่อให้ประสบการณ์การใช้งานที่ง่ายและสะดวกสบาย

1. ก่อนเริ่มต้นใช้งาน คุณต้องติดตั้งโปรแกรมและแพ็คเกจดังนี้:
* Node.js (แนะนำเวอร์ชัน >= 14.x)
* MySQL (สำหรับจัดการฐานข้อมูล)

2. แก้ไข package.json เพื่อทำการใช้ nodemon
``` bash
"scripts" : {
"start" : "nodemon shorestore-webservice.js"
}
```
3. ตั้งค่า .env file
* สำหรับ front-end ใช้
  ``` bash
  Port = 3000
  ```
  ในการรัน
* สำหรับ back-end
``` bash
PORT = 3030
MYSQL_HOST = your-mysql-host
MYSQL_USERNAME = your-username
MYSQL_PASSWORD = your-password
MYSQL_DATABASE = your-database
```

4. เตรียมฐานข้อมูล
  ในฐานข้อมูลมีข้อมูลเริ่มต้นให้เป็น Product 6 อย่าง และ Admin 2 คน
  ตรวจสอบให้แน่ใจว่าคุณได้สร้างฐานข้อมูลใน MySQL และตั้งค่าตารางที่จำเป็นสำหรับระบบเรียบร้อยแล้ว
6. เมื่อทำการตั้งค่าเสร็จเรียบร้อย ให้ทำการ Run โดยการเขียน
``` bash
npm start
```   

# Admin Panel
เมื่อระบบสามารถใช้งานได้ Admin สามารถเข้าสู่ระบบผ่านช่องทางเดียวกับ User โดยรหัสเริ่มต้นคือ
``` bash
username: test
password: 1234
```
และยืนยันตัวต้นด้วย reCAPTCHA ระบบจะให้ Token เพื่อเข้าถึงการ Authentocation แต่ตอนนี้ comment code ในการยืนยัน reCAPTCHA
เพราะว่าจะไม่สามารถทำการ test postman ได้
Admin สามารถเข้าถึงได้ทุกหน้าของ Web Application
เมื่อเข้าถึงหน้า Admin Panel ได้แล้ว สามารถจัดการ Admin account และ Product ได้

1. เปิด Browser และไปที่ http://localhost:3000/
2. ลงชื่อเข้าใช้ด้วย บัญชีผู้ดูแลระบบ ที่กำหนดไว้ในฐานข้อมูล

### วิธีการเพิ่มสินค้า
1. เข้าสู่ระบบในหน้า Admin
2. ไปที่เมนู Add Product
3. กรอกข้อมูลตามฟอร์มที่กำหนด
* รหัสสินค้า (Product ID)
* แบรนด์ (Brand)
* ชื่อสินค้า (Product Name)
* ราคา (Price)
* สี (Color)
* หมวดหมู่ (Category)
* จำนวนของ (Stock Quantity)
* รูปภาพสินค้า (Upload Image)
4. คลิก Create เพื่อสร้างสินค้า

### วิธีการเพิ่มบัญชีแอดมิน
1. ไปที่เมนู Add Admin
2. กรอกข้อมูลผุ้ใช้งาน เช่น
* ชื่อจริง
* นามสกุล
* ที่อยู่
* อีเมล
* username
* รหัสผ่าน
3. คลิก Create เพื่อสร้างบัญชีแอดมิน

# วิธีการใช้งาน Web Application
## การเข้าสู่ระบบ
1. เปิดเบราว์เซอร์และไปที่ http://localhost:3000
2. คลิกที่ปุ่ม login
3. กรอก username และ รหัสผ่าน แล้วคลิกเข้าสู่ระบบ

# Features
* ระบบค้นหาสินค้า
* บัญชีผู้ใช้และการลงทะเบียน
* หน้า Admin: เพิ่ม, แก้ไข และลบสินค้า/บัญชีผู้ใช้งาน

# Technologies Used
* Frontend: HTML5, CSS3, JavaScript
* Backend: Node.js, Express.js
* Database: MySQL

# Contact
## หากมีข้อสงสัย ติดต่อได้ที่:
``` bash
Github : https://github.com/Peanut2K
         https://github.com/rathchanondhs
         https://github.com/Phruek07
         https://github.com/TangTuTy
```
