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
    this._defaultScope = this.scope('default');
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
  public scope(name?: string): HooksScope {
    const newScope = new HooksScope(name);
    this._scopes.push(newScope);
    return newScope;
  }

  /**
   * Creates a hook on the default scope.
   * @param name The name of the hook to create.
   * @returns Returns the created hook.
   */
  public hook(name: string): Hook {
    return this._defaultScope.hook(name);
  }

  /**
   * Attaches a callback to a named hook.
   * @param hookName The name of the hook to which the given callback will be attached.
   * @param callback The callback to attach to the named hook.
   * @param order The order of the callback in its owning hook. The lower the order, the first.
   */
  public fasten<T extends HookCallback>(hookName: string, callback: T, order?: number): HookHandle | null {
    return this._defaultScope.fasten<T>(hookName, callback, order);
  }

  /**
   * Detaches a given callback from all the hooks that may have it registered, from the default scope.
   * @param callback The callback to detach.
   * @returns Returns true if the callback has been removed for at least one hook.
   */
  public detach<T extends HookCallback>(callback: T): boolean;

  /**
   * Detaches a given callback from the named hook, from the default scope.
   * @param hookName The name of the hook that owns the callback to detach.
   * @param callback The callback to detach.
   * @returns Returns true if the callback has been removed successfully.
   */
  public detach<T extends HookCallback>(hookName: string, callback: T): boolean;

  /**
   * Detaches a given callback from the named hook, from the default scope.
   * @param hookNameOrCallback The name of the hook that owns the callback to detach, or the callback itself.
   * @param callback The callback to detach.
   * @returns Returns true if the callback has been removed successfully.
   */
  public detach<T extends HookCallback>(hookNameOrCallback: string | T, callback?: T): boolean {
    if (typeof hookNameOrCallback === 'string') {
      return this._defaultScope.detach(hookNameOrCallback, callback as T);
    }
    else {
      return this._defaultScope.detach(callback as T);
    }
  }

}

export default Hooksie.instance;