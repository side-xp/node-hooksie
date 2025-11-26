import { HookHandle } from './hook-handle';
import type { HookCallback } from './types';
import { getUniqueId } from './utils';

/**
 * Represents a hook to which callbacks can be attached.
 */
export class Hook {

  /** {@link name} */
  private _name: string;
  
  /**
   * The list of handles representing the callbacks attached to this hook.
   */
  private _handles = new Map<number, HookHandle>();

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
  public fasten<T extends HookCallback>(callback: T, order?: number): HookHandle {
    const id = getUniqueId();
    const handle = new HookHandle(id, order, callback, () => this._removeCallback(id));
    this._handles.set(id, handle);
    return handle;
  }

  /**
   * Detaches a given callback from this hook.
   * @param callback The callback to detach.
   * @returns Returns true if the callback has been removed successfully.
   */
  public detach<T extends HookCallback>(callback: T): boolean {
    for (const [id, handle] of this._handles) {
      if (handle['_callback'] === callback) {
        return this._removeCallback(id);
      }
    }
    return false;
  }

  /**
   * Removes a callback from this hook, given its handle id.
   * @param handleId The id of the handle that represents the attached callback to remove.
   * @returns Returns true if the callback has been removed successfully.
   */
  private _removeCallback(handleId: number): boolean {
    return this._handles.delete(handleId);
  }

}