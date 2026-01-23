1. cd /var/www/Ryvive-Roots
2. ls -a
3. git pull origin main
4. cd frontend-web
5. npm install
6. npm run build
7. sudo cp -r dist/* /var/www/ryviveroots-frontend/
8. sudo systemctl reload nginx

cd /var/www/Ryvive-Roots
git pull origin main

cd admin
npm run build
sudo rm -rf /var/www/ryviveroots-admin/*
sudo cp -r dist/* /var/www/ryviveroots-admin/
sudo systemctl reload nginx
