import { getFirestore, COLLECTIONS } from "../firebase";
import {
  Medicamento,
  CreateMedicamentoDto,
  UpdateMedicamentoDto,
  MedicamentosFiltrosDto,
  MedicamentoFirestoreDoc,
  createDtoToFirestore,
  updateDtoToFirestore,
  quantidadeUpdateToFirestore,
  documentSnapshotToMedicamento,
  querySnapshotToMedicamentos,
  FIRESTORE_INDEXED_FIELDS,
} from "../domain";
import { RepositoryError, NotFoundError } from "./errors";

/**
 * Interface do repositório de medicamentos.
 *
 * Define as operações de persistência disponíveis.
 */
export interface IMedicamentosRepository {
  findAll(userId: string, filtros?: MedicamentosFiltrosDto): Promise<Medicamento[]>;
  findById(id: string, userId: string): Promise<Medicamento | null>;
  create(dto: CreateMedicamentoDto, userId: string): Promise<Medicamento>;
  update(id: string, dto: UpdateMedicamentoDto, userId: string): Promise<Medicamento>;
  updateQuantidade(id: string, quantidade: number, userId: string): Promise<Medicamento>;
  delete(id: string, userId: string): Promise<void>;
  exists(id: string, userId: string): Promise<boolean>;
  countByUser(userId: string): Promise<number>;
}

/**
 * Repositório de medicamentos usando Firestore.
 *
 * Encapsula todas as operações de persistência na coleção `medicamentos`.
 * Não contém lógica de negócio, apenas acesso a dados.
 */
export class MedicamentosRepository implements IMedicamentosRepository {
  private readonly collectionName = COLLECTIONS.MEDICAMENTOS;

  /**
   * Obtém a referência da coleção de medicamentos.
   */
  private get collection() {
    return getFirestore().collection(this.collectionName);
  }

  /**
   * Busca todos os medicamentos de um usuário.
   *
   * @param userId - UID do usuário
   * @param filtros - Filtros opcionais de busca
   * @returns Lista de medicamentos
   */
  async findAll(
    userId: string,
    filtros?: MedicamentosFiltrosDto
  ): Promise<Medicamento[]> {
    try {
      let query = this.collection.where(
        FIRESTORE_INDEXED_FIELDS.CRIADO_POR,
        "==",
        userId
      );

      // Aplicar filtros do Firestore (filtros que podem ser feitos no banco)
      if (filtros?.tipo) {
        query = query.where(FIRESTORE_INDEXED_FIELDS.TIPO, "==", filtros.tipo);
      }

      if (filtros?.generico !== undefined) {
        query = query.where(
          FIRESTORE_INDEXED_FIELDS.GENERICO,
          "==",
          filtros.generico
        );
      }

      if (filtros?.laboratorio) {
        query = query.where(
          FIRESTORE_INDEXED_FIELDS.LABORATORIO,
          "==",
          filtros.laboratorio
        );
      }

      // Ordenação
      // NOTA: Para evitar necessidade de índices compostos, sempre ordenamos por criadoEm no Firestore
      // A ordenação por outros campos será feita em memória no serviço
      const ordem = filtros?.ordem || "desc";
      query = query.orderBy(FIRESTORE_INDEXED_FIELDS.CRIADO_EM, ordem);

      // Paginação (se especificada)
      if (filtros?.pageSize) {
        query = query.limit(filtros.pageSize);

        if (filtros.page && filtros.page > 1) {
          // Para paginação real, seria necessário usar cursors
          // Por simplicidade, usamos offset (menos eficiente para páginas grandes)
          query = query.offset((filtros.page - 1) * filtros.pageSize);
        }
      }

      const snapshot = await query.get();
      return querySnapshotToMedicamentos(snapshot);
    } catch (error) {
      throw this.handleError(error, "buscar medicamentos");
    }
  }

