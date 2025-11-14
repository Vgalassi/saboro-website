# [cite_start]Usa a imagem oficial do Node.js (baseada na versão que você usa no Vagrant [cite: 43])
FROM node:22-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json ./

# Instala as dependências (usa 'ci' que é melhor para builds)
RUN npm ci

# Copia o restante do código do backend para o container
COPY . .

# [cite_start]Comando padrão para iniciar o servidor (o mesmo do Vagrantfile [cite: 44])
CMD ["npm", "start"]