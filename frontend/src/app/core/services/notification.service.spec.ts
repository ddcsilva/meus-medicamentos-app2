import { TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  describe('Inicialização', () => {
    it('deve ser criado', () => {
      expect(service).toBeTruthy();
    });

    it('deve iniciar sem notificações', () => {
      expect(service.notifications()).toEqual([]);
      expect(service.hasNotifications()).toBe(false);
      expect(service.notificationCount()).toBe(0);
    });
  });

  describe('Criação de notificações', () => {
    it('deve criar notificação de sucesso', () => {
      const id = service.success('Operação realizada!');

      expect(id).toBeTruthy();
      expect(service.notifications().length).toBe(1);
      expect(service.notifications()[0].type).toBe('success');
      expect(service.notifications()[0].message).toBe('Operação realizada!');
    });

    it('deve criar notificação de erro', () => {
      const id = service.error('Algo deu errado!');

      expect(id).toBeTruthy();
      expect(service.notifications()[0].type).toBe('error');
    });

    it('deve criar notificação de aviso', () => {
      const id = service.warning('Atenção!');

      expect(id).toBeTruthy();
      expect(service.notifications()[0].type).toBe('warning');
    });

    it('deve criar notificação informativa', () => {
      const id = service.info('Informação importante');

      expect(id).toBeTruthy();
      expect(service.notifications()[0].type).toBe('info');
    });

    it('deve criar notificação genérica via show()', () => {
      const id = service.show('success', 'Mensagem genérica');

      expect(id).toBeTruthy();
      expect(service.notifications()[0].message).toBe('Mensagem genérica');
    });

    it('deve aplicar opções customizadas', () => {
      const id = service.success('Teste', {
        title: 'Título Customizado',
        duration: 10000,
        dismissible: false,
      });

      const notification = service.notifications()[0];
      expect(notification.title).toBe('Título Customizado');
      expect(notification.duration).toBe(10000);
      expect(notification.dismissible).toBe(false);
    });

    it('deve incluir ação na notificação', () => {
      const callback = jest.fn();
      service.success('Teste', {
        action: { label: 'Desfazer', callback },
      });

      const notification = service.notifications()[0];
      expect(notification.action).toBeDefined();
      expect(notification.action?.label).toBe('Desfazer');
    });

    it('deve gerar IDs únicos para cada notificação', () => {
      const id1 = service.success('Primeira');
      const id2 = service.success('Segunda');
      const id3 = service.success('Terceira');

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
    });
  });

  describe('Durações padrão', () => {
    it('deve usar duração padrão para sucesso (4000ms)', () => {
      service.success('Teste');
      expect(service.notifications()[0].duration).toBe(4000);
    });

    it('deve usar duração padrão para erro (6000ms)', () => {
      service.error('Teste');
      expect(service.notifications()[0].duration).toBe(6000);
    });

    it('deve usar duração padrão para warning (5000ms)', () => {
      service.warning('Teste');
      expect(service.notifications()[0].duration).toBe(5000);
    });

    it('deve usar duração padrão para info (5000ms)', () => {
      service.info('Teste');
      expect(service.notifications()[0].duration).toBe(5000);
    });
  });

  describe('Remoção de notificações', () => {
    it('deve remover notificação por ID', () => {
      const id = service.success('Teste');
      expect(service.notifications().length).toBe(1);

      service.dismiss(id);
      expect(service.notifications().length).toBe(0);
    });

    it('deve remover todas as notificações', () => {
      service.success('Primeira');
      service.error('Segunda');
      service.warning('Terceira');
      expect(service.notifications().length).toBe(3);

      service.dismissAll();
      expect(service.notifications().length).toBe(0);
    });

    it('deve remover notificações por tipo', () => {
      service.success('Sucesso 1');
      service.success('Sucesso 2');
      service.error('Erro 1');
      service.warning('Aviso 1');
      expect(service.notifications().length).toBe(4);

      service.dismissByType('success');
      expect(service.notifications().length).toBe(2);
      expect(service.notifications().every((n) => n.type !== 'success')).toBe(true);
    });

    it('deve ignorar dismiss de ID inexistente', () => {
      service.success('Teste');
      const countBefore = service.notifications().length;

      service.dismiss('id-inexistente');
      expect(service.notifications().length).toBe(countBefore);
    });
  });

  describe('Auto-dismiss', () => {
    it('deve remover notificação automaticamente após duração', fakeAsync(() => {
      service.success('Teste', { duration: 1000 });
      expect(service.notifications().length).toBe(1);

      tick(1000);
      expect(service.notifications().length).toBe(0);
    }));

    it('deve não auto-remover se duração for 0', fakeAsync(() => {
      service.success('Teste', { duration: 0 });
      expect(service.notifications().length).toBe(1);

      tick(10000);
      expect(service.notifications().length).toBe(1);
    }));

    it('deve cancelar timer ao remover manualmente', fakeAsync(() => {
      const id = service.success('Teste', { duration: 5000 });
      expect(service.notifications().length).toBe(1);

      // Remove manualmente antes do timer
      service.dismiss(id);
      expect(service.notifications().length).toBe(0);

      // Avança o tempo - não deve dar erro de timer pendente
      tick(5000);
      expect(service.notifications().length).toBe(0);
    }));

    it('deve cancelar todos os timers ao dismissAll', fakeAsync(() => {
      service.success('Teste 1', { duration: 3000 });
      service.success('Teste 2', { duration: 5000 });
      service.success('Teste 3', { duration: 7000 });

      service.dismissAll();

      // Avança o tempo - não deve dar erro
      tick(10000);
      expect(service.notifications().length).toBe(0);
    }));

    it('deve cancelar timers ao dismissByType', fakeAsync(() => {
      service.success('Sucesso 1', { duration: 3000 });
      service.success('Sucesso 2', { duration: 5000 });
      service.error('Erro 1', { duration: 4000 });

      service.dismissByType('success');

      tick(3000);
      tick(5000);
      // Apenas o erro deve ter sido removido pelo timer
      tick(4000);
      expect(service.notifications().length).toBe(0);
    }));
  });

  describe('Limite de notificações', () => {
    it('deve limitar a 5 notificações (MAX_NOTIFICATIONS)', () => {
      for (let i = 0; i < 10; i++) {
        service.success(`Notificação ${i}`);
      }

      expect(service.notifications().length).toBe(5);
    });

    it('deve manter as notificações mais recentes', () => {
      for (let i = 0; i < 7; i++) {
        service.success(`Notificação ${i}`, { duration: 0 });
      }

      const messages = service.notifications().map((n) => n.message);
      expect(messages).toContain('Notificação 6');
      expect(messages).toContain('Notificação 5');
      expect(messages).not.toContain('Notificação 0');
      expect(messages).not.toContain('Notificação 1');
    });
  });

  describe('Computed signals', () => {
    it('hasNotifications deve refletir estado atual', () => {
      expect(service.hasNotifications()).toBe(false);

      const id = service.success('Teste');
      expect(service.hasNotifications()).toBe(true);

      service.dismiss(id);
      expect(service.hasNotifications()).toBe(false);
    });

    it('notificationCount deve refletir quantidade atual', () => {
      expect(service.notificationCount()).toBe(0);

      service.success('Primeira');
      expect(service.notificationCount()).toBe(1);

      service.error('Segunda');
      expect(service.notificationCount()).toBe(2);

      service.dismissAll();
      expect(service.notificationCount()).toBe(0);
    });
  });

  describe('Cleanup (ngOnDestroy)', () => {
    it('deve limpar timers pendentes ao destruir', fakeAsync(() => {
      service.success('Teste 1', { duration: 5000 });
      service.success('Teste 2', { duration: 10000 });

      // Destroi o serviço
      service.ngOnDestroy();

      // Não deve haver timers pendentes
      // Se houvesse, fakeAsync lançaria erro
      discardPeriodicTasks();
    }));
  });

  describe('Propriedades da notificação', () => {
    it('deve incluir createdAt timestamp', () => {
      const before = Date.now();
      service.success('Teste');
      const after = Date.now();

      const notification = service.notifications()[0];
      expect(notification.createdAt).toBeGreaterThanOrEqual(before);
      expect(notification.createdAt).toBeLessThanOrEqual(after);
    });

    it('deve ter dismissible true por padrão', () => {
      service.success('Teste');
      expect(service.notifications()[0].dismissible).toBe(true);
    });
  });
});
