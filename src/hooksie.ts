import type { Hook } from './hook';
import type { HookHandle } from './hook-handle';
import { HooksScope } from './hooks-scope';
import type { HookCallback } from './types';

/**
 * Main class for using scopes and hooks.
 */
export class Hooksie {

  /** {@link instance} */
  private static _instance: Hooksie|null = null;

  /**
   * The full list of active scopes.
   */
  private _scopes = new Array<HooksScope>();

  /**
   * The scope used by default when using binding functions from the Hooksie instance withuot specifying a scope.
   */
  private _defaultScope: HooksScope;

  /**
   * Private constructor to avoid any conflicts.
   */
  private constructor() {
    this._defaultScope = Hooksie.scope('default');
  }

  /**
   * Gets the unique Hooksie instance.
   */
  public static get instance(): Hooksie {
    if (!this._instance) {
      this._instance = new Hooksie();
    }
    return this._instance;
  }

  /**
   * Creates a hooks scope for managing hooks at a specific level.
   * @param name The name of the scope to create. This is mostly used for debug purposes.
   * @returns Returns the created scope.
   */
  public static scope(name?: string): HooksScope {
    const newScope = new HooksScope(name);
    this.instance._scopes.push(newScope);
    return newScope;
  }

  /**
   * Creates a hook on the default scope.
   * @param name The name of the hook to create.
   * @returns Returns the created hook.
   */
  public static hook<T>(name: string): Hook<T> {
    return this.instance._defaultScope.hook(name);
  }

  /**
   * Attaches a callback to a named hook.
   * @param hookName The name of the hook to which the given callback will be attached.
   * @param callback The callback to attach to the named hook.
   * @param order The order of the callback in its owning hook. The lower the order, the first.
   */
  public static fasten<T, U extends HookCallback<T>>(hookName: string, callback: U, order?: number): HookHandle<T> | null {
    return this.instance._defaultScope.fasten<T, U>(hookName, callback, order);
  }

  /**
   * Detaches a given callback from all the hooks that may have it registered, from the default scope.
   * @param callback The callback to detach.
   * @returns Returns true if the callback has been removed for at least one hook.
   */
  public static detach<T, U extends HookCallback<T>>(callback: U): boolean;

  /**
   * Detaches a given callback from the named hook, from the default scope.
   * @param hookName The name of the hook that owns the callback to detach.
   * @param callback The callback to detach.
   * @returns Returns true if the callback has been removed successfully.
   */
  public static detach<T, U extends HookCallback<T>>(hookName: string, callback: U): boolean;

  /**
   * Detaches a given callback from the named hook, from the default scope.
   * @param hookNameOrCallback The name of the hook that owns the callback to detach, or the callback itself.
   * @param callback The callback to detach.
   * @returns Returns true if the callback has been removed successfully.
   */
  public static detach<T, U extends HookCallback<T>>(hookNameOrCallback: string | U, callback?: U): boolean {
    if (typeof hookNameOrCallback === 'string') {
      return this.instance._defaultScope.detach<T, U>(hookNameOrCallback, callback as U);
    }
    else {
      return this.instance._defaultScope.detach<T, U>(callback as U);
    }
  }

}

export default Hooksie.instance;