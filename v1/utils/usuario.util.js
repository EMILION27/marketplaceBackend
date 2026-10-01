export const usuarioSinPassword = (usuario) => {
    const { password, ...resto } = usuario.toObject();
    return resto;
}