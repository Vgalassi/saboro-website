const bcrypt = require("bcryptjs");
const User = require("../models/user"); 

exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "E-mail já cadastrado" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    res.status(201).json({
      message: "Usuário registrado com sucesso!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('sem usuario')
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('senha incorreta')
      return res.status(401).json({ error: "Senha incorreta" });
    }
    console.log('logando')
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.status(200).json({
      message: "Login realizado com sucesso!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao realizar login" });
  }
};


exports.me = (req, res) => {
  if (!req.session.isLoggedIn || !req.session.user) {
    return res.status(401).json({ user: null });
  }
  res.json({ user: req.session.user });
};


exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Erro ao sair" });
    res.json({ message: "Logout realizado" });
  });
};