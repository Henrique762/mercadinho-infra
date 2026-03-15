const validateVendedor = (form) => {
  const errors = {};

  // Nome
  if (!form.nome) {
    errors.nome = "Campo não informado.";
  } else if (typeof form.nome !== "string") {
    errors.nome = "Campo deve ser uma String";
  } else if (form.nome.length > 255) {
    errors.nome = "Campo deve ter no máximo 255 caracteres.";
  }

  // CNPJ
  if (!form.cnpj) {
    errors.cnpj = "Campo não informado.";
  } else if (typeof form.cnpj !== "string") {
    errors.cnpj = "Campo deve ser uma String";
  } else if (form.cnpj.length !== 14) {
    errors.cnpj = "Campo deve ter 14 caracteres.";
  }

  // Email
  if (!form.email) {
    errors.email = "Campo não informado.";
  } else if (typeof form.email !== "string") {
    errors.email = "Campo deve ser uma String";
  } else if (form.email.length > 255) {
    errors.email = "Campo deve ter no máximo 255 caracteres";
  } else {
    const emailRegex = /@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    if (!emailRegex.test(form.email)) {
      errors.email = "Campo inválido";
    }
  }

  // Senha
  if (!form.senha) {
    errors.senha = "Campo não informado.";
  } else if (typeof form.senha !== "string") {
    errors.senha = "Campo deve ser uma String";
  } else {
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/;
    if (form.senha.length < 8 || !senhaRegex.test(form.senha)) {
      errors.senha = "Campo deve ter no mínimo 8 caracteres com maiúsculas, minúsculas e um caractere especial";
    }
  }

  // Celular
  if (!form.celular) {
    errors.celular = "Campo não informado.";
  } else if (typeof form.celular !== "string") {
    errors.celular = "Campo deve ser uma String";
  } else {
    const celularRegex = /^\+\d{1,3}\d{2}\d{8,9}$/;
    if (!celularRegex.test(form.celular)) {
      errors.celular = "Número inválido. Use o formato: +DDIDDDNÚMERO (ex: +5511912345678)";
    }
  }

  return errors;
};

export default validateVendedor;
