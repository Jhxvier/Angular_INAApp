# README2 - Guía del proyecto Angular INAApp (explicado para principiantes)

> Esta guía está hecha para entender **qué hace cada carpeta**, **qué significa cada tipo de archivo** y **qué son las funciones/utilidades de Angular/TypeScript** que vienen de librerías (no las programas tú desde cero).

---

## 1) Mapa mental rápido del proyecto

Tu app Angular está organizada por responsabilidades:

- **Pantallas** en `pages/`.
- **Lógica reutilizable** en `service/`.
- **Reglas de navegación** en `guards/`.
- **Tipos de datos** en `models/`.
- **Estructura visual compartida** en `layout/`.
- **Imports compartidos** en `shared/`.

Y todo arranca desde `main.ts`.

---

## 2) ¿Qué significa cada carpeta?

## `src/`

Carpeta principal del frontend.

### `src/main.ts`

Punto de entrada. Aquí Angular arranca la app con `bootstrapApplication(...)`.

### `src/index.html`

HTML base del navegador. Normalmente tiene `<app-root></app-root>`, que es donde Angular monta tu aplicación.

### `src/styles.scss`

Estilos globales de toda la app (tema Material, estilos generales, etc.).

### `src/environment.ts` y `src/environments.prod.ts`

Variables de entorno (URLs de API, flags de producción, endpoints).

---

## `src/app/`

Corazón de la aplicación.

### Archivos raíz de `app/`

- `app.ts`: componente raíz (equivalente al “contenedor principal”).
- `app.html`: plantilla del componente raíz.
- `app.scss`: estilos del componente raíz.
- `app.routes.ts`: define las rutas (qué componente se muestra por URL).
- `app.config.ts`: proveedores globales (router, http, hidratación SSR, etc.).
- `app.config.server.ts` / `app.routes.server.ts`: configuración adicional para ejecución server-side.

### `pages/`

Pantallas funcionales de negocio.

En tu proyecto hay al menos:

- `pages/auth/login/` → pantalla de login.
- `pages/home/` → layout/pantalla base con menú y contenido.
- `pages/dashboard/` → dashboard.
- `pages/categorias/lista-categoria/` → listado de categorías.

### `service/`

Servicios de aplicación (ejemplo: autenticación, categorías).

Aquí vive la lógica de llamadas HTTP:

- `authService.ts`
- `categoria-service.ts`

### `guards/`

Guards de rutas, por ejemplo `auth-guard.ts` para evitar entrar a una ruta si no hay sesión.

### `models/`

Interfaces/contratos de datos (tipado fuerte):

- `loginModel.ts`
- `categoria.model.ts`

### `layout/`

Componentes de estructura compartida (header/footer).

### `shared/`

Módulos o arreglos de imports reutilizables (ej: `material-imports.ts`).

---

## 3) ¿Qué hace cada tipo de archivo?

## `.ts` (TypeScript)

Aquí va la **lógica**:

- Componentes (`@Component`)
- Servicios (`@Injectable`)
- Guards (`CanActivateFn`)
- Interfaces (`interface`)
- Funciones de negocio

## `.html`

Vista/plantilla que ve el usuario:

- Estructura visual
- Binding de datos (`{{ }}`)
- Eventos (`(click)`, `(keyup)`)
- Directivas y bloques (`@if`, `@for`, `*ngIf`, etc.)

## `.scss`

Estilos visuales:

- Layout, colores, tamaños, responsive
- Estilos por componente o globales

## `.spec.ts`

Pruebas unitarias para validar comportamiento de componentes/servicios.

---

## 4) Angular “especial”: funciones y utilidades que vienen de librerías

Esta sección responde exactamente a tu duda sobre funciones “que no programas tú”, como `OnInit`, `AfterViewInit`, `Validators`, `ViewChild`, etc.

## 4.1 Hooks del ciclo de vida (Lifecycle Hooks)

Son métodos especiales que Angular ejecuta automáticamente en momentos concretos.

### `ngOnInit()` (de `OnInit`)

- Cuándo corre: justo después de crear el componente y de asignar sus inputs iniciales.
- Para qué se usa: cargar datos iniciales, hacer llamadas a servicios, preparar estado.
- En tu proyecto: en `ListaCategoria`, se usa para cargar categorías (`loadCategorias()`).

### `ngAfterViewInit()` (de `AfterViewInit`)

- Cuándo corre: cuando la vista HTML del componente ya está renderizada.
- Para qué se usa: trabajar con elementos/hijos de la vista (`@ViewChild`), por ejemplo paginador/ordenamiento de tabla.
- En tu proyecto: en `ListaCategoria`, se asigna `paginator` y `sort` al `MatTableDataSource`.

> Regla mental: `ngOnInit` = lógica inicial de datos. `ngAfterViewInit` = lógica que necesita que la vista ya exista.

