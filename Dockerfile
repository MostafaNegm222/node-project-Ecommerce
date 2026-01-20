# 1. استخدم نسخة Node.js رسمية
FROM node:20

# 2. حدد مجلد العمل داخل الحاوية
WORKDIR /app

# 3. انسخ ملفات package.json و package-lock.json
COPY package*.json ./

# 4. ثبت dependencies
RUN npm install

# 5. انسخ باقي ملفات المشروع
COPY . .

# 6. ضع التطبيق ليسمع على البورت 3000
EXPOSE 3000

# 7. أمر تشغيل التطبيق
CMD ["npm", "start"]
