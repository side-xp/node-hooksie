import { Hook } from './hook';
import type { HookHandle } from './hook-handle';
import type { HookCallback } from './types';

/**
 * Represents a group of hooks.
 */
export class HooksScope {

  /** {@link name} */
  private _name?: string;

  /**
   * The list of hooks declared from this scope.
   */
  private _hooks = new Map<string, Hook<any>>();

  /**
   * Public constructor.
   * @param name The name of this scope. This is mostly used for debug purposes.
   */
  public constructor(name?: string) {
    this._name = name;
  }

  /**
   * Gets the name of this scope.
   */
  public get name(): string | undefined {
    return this._name;
  }

  /**
   * Creates a new hook in this scope.
   * @param name The name of the hook to create in this scope.
   */
  public hook<T>(name: string): Hook<T> {
    if (this._hooks.has(name)) {
      throw new Error(`Failed to create a new hook in the scope "${this._name}": it already contains a hook named "${name}".`);
    }

    const newHook = new Hook<T>(name);
    this._hooks.set(name, newHook);
    return newHook;
  }

  /**
   * Attaches a callback to a named hook.
   * @param hookName The name of the hook to which the callback will be attached.
   * @param callback The callback to attach.
   * @param order The order of the callback in its owning hook. The lower the order, the first.
   * @returns Returns the created HookHandle that represents the attached callback.
   */
  public fasten<T, U extends HookCallback<T>>(hookName: string, callback: U, order?: number): HookHandle<T> {
    const hook = this._hooks.get(hookName);
    if (!hook) {
      throw new Error(`Failed to attach a callback to the hook "${hookName}" in scope ${this._name}: The named hook doesn't exist.`);
    }

    return hook.fasten<U>(callback, order);
  }

  /**
   * Detaches a given callback from all the hooks that may have it registered, from this scope.
   * @param callback The callback to detach.
   * @returns Returns true if the callback has been removed for at least one hook.
   */
  public detach<T, U extends HookCallback<T>>(callback: U): boolean;

  /**
   * Detaches a given callback from the named hook, from this scope.
   * @param hookName The name of the hook that owns the callback to detach.
   * @param callback The callback to detach.
   * @returns Returns true if the callback has been removed successfully.
   */
  public detach<T, U extends HookCallback<T>>(hookName: string, callback: U): boolean;

  /**
   * Detaches a given callback from the named hook, from this scope.
   * @param hookNameOrCallback The name of the hook that owns the callback to detach, or the callback itself.
   * @param callback The callback to detach.
   * @returns Returns true if the callback has been removed successfully.
   */
  public detach<T, U extends HookCallback<T>>(hookNameOrCallback: string | U, callback?: U): boolean {
    if (typeof hookNameOrCallback === 'string') {
      const hook = this._hooks.get(hookNameOrCallback);
      if (!hook) {
        throw new Error(`Failed to attach a callback to the hook "${hookNameOrCallback}" in scope ${this._name}: The named hook doesn't exist.`);
      }
      return hook.detach(callback as U);
    }
    else {
      let success = false;
      for (const [, h] of this._hooks) {
        if (h.detach(hookNameOrCallback)) {
          success = true;
        }
      }
      return success;
    }
  }

}