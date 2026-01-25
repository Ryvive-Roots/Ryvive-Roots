1. cd /var/www/Ryvive-Roots
2. ls -a
3. git pull origin main
4. cd frontend-web
5. npm install
6. npm run build
7. sudo cp -r dist/* /var/www/ryviveroots-frontend/
8. sudo systemctl reload nginx


1. cd admin
2. npm run build
3. sudo rm -rf /var/www/ryviveroots-admin/*
4. sudo cp -r dist/* /var/www/ryviveroots-admin/
5. sudo systemctl reload nginx

1. cd /var/www/Ryvive-Roots
2. git pull origin main
3. cd backend
4. pm2 restart project-backend
