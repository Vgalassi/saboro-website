Vagrant.configure("2") do |config|
  config.vm.define "front" do |front|
    front.vm.box = "bento/ubuntu-22.04"
    front.vm.hostname = "front"
    front.vm.network "private_network", ip: "192.168.100.30", virtualbox__intnet: "rede_interna"
    front.vm.network "public_network"
    front.vm.provision "shell", inline: <<-SHELL
        sudo apt update
        curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - # Replace 'lts.x' with the desired version (e.g., '20.x')
       sudo apt install -y git curl

      # Clonar ou atualizar o repositório
      if [ ! -d "/home/vagrant/saboro" ]; then
        git clone https://github.com/Vgalassi/saboro2.git /home/vagrant/saboro
      else
        cd /home/vagrant/saboro && git pull
      fi
        sudo apt install -y nodejs
        cd /home/vagrant/saboro/frontend
        npm install
        
        nohup npm run dev > /home/vagrant/saboro/frontend/back.log 2>&1 &
        SHELL
        front.vm.provider "virtualbox" do |vb|
          vb.gui = true   
        
    end
  end

  config.vm.define "db" do |db|
    db.vm.box = "bento/ubuntu-22.04"
    db.vm.hostname = "db"
    db.vm.network "private_network", ip: "192.168.100.20", virtualbox__intnet: "rede_interna"
    db.vm.provider "virtualbox" do |vb|
      vb.gui = true
    db.vm.provision "shell", inline: <<-SHELL
        # Atualiza os pacotes e instala o MySQL
        apt-get update
        DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server

        # Altera a configuração do MySQL para aceitar conexões externas
        # Usa o `sed` para comentar a linha `bind-address`
        sed -i 's/^bind-address/#bind-address/' /etc/mysql/mysql.conf.d/mysqld.cnf

        # Reinicia o serviço do MySQL
        systemctl restart mysql

        # Define a senha do root do MySQL para 'root' (apenas para ambiente de desenvolvimento!)
        mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';"

        mysql -uroot -proot -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';"
        # Cria um novo usuário e concede permissões para o IP 192.168.100.10
        mysql -uroot -proot -e "CREATE USER 'root'@'192.168.100.10' IDENTIFIED BY 'root';"
        mysql -uroot -proot -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.100.10';"
        mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS saboro;"

        # Recarrega as permissões
        mysql -uroot -proot -e "FLUSH PRIVILEGES;"
        
        sudo ip link set eth0 down
      SHELL
    end
  end

 config.vm.define "back" do |back|
  back.vm.box = "bento/ubuntu-22.04"
  back.vm.hostname = "back"
  back.vm.network "private_network", ip: "192.168.100.10", virtualbox__intnet: "rede_interna"

  back.vm.provider "virtualbox" do |vb|
    vb.gui = true
  end

  back.vm.provision "shell", inline: <<-SHELL
      sudo apt update -y
      sudo apt install -y git curl

      # Instalar Node.js (versão 22, como você colocou)
      curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
      sudo apt install -y nodejs

      # Clonar ou atualizar o repositório
      if [ ! -d "/home/vagrant/saboro" ]; then
        git clone https://github.com/Vgalassi/saboro2.git /home/vagrant/saboro
      else
        cd /home/vagrant/saboro && git pull
      fi

      # Instalar dependências e iniciar backend
      cd /home/vagrant/saboro/backend
      npm install
      sudo mkdir images

      # Iniciar backend em background
      nohup npm start > /home/vagrant/saboro/backend/back.log 2>&1 &

      sudo ip link set eth0 down
    SHELL
  end
end
