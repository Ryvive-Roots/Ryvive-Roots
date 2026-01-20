cd /var/www/Ryvive-Roots
ls -a
git pull origin main
cd frontend-web
npm install
npm run build
sudo cp -r dist/* /var/www/ryviveroots-frontend/
sudo systemctl reload nginx
