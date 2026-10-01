/** Preferência "Reduzir movimento" do site (sem "use client": o layout do servidor também lê daqui). */
export const CHAVE_MOVIMENTO = "diamond:movimento";
export const CLASSE_SEM_MOVIMENTO = "sem-movimento";

/* Aplica a preferência antes da primeira pintura (vai num <script> no <head>) */
export const SCRIPT_MOVIMENTO = `try{if(localStorage.getItem("${CHAVE_MOVIMENTO}")==="reduzido")document.documentElement.classList.add("${CLASSE_SEM_MOVIMENTO}")}catch(e){}`;
