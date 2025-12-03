/**
 * Configuração e inicialização do Firebase.
 *
 * Este arquivo fornece a configuração do Firebase extraída do environment
 * e funções de validação.
 */

import { environment } from "../../../environments/environment";

/**
 * Configuração do Firebase extraída do environment.
 *
 * Esta configuração é usada para inicializar o Firebase App
 * através dos providers do @angular/fire.
 */
export const firebaseConfig = {
  apiKey: environment.firebase.apiKey,
  authDomain: environment.firebase.authDomain,
  projectId: environment.firebase.projectId,
  storageBucket: environment.firebase.storageBucket,
  messagingSenderId: environment.firebase.messagingSenderId,
  appId: environment.firebase.appId,
  ...(environment.firebase.measurementId && {
    measurementId: environment.firebase.measurementId,
  }),
};

/**
 * Valida se as configurações do Firebase estão presentes e válidas.
 *
 * @returns true se todas as configurações obrigatórias estão presentes e válidas
 */
export function validateFirebaseConfig(): boolean {
  const required = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "appId",
  ];

  const config = environment.firebase;

  for (const key of required) {
    const value = config[key as keyof typeof config];

    if (
      !value ||
      value === `YOUR_${key.toUpperCase()}` ||
      value.startsWith("YOUR_")
    ) {
      console.error(
        `❌ Firebase configuration error: ${key} is missing or not configured`
      );
      console.error(
        `   Please update src/environments/environment.${
          environment.production ? "ts" : "development.ts"
        }`
      );
      return false;
    }
  }

  if (!environment.production) {
    console.log("Configuração do Firebase validada com sucesso");
  }

  return true;
}