  /**
   * Busca um medicamento pelo ID.
   *
   * @param id - ID do medicamento
   * @param userId - UID do usuário (para verificar propriedade)
   * @returns Medicamento ou null se não encontrado
   */
  async findById(id: string, userId: string): Promise<Medicamento | null> {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data() as MedicamentoFirestoreDoc;

      // Verificar se pertence ao usuário
      if (data.criadoPor !== userId) {
        return null;
      }

      return documentSnapshotToMedicamento(doc);
    } catch (error) {
      throw this.handleError(error, "buscar medicamento");
    }
  }

  /**
   * Cria um novo medicamento.
   *
   * @param dto - Dados do medicamento
   * @param userId - UID do usuário criador
   * @returns Medicamento criado
   */
  async create(dto: CreateMedicamentoDto, userId: string): Promise<Medicamento> {
    try {
      const firestoreData = createDtoToFirestore(dto, userId);
      const docRef = await this.collection.add(firestoreData);
      const doc = await docRef.get();

      const medicamento = documentSnapshotToMedicamento(doc);

      if (!medicamento) {
        throw new RepositoryError("Falha ao criar medicamento");
      }

      return medicamento;
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw this.handleError(error, "criar medicamento");
    }
  }

  /**
   * Atualiza um medicamento existente.
   *
   * @param id - ID do medicamento
   * @param dto - Dados para atualização
   * @param userId - UID do usuário (para verificar propriedade)
   * @returns Medicamento atualizado
   */
  async update(
    id: string,
    dto: UpdateMedicamentoDto,
    userId: string
  ): Promise<Medicamento> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundError("Medicamento não encontrado");
      }

      const data = doc.data() as MedicamentoFirestoreDoc;

      if (data.criadoPor !== userId) {
        throw new NotFoundError("Medicamento não encontrado");
      }

      const updateData = updateDtoToFirestore(dto);
      await docRef.update(updateData);

      const updatedDoc = await docRef.get();
      const medicamento = documentSnapshotToMedicamento(updatedDoc);

      if (!medicamento) {
        throw new RepositoryError("Falha ao atualizar medicamento");
      }

      return medicamento;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof RepositoryError) {
        throw error;
      }
      throw this.handleError(error, "atualizar medicamento");
    }
  }

  /**
   * Atualiza apenas a quantidade de um medicamento.
   *
   * @param id - ID do medicamento
   * @param quantidade - Nova quantidade
   * @param userId - UID do usuário (para verificar propriedade)
   * @returns Medicamento atualizado
   */
  async updateQuantidade(
    id: string,
    quantidade: number,
    userId: string
  ): Promise<Medicamento> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundError("Medicamento não encontrado");
      }

      const data = doc.data() as MedicamentoFirestoreDoc;

      if (data.criadoPor !== userId) {
        throw new NotFoundError("Medicamento não encontrado");
      }

      const updateData = quantidadeUpdateToFirestore(quantidade);
      await docRef.update(updateData);

      const updatedDoc = await docRef.get();
      const medicamento = documentSnapshotToMedicamento(updatedDoc);

      if (!medicamento) {
        throw new RepositoryError("Falha ao atualizar quantidade");
      }

      return medicamento;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof RepositoryError) {
        throw error;
      }
      throw this.handleError(error, "atualizar quantidade");
    }
  }

  /**
   * Deleta um medicamento.
   *
   * @param id - ID do medicamento
   * @param userId - UID do usuário (para verificar propriedade)
   */
  async delete(id: string, userId: string): Promise<void> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundError("Medicamento não encontrado");
      }

      const data = doc.data() as MedicamentoFirestoreDoc;

      if (data.criadoPor !== userId) {
        throw new NotFoundError("Medicamento não encontrado");
      }

      await docRef.delete();
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw this.handleError(error, "deletar medicamento");
    }
  }

  /**
   * Verifica se um medicamento existe e pertence ao usuário.
   *
   * @param id - ID do medicamento
   * @param userId - UID do usuário
   * @returns true se existe e pertence ao usuário
   */
  async exists(id: string, userId: string): Promise<boolean> {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        return false;
      }

      const data = doc.data() as MedicamentoFirestoreDoc;
      return data.criadoPor === userId;
    } catch (error) {
      throw this.handleError(error, "verificar medicamento");
    }
  }

  /**
   * Conta o total de medicamentos de um usuário.
   *
   * @param userId - UID do usuário
   * @returns Total de medicamentos
   */
  async countByUser(userId: string): Promise<number> {
    try {
      const snapshot = await this.collection
        .where(FIRESTORE_INDEXED_FIELDS.CRIADO_POR, "==", userId)
        .count()
        .get();

      return snapshot.data().count;
    } catch (error) {
      throw this.handleError(error, "contar medicamentos");
    }
  }

  /**
   * Trata erros do Firestore e converte para erros de domínio.
   *
   * @param error - Erro original
   * @param operation - Descrição da operação
   * @returns Erro de repositório
   */
  private handleError(error: unknown, operation: string): RepositoryError {
    const err = error as { code?: string; message?: string };

    console.error(`[MedicamentosRepository] Erro ao ${operation}:`, error);

    // Erros específicos do Firestore
    if (err.code === "permission-denied") {
      return new RepositoryError(
        "Permissão negada para acessar o Firestore",
        "PERMISSION_DENIED"
      );
    }

    if (err.code === "unavailable") {
      return new RepositoryError(
        "Serviço do Firestore indisponível",
        "SERVICE_UNAVAILABLE"
      );
    }

    if (err.code === "deadline-exceeded") {
      return new RepositoryError(
        "Tempo limite excedido ao acessar o Firestore",
        "TIMEOUT"
      );
    }

    if (err.code === "not-found") {
      return new RepositoryError("Documento não encontrado", "NOT_FOUND");
    }

    // Erro genérico
    return new RepositoryError(
      err.message || `Erro ao ${operation}`,
      "REPOSITORY_ERROR"
    );
  }
}

/**
 * Instância singleton do repositório.
 *
 * Pode ser substituída em testes por um mock.
 */
let repositoryInstance: IMedicamentosRepository | null = null;

/**
 * Obtém a instância do repositório de medicamentos.
 *
 * @returns Instância do repositório
 */
export function getMedicamentosRepository(): IMedicamentosRepository {
  if (!repositoryInstance) {
    repositoryInstance = new MedicamentosRepository();
  }
  return repositoryInstance;
}

/**
 * Define uma instância customizada do repositório (para testes).
 *
 * @param repository - Instância do repositório
 */
export function setMedicamentosRepository(
  repository: IMedicamentosRepository | null
): void {
  repositoryInstance = repository;
}

