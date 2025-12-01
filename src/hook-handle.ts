import type { HookCallback } from './types';

/**
 * Represents a callback attached to a hook.
 */
export class HookHandle<T> {

  /** {@link id} */
  private _id: number;

  /** {@link order} */
  private _order: number|undefined;

  /**
   * The callback attached to the owning hook.
   */
  private _callback: HookCallback<T>;

  /**
   * The function to invoke whenever {@link detach}() is called.
   */
  private _onDetach: () => boolean;

  /**
   * 
   * @param id The unique id of this callback.
   * @param order The order of this callback in its owning hook. The lower the order, the first.
   * @param callback The attached callback.
   * @param onDetach The function to invoke {@link detach}() is called.
   */
  constructor(id: number, order: number|undefined, callback: HookCallback<T>, onDetach: () => boolean) {
    this._id = id;
    this._order = order;
    this._callback = callback;
    this._onDetach = onDetach;
  }

  /**
   * Gets the unique id of this handle.
   */
  public get id(): number {
    return this._id;
  }

  /**
   * Gets the order of this callback in its owning hook.
   */
  public get order(): number|undefined {
    return this._order;
  }
  
  /**
   * Sets the order of this callback in its owning hook. The lower the order, the first.
   */
  public set order(order: number|undefined) {
    this._order = order;
  }

  /**
   * Checks if the callback is an asynchronous function.
   */
  public get isAsync(): boolean {
    return this._callback.constructor.name === 'AsyncFunction';
  }

  /**
   * Remove this callback from the hook.
   * @returns Returns true if this callback has been removed successfully.
   */
  public detach(): boolean {
    return this._onDetach();
  }

}