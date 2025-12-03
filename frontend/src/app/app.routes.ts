import { Routes } from "@angular/router";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component";
import { authGuard, guestGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  // Rotas públicas com AuthLayout (protegidas por guestGuard)
  {
    path: "auth",
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      {
        path: "login",
        loadComponent: () =>
          import("./features/auth/pages/login-page/login-page.component").then(
            (m) => m.LoginPageComponent
          ),
      },
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
      },
    ],
  },

  // Alias para /login (redireciona para /auth/login)
  {
    path: "login",
    redirectTo: "/auth/login",
    pathMatch: "full",
  },

  // Rotas protegidas com MainLayout (protegidas por authGuard)
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "medicamentos",
        children: [
          {
            path: "",
            loadComponent: () =>
              import(
                "./features/medicamentos/pages/medicamentos-list-page/medicamentos-list-page.component"
              ).then((m) => m.MedicamentosListPageComponent),
          },
          {
            path: "novo",
            loadComponent: () =>
              import(
                "./features/medicamentos/pages/medicamentos-new-page/medicamentos-new-page.component"
              ).then((m) => m.MedicamentosNewPageComponent),
          },
          {
            path: ":id",
            loadComponent: () =>
              import(
                "./features/medicamentos/pages/medicamentos-detail-page/medicamentos-detail-page.component"
              ).then((m) => m.MedicamentosDetailPageComponent),
          },
        ],
      },
      {
        path: "404",
        loadComponent: () =>
          import(
            "./features/shared/pages/not-found-page/not-found-page.component"
          ).then((m) => m.NotFoundPageComponent),
      },
      {
        path: "",
        redirectTo: "/medicamentos",
        pathMatch: "full",
      },
    ],
  },

  // Redirecionamento para rotas não encontradas
  {
    path: "**",
    redirectTo: "/404",
  },
];

