/**
 * Preferência de aparência (claro/escuro) do app do hóspede.
 * Em módulo neutro (sem "use client") para o layout do servidor e o botão
 * cliente lerem a MESMA constante — importar valor de um módulo client para um
 * server component devolveria uma referência, não a string.
 */
export const APPEARANCE_COOKIE = "sb-appearance";
