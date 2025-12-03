import { inject, Injectable } from "@angular/core";
import { Auth, authState, User } from "@angular/fire/auth";
import { Firestore } from "@angular/fire/firestore";
import { Storage } from "@angular/fire/storage";
import { Observable } from "rxjs";

/**
 * Serviço centralizado para acessar instâncias do Firebase.
 *
 * Este serviço encapsula o acesso direto ao SDK do Firebase,
 * fornecendo uma interface limpa e tipada para outros serviços.
 *
 * @example
 * constructor(private firebase: FirebaseClientService) {
 *   // Obter instância do Auth
 *   const auth = this.firebase.getAuth();
 *
 *   // Observar estado de autenticação
 *   this.firebase.getAuthState().subscribe(user => {
 *     console.log('User:', user);
 *   });
 * }
 */
@Injectable({
  providedIn: "root",
})
export class FirebaseClientService {
  private readonly _auth = inject(Auth);
  private readonly _firestore = inject(Firestore);
  private readonly _storage = inject(Storage);

  /**
   * Obtém a instância do Firebase Auth.
   *
   * @returns Instância do Auth
   */
  getAuth(): Auth {
    return this._auth;
  }

  /**
   * Obtém a instância do Firestore.
   *
   * @returns Instância do Firestore
   */
  getFirestore(): Firestore {
    return this._firestore;
  }

  /**
   * Obtém a instância do Firebase Storage.
   *
   * @returns Instância do Storage
   */
  getStorage(): Storage {
    return this._storage;
  }

  /**
   * Observa o estado de autenticação do usuário.
   *
   * Emite:
   * - `User | null` quando o estado muda
   * - `null` quando o usuário não está autenticado
   *
   * @returns Observable do estado de autenticação
   */
  getAuthState(): Observable<User | null> {
    return authState(this._auth);
  }

  /**
   * Obtém o usuário atual autenticado.
   *
   * @returns Usuário atual ou null se não autenticado
   */
  getCurrentUser(): User | null {
    return this._auth.currentUser;
  }
}
