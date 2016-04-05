# Mysql docker start command
sudo docker run --name freelancealot-mysql -p 3306:3306 -v /home/sevenstringargs/dockerData/freelancalot/mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=<password> -d mysql
