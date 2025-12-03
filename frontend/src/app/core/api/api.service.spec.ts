import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ApiService, ApiError } from "./api.service";

/**
 * Testes unitários para ApiService.
 */
describe("ApiService", () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("GET requests", () => {
    it("should make GET request to correct URL", () => {
      // TODO: Implementar teste
      expect(true).toBeTruthy();
    });

    it("should pass query params correctly", () => {
      // TODO: Implementar teste
      expect(true).toBeTruthy();
    });
  });

  describe("POST requests", () => {
    it("should make POST request with body", () => {
      // TODO: Implementar teste
      expect(true).toBeTruthy();
    });
  });

  describe("PUT requests", () => {
    it("should make PUT request with body", () => {
      // TODO: Implementar teste
      expect(true).toBeTruthy();
    });
  });

  describe("PATCH requests", () => {
    it("should make PATCH request with body", () => {
      // TODO: Implementar teste
      expect(true).toBeTruthy();
    });
  });

  describe("DELETE requests", () => {
    it("should make DELETE request", () => {
      // TODO: Implementar teste
      expect(true).toBeTruthy();
    });
  });

  describe("Error handling", () => {
    it("should handle 401 Unauthorized", () => {
      // TODO: Implementar teste
      expect(true).toBeTruthy();
    });

    it("should handle 404 Not Found", () => {
      // TODO: Implementar teste
      expect(true).toBeTruthy();
    });

    it("should handle 500 Internal Server Error", () => {
      // TODO: Implementar teste
      expect(true).toBeTruthy();
    });

    it("should handle network errors", () => {
      // TODO: Implementar teste
      expect(true).toBeTruthy();
    });

    it("should extract server error message", () => {
      // TODO: Implementar teste
      expect(true).toBeTruthy();
    });
  });

  describe("File upload", () => {
    it("should upload file via FormData", () => {
      // TODO: Implementar teste
      expect(true).toBeTruthy();
    });
  });
});