---

## 4.2 Decoradores importantes de Angular

### `@Component(...)`

Marca una clase como componente Angular (vista + lógica).

### `@Injectable(...)`

Marca una clase como servicio inyectable por DI (Dependency Injection).

### `@ViewChild(...)`

Permite capturar una referencia a un elemento/componente hijo de la plantilla.

Ejemplo típico:

- `@ViewChild(MatPaginator) paginator!: MatPaginator;`
- luego en `ngAfterViewInit`: `this.dataSource.paginator = this.paginator;`

---

## 4.3 Formularios y validaciones

### `FormBuilder`

Ayuda a construir formularios reactivos (`formGroup`) de manera limpia.

### `Validators`

Colección de validadores prehechos de Angular:

- `Validators.required` → campo obligatorio.
- `Validators.email` → formato email válido.
- `Validators.minLength(n)` → longitud mínima.
- Hay más: `maxLength`, `pattern`, etc.

### `ReactiveFormsModule`

Módulo necesario para usar formularios reactivos (`[formGroup]`, `formControlName`).

---

## 4.4 Router (navegación)

### `provideRouter(...)`

Registra el sistema de rutas global en configuración.

### `Routes`

Tipo de arreglo donde defines rutas (`path`, `loadComponent`, guards).

### `Router`

Servicio para navegar por código:

- `router.navigate(['/dashboard'])`
- `router.createUrlTree(['/login'])`

### `router-outlet`

“Espacio” en el HTML donde Angular renderiza el componente de la ruta actual.

---

## 4.5 Inyección de dependencias (DI)

### `inject(...)`

Forma moderna de obtener una dependencia dentro de clase/función.

Ejemplo:

- `private authService = inject(AuthService);`
- `private http = inject(HttpClient);`

---

## 4.6 HTTP y Observables

### `HttpClient`

Servicio para hacer peticiones HTTP (`get`, `post`, `patch`, `delete`).

### `Observable<T>` (RxJS)

Representa datos asíncronos (respuestas HTTP, streams).

- Se consume con `.subscribe({ next, error })`.

---

## 4.7 Signals de Angular (estado reactivo moderno)

Tu proyecto usa:

### `signal(initialValue)`

Crea estado reactivo.

### `computed(() => ...)`

Valor derivado de otros signals.

Ejemplo en auth:

- token en `signal`.
- `isLoggedIn` como `computed(() => !!token)`.

---

## 4.8 Angular Material (UI)

Componentes listos de UI:

- `MatSidenav`, `MatToolbar`, `MatIcon`
- `MatTableDataSource`, `MatPaginator`, `MatSort`
- `mat-form-field`, `matInput`, etc.

Normalmente se importan desde un archivo central como `shared/material-imports.ts`.

---

## 4.9 TypeScript útil en este proyecto

### `interface`

Define la forma de objetos (`LoginModel`, `Categoria`).

### `public/private/protected`

Controlan visibilidad de propiedades/métodos.

### Tipos genéricos `<T>`

Ejemplo: `Observable<Categoria[]>`, `MatTableDataSource<Categoria>`.

### Aserciones de tipo (`as Tipo`)

Ejemplo: `this.loginForm.value as LoginModel`.

### Non-null assertion (`!`)

Ejemplo: `paginator!: MatPaginator;` (le dices a TS: “se inicializa después”).

---

## 5) Flujo real de tu app (paso a paso)

1. Angular arranca en `main.ts`.
2. Carga proveedores globales en `app.config.ts`.
3. Según URL, `app.routes.ts` decide qué pantalla cargar.
4. Si ruta tiene guard (`authGuard`), valida sesión antes de entrar.
5. Componentes usan servicios para traer/enviar datos al backend.
6. Plantillas HTML muestran datos y capturan eventos del usuario.
7. SCSS da estilo final a toda la experiencia.

---

## 6) Mini glosario rápido

- **Componente**: bloque de UI + lógica.
- **Servicio**: lógica reutilizable (API, sesión, utilidades).
- **Guard**: filtro de navegación.
- **Modelo/Interface**: contrato de datos.
- **Hook**: método automático del ciclo de vida.
- **DI**: mecanismo para inyectar dependencias.
- **Observable**: flujo asíncrono (RxJS).
- **Signal**: estado reactivo nativo de Angular moderno.

---

## 7) Orden recomendado para estudiar tu proyecto

1. `src/main.ts`
2. `src/app/app.config.ts`
3. `src/app/app.routes.ts`
4. `src/app/pages/home/`
5. `src/app/pages/auth/login/`
6. `src/app/service/`
7. `src/app/guards/`
8. `src/app/models/`

Con este orden entiendes rápido cómo está conectada toda la aplicación.
