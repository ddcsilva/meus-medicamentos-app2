import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { MedicamentosApiService } from "./medicamentos-api.service";
import { ApiService } from "../../../core/api/api.service";
import { MedicamentoResponseDto } from "../models";

/**
 * Testes unitários para MedicamentosApiService.
 */
describe("MedicamentosApiService", () => {
  let service: MedicamentosApiService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockMedicamentoResponse: MedicamentoResponseDto = {
    id: "abc123",
    nome: "Paracetamol",
    droga: "Paracetamol",
    generico: true,
    marca: "Genérico",
    laboratorio: "Lab XYZ",
    tipo: "comprimido",
    validade: "2024-12-31",
    statusValidade: "valido",
    quantidadeTotal: 20,
    quantidadeAtual: 15,
    criadoPor: "user123",
    criadoEm: "2024-01-01T00:00:00Z",
    atualizadoEm: "2024-01-01T00:00:00Z",
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj("ApiService", [
      "get",
      "post",
      "put",
      "patch",
      "delete",
      "upload",
    ]);

    TestBed.configureTestingModule({
      providers: [
        MedicamentosApiService,
        { provide: ApiService, useValue: spy },
      ],
    });

    service = TestBed.inject(MedicamentosApiService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getAll", () => {
    it("should call api.get with correct endpoint", () => {
      apiServiceSpy.get.and.returnValue(of([mockMedicamentoResponse]));

      service.getAll().subscribe((result) => {
        expect(result.length).toBe(1);
        expect(result[0].id).toBe("abc123");
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith("/medicamentos", {
        params: undefined,
      });
    });

    it("should pass filter params correctly", () => {
      apiServiceSpy.get.and.returnValue(of([]));

      service.getAll({ status: "valido", ordenarPor: "nome" }).subscribe();

      expect(apiServiceSpy.get).toHaveBeenCalledWith("/medicamentos", {
        params: { status: "valido", ordenarPor: "nome" },
      });
    });
  });

  describe("getById", () => {
    it("should call api.get with correct endpoint", () => {
      apiServiceSpy.get.and.returnValue(of(mockMedicamentoResponse));

      service.getById("abc123").subscribe((result) => {
        expect(result.id).toBe("abc123");
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith("/medicamentos/abc123");
    });
  });

  describe("create", () => {
    it("should call api.post with correct endpoint and body", () => {
      apiServiceSpy.post.and.returnValue(of(mockMedicamentoResponse));

      const dto = {
        nome: "Paracetamol",
        droga: "Paracetamol",
        generico: true,
        marca: "Genérico",
        laboratorio: "Lab XYZ",
        tipo: "comprimido" as const,
        validade: "2024-12-31",
        quantidadeTotal: 20,
        quantidadeAtual: 20,
      };

      service.create(dto).subscribe((result) => {
        expect(result.id).toBe("abc123");
      });

      expect(apiServiceSpy.post).toHaveBeenCalledWith("/medicamentos", dto);
    });
  });

  describe("update", () => {
    it("should call api.put with correct endpoint and body", () => {
      apiServiceSpy.put.and.returnValue(of(mockMedicamentoResponse));

      const dto = { nome: "Novo Nome" };

      service.update("abc123", dto).subscribe((result) => {
        expect(result.id).toBe("abc123");
      });

      expect(apiServiceSpy.put).toHaveBeenCalledWith(
        "/medicamentos/abc123",
        dto
      );
    });
  });

  describe("updateQuantidade", () => {
    it("should call api.patch with correct endpoint and body", () => {
      apiServiceSpy.patch.and.returnValue(of(mockMedicamentoResponse));

      service.updateQuantidade("abc123", 10).subscribe((result) => {
        expect(result.id).toBe("abc123");
      });

      expect(apiServiceSpy.patch).toHaveBeenCalledWith(
        "/medicamentos/abc123/quantidade",
        { quantidadeAtual: 10 }
      );
    });
  });

  describe("incrementarQuantidade", () => {
    it("should increment quantity correctly", () => {
      apiServiceSpy.patch.and.returnValue(of(mockMedicamentoResponse));

      service.incrementarQuantidade("abc123", 5, 10).subscribe();

      expect(apiServiceSpy.patch).toHaveBeenCalledWith(
        "/medicamentos/abc123/quantidade",
        { quantidadeAtual: 15 }
      );
    });
  });

  describe("decrementarQuantidade", () => {
    it("should decrement quantity correctly", () => {
      apiServiceSpy.patch.and.returnValue(of(mockMedicamentoResponse));

      service.decrementarQuantidade("abc123", 3, 10).subscribe();

      expect(apiServiceSpy.patch).toHaveBeenCalledWith(
        "/medicamentos/abc123/quantidade",
        { quantidadeAtual: 7 }
      );
    });

    it("should not allow negative quantity", () => {
      apiServiceSpy.patch.and.returnValue(of(mockMedicamentoResponse));

      service.decrementarQuantidade("abc123", 15, 10).subscribe();

      expect(apiServiceSpy.patch).toHaveBeenCalledWith(
        "/medicamentos/abc123/quantidade",
        { quantidadeAtual: 0 }
      );
    });
  });

  describe("delete", () => {
    it("should call api.delete with correct endpoint", () => {
      apiServiceSpy.delete.and.returnValue(of(void 0));

      service.delete("abc123").subscribe();

      expect(apiServiceSpy.delete).toHaveBeenCalledWith("/medicamentos/abc123");
    });
  });

  describe("uploadFoto", () => {
    it("should call api.upload with correct params", () => {
      const mockFile = new File([""], "foto.jpg", { type: "image/jpeg" });
      apiServiceSpy.upload.and.returnValue(
        of({ fotoUrl: "https://example.com/foto.jpg" })
      );

      service.uploadFoto("abc123", mockFile).subscribe((result) => {
        expect(result.fotoUrl).toBe("https://example.com/foto.jpg");
      });

      expect(apiServiceSpy.upload).toHaveBeenCalledWith(
        "/medicamentos/abc123/foto",
        mockFile,
        "foto"
      );
    });
  });
});

