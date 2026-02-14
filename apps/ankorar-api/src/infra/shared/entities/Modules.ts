export interface AppModules {}

type ModuleClassLike = {
  moduleKey: string;
  create: () => unknown;
};

type RegisteredModuleClasses = Record<string, ModuleClassLike>;

let activeModules: Record<string, unknown> | null = null;
const registeredModuleClasses: RegisteredModuleClasses = {};
const fallbackModules: Record<string, unknown> = {};

export interface AppModuleClass<TKey extends string, TModule> {
  moduleKey: TKey;
  create(): TModule;
}

export function registerModuleClass<TKey extends string, TModule>(
  moduleClass: AppModuleClass<TKey, TModule>,
) {
  registeredModuleClasses[moduleClass.moduleKey] = moduleClass;
}

export function setActiveModules(modules: Partial<AppModules>) {
  activeModules = modules as Record<string, unknown>;
}

export function getActiveModules() {
  return activeModules as Partial<AppModules> | null;
}

export function getAppModule<TKey extends keyof AppModules & string>(
  moduleKey: TKey,
): AppModules[TKey] {
  if (activeModules && moduleKey in activeModules) {
    return activeModules[moduleKey] as AppModules[TKey];
  }

  if (moduleKey in fallbackModules) {
    return fallbackModules[moduleKey] as AppModules[TKey];
  }

  const moduleClass = registeredModuleClasses[moduleKey];
  if (moduleClass) {
    const moduleInstance = moduleClass.create();
    fallbackModules[moduleKey] = moduleInstance;
    return moduleInstance as AppModules[TKey];
  }

  throw new Error(
    `Module "${moduleKey}" is not registered. Use server.appendModule(...) before using it.`,
  );
}

export function createModuleProxy<TKey extends keyof AppModules & string>(
  moduleKey: TKey,
): AppModules[TKey] {
  return new Proxy({} as AppModules[TKey], {
    get(_target, prop) {
      const moduleInstance = getAppModule(moduleKey);
      const value = Reflect.get(moduleInstance as object, prop);

      if (typeof value === "function") {
        return value.bind(moduleInstance);
      }

      return value;
    },
  });
}
