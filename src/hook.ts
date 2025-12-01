import { HookHandle } from './hook-handle';
import type { HookCallback } from './types';
import { getUniqueId } from './utils';

/**
 * Represents a hook to which callbacks can be attached.
 */
export class Hook<T> {

  /** {@link name} */
  private _name: string;

  /**
   * The list of handles representing the callbacks attached to this hook.
   */
  private _handles = new Array<HookHandle<T>>();

  /**
   * Public constructor.
   * @param name The name of this hook.
   */
  constructor(name: string) {
    this._name = name;
  }

  /**
   * Gets the name of this hook.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Attaches a callback to this hook.
   * @param callback The callback to attach.
   * @returns Returns the created HookHandle that represents the attached callback.
   */
  public fasten<U extends HookCallback<T>>(callback: U, order?: number): HookHandle<T> {
    const id = getUniqueId();
    const handle = new HookHandle(id, order, callback, () => this._removeCallback(id));
    this._handles.push(handle);
    return handle;
  }

  /**
   * Detaches a given callback from this hook.
   * @param callback The callback to detach.
   * @returns Returns true if the callback has been removed successfully.
   */
  public detach<U extends HookCallback<T>>(callback: U): boolean {
    for (const handle of this._handles) {
      if (handle && handle['_callback'] === callback) {
        return this._removeCallback(handle.id);
      }
    }
    return false;
  }

  /**
   * Invokes all the callbacks registered in this hook.
   */
  public async invoke(arg: T): Promise<boolean> {
    this._handles.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Copy the handles array to avoid missing
    const callbacks = this._handles.map(h => h['_callback']);
    const errors = new Array<any>();

    // Invoke all callbacks
    for (const c of callbacks) {
      try {
        await c(arg as any);
      }
      catch (error) {
        errors.push(error);
      }
    }

    // Log errors if applicable
    if (errors.length > 0) {
      for (const err of errors) {
        console.error(err);
      }
      console.error(`Errors when invoking hook "${this._name}". See previous logs for more info.`);
    }

    return errors.length <= 0;
  }

  /**
   * Invokes synchronously all the callbacks in this hook.
   */
  public invokeSync(arg: T): boolean {
    this._handles.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Copy the handles array to avoid missing
    const callbacks = this._handles.map(h => h['_callback']);
    const errors = new Array<any>();

    // Invoke all callbacks
    for (const c of callbacks) {
      try {
        c(arg as any);
      }
      catch (error) {
        errors.push(error);
      }
    }

    // Log errors if applicable
    if (errors.length > 0) {
      for (const err of errors) {
        console.error(err);
      }
      console.error(`Errors when invoking hook "${this._name}". See previous logs for more info.`);
    }

    return errors.length <= 0;
  }

  /**
   * Removes a callback from this hook, given its handle id.
   * @param handleId The id of the handle that represents the attached callback to remove.
   * @returns Returns true if the callback has been removed successfully.
   */
  private _removeCallback(handleId: number): boolean {
    const index = this._handles.findIndex(h => h.id === handleId);
    if (index < 0) {
      return false;
    }

    this._handles.splice(index, 1);
    return true;
  }

}