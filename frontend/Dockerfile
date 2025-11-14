# [cite_start]Usa a imagem oficial do Node.js (baseada na versão do Vagrant [cite: 28])
FROM node:22-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm ci

# Copia o restante do código do frontend
COPY . .

# [cite_start]Comando para iniciar o servidor de desenvolvimento [cite: 28]
# Adicionamos '--host 0.0.0.0' para que o servidor React
# seja acessível de fora do container.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]